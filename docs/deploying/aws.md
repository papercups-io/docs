---
id: aws
title: Deploy on AWS
description: "Deploying on AWS"
slug: /aws
---

This guide uses AWS Aurora as a database, `eksctl` to deploy the application, and AWS Load Balancer Controller and External DNS to realize Ingress resources.

#### Production warning

Please take note that these instructions are intended as a guide. Your needs will dictate how to deploy papercups into your environment.
Some considerations which must be taken into account when deploying to production include:
 - Securing the Database's credentials, encryption at rest and in transit, backups and disaster planning, etc..
 - We are reusing the same subnets for application to database communication as we are for ALB to application communication. You may wish to separate these subnets.
 - We are enabling database network connectivity to the entire node pool. You may wish to [use amazon-vpc-cni-k8s to attach security groups to the pods](
     https://docs.aws.amazon.com/eks/latest/userguide/security-groups-for-pods.html).
 - You may wish to enable SSL support.

Your pre-existing infrastructure will dictate what steps you must perform or skip.

This guide is not meant to dictate architecture, but merely represents a possible path. You might choose to use Aurora, as described here, or an RDS instance, or the [Bitnami Postgresql chart](https://github.com/papercups-io/charts/tree/main/charts/papercups). You may choose to use EKS, or ECS, with `eksctl` or with `kops`. There are many variables available to chooose from, and this approach should be used as the start of a conversation. Please find us at [slack](https://papercups-io.slack.com/archives/C01S4C95JS0) to chat!

## Prerequisites

- An [AWS account setup and activated](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

- The versions of tools used to produce this guide are: 
   ```
   kubectl: 1.20.2  
   helm: 3.3.4  
   eksctl: 0.43.0-rc.0  
   ```
   If you encounter any issues, please check the version of tool you have installed.

   - For more information, see 
     - [installing kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html).
     - [installing helm](https://helm.sh/docs/intro/install/).
     - [the eksctl command line utility](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html).
- [Setup your environment variables with an AWS access key and secret](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html).


## Step By Step Installation

This guide presumes a clean AWS account with no resources.
### Database Setup (Aurora)

1. Create Security Group for Aurora.
  ```bash
  # Create a VPC security group for Aurora
  aws ec2 create-security-group \
    --description "Allow connections to Aurora" \
    --group-name "papercups-db"
  ```
1. Create an RDS instance for your cluster
  ```bash
  # Create the Aurora instance
  # WARNING: In production, you probably donut want AutoPause enabled
  aws rds create-db-cluster \
    --engine aurora-postgresql \
    --db-cluster-identifier papercups \
    --engine-mode serverless \
    --scaling-configuration MinCapacity=2,MaxCapacity=4,SecondsUntilAutoPause=300,AutoPause=true \
    --master-username papercups \
    --master-user-password changeit \
    --vpc-security-group-ids $(aws ec2 describe-security-groups --group-name "papercups-db"  --query 'SecurityGroups[0].GroupId' --output text)
  ```

### EKS Setup

1. Create the cluster with the subnets from the "default" db subnet group.
  ```bash
  eksctl create cluster \
    --name papercups \
    --version=1.19 \
    --enable-ssm \
    --vpc-public-subnets=$(aws rds describe-db-subnet-groups --db-subnet-group-name "default" --query 'DBSubnetGroups[-1].Subnets[*].SubnetIdentifier' --output text | perl -pe 's/\h/,/g')
  ```
1. Enable the Node Group security group to communicate with the Aurora cluster.
  ```bash
  # Enable Node Group to DB communication
  aws ec2 authorize-security-group-ingress \
    --group-name "papercups-db" \
    --source-group $(eksctl utils describe-stacks --cluster=papercups-eks -o json -v 0 | jq --raw-output '.[].Outputs[] | select(.OutputKey == "SharedNodeSecurityGroup").OutputValue') \
    --protocol tcp \
    --port 5432
  ```
#### Setup the AWS Load Balancer Controller
1. Tag the subnets as usable by the ELB.
  ```bash
  aws ec2 create-tags \
    --resources $(aws rds describe-db-subnet-groups --db-subnet-group-name "default" --query 'DBSubnetGroups[-1].Subnets[*].SubnetIdentifier' --output text) \
    --tags Key=kubernetes.io/role/elb,Value=1 Key=kubernetes.io/cluster/papercups,Value=shared
  ```

2. Download AWSLoadBalancerControllerIAMPolicy
  ```bash
  curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.1.3/docs/install/iam_policy.json
  ```

3. Create AWSLoadBalancerControllerIAMPolicy
  ```bash
  aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json
  ```

4. Create IAM Open ID Connect provider
  ```bash
  eksctl utils associate-iam-oidc-provider --region=us-west-2 --cluster=papercups --approve
  ```

5. Install the AWS Load Balancer Controller
  ```bash
  eksctl create iamserviceaccount \
    --cluster=papercups \
    --namespace=kube-system \
    --name=aws-load-balancer-controller \
    --attach-policy-arn=arn:aws:iam::$(aws sts get-caller-identity --query 'Account' --output text):policy/AWSLoadBalancerControllerIAMPolicy \
    --override-existing-serviceaccounts \
    --approve
  ```

6. Check to see if the controller is installed.  
  ```bash
  kubectl get deployment -n kube-system alb-ingress-controller
  ```
7. If Step 6 had a result, perform step 5 from https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
   
8. Install the TargetGroupBinding CRD
  ```bash
  kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"
  ```

9. Add the EKS-charts repository
  ```bash
  helm repo add eks https://aws.github.io/eks-charts
  ```

10. Use Helm to install the AWS Load Balancer Controller to the kube-system namespace
  ```bash
  helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller \
    --set clusterName=papercups \
    --set serviceAccount.create=false \
    --set serviceAccount.name=aws-load-balancer-controller \
    -n kube-system
  ```

11. Verify the controller is installed
  ```bash
  kubectl get deployment -n kube-system aws-load-balancer-controller
  ```

#### Setup the External DNS Controller
> If you choose to skip this section, after deploying Papercups and the ingress controller is created, add a CNAME or ALIAS record for `papercups.example.com` that points to the created load balancer from `kubectl --namespace papercups describe ing papercups`*

1. Create the IAM policy.
   
   You may wish to fine tune this policy document to only permit explicit Hosted Zone IDs
  ```bash
  # Press Ctrl+D after pasting this.
  cat > policy-document.json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "route53:ChangeResourceRecordSets"
        ],
        "Resource": [
          "arn:aws:route53:::hostedzone/*"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "route53:ListHostedZones",
          "route53:ListResourceRecordSets"
        ],
        "Resource": [
          "*"
        ]
      }
    ]
  }

  ```  
  ```bash
  # Create AllowExternalDNSUpdates
  aws iam create-policy \
    --policy-name AllowExternalDNSUpdates \
    --policy-document file://policy-document.json
  ```
2. Create the service account.
  ```bash
  # Install the AWS Load Balancer Controller
  eksctl create iamserviceaccount \
    --cluster=papercups \
    --namespace=kube-system \
    --name=external-dns-controller \
    --attach-policy-arn=arn:aws:iam::$(aws sts get-caller-identity --query 'Account' --output text):policy/AllowExternalDNSUpdates \
    --override-existing-serviceaccounts \
    --approve
  ```

3. If you need to create the hosted zone, do so now. Take note of the output of the command.
  ```bash
  # Create example.com.
  aws route53 create-hosted-zone --name "papercupsexample.com." --caller-reference "papercupsexample-com-$(date +%s)"
  ```
4. In case you forget, this is how you recall the HostedZoneID and Name Servers for the zone.
  ```bash
  # This is the Hosted Zone ID. 
  aws route53 list-hosted-zones-by-name --output text --dns-name "papercupsexample.com." --query 'HostedZones[0].Id'
  ```
  ```bash
  # These are the Name Servers for the new zone. You'll want to update your Registrar with these.
  aws route53 list-resource-record-sets \
    --output text \
    --hosted-zone-id $(aws route53 list-hosted-zones-by-name --output text --dns-name "papercupsexample.com." --query 'HostedZones[0].Id') \
    --query "ResourceRecordSets[?Type == 'NS'].[*][0][0][3][*].Value"
  ```
5. Deploy the external-dns-controller
  ```bash
  # Add the bitnami repository
  helm repo add bitnami https://charts.bitnami.com/bitnami
  ```
  ```bash
  # Install the External DNS Controller
  helm upgrade -i external-dns-controller bitnami/external-dns \
    --set provider=aws \
    --set txtPrefix=external-dns-controller@papercups \
    --set domainFilters[0]=papercupsexample.com. \
    --set serviceAccount.create=false \
    --set serviceAccount.name=external-dns-controller \
    --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=arn:aws:iam::$(aws sts get-caller-identity --query 'Account' --output text):policy/AllowExternalDNSUpdates \
    -n kube-system
  ```
  ```bash
  # Verify the controller is installed
  kubectl get deployment -n kube-system external-dns-controller
  ```

### Deploying Papercups

1. Deploy the application using helm
  ```bash
  helm repo add papercups http://helm.papercups.io/
  ```
  ```bash
  helm upgrade -i papercups-release papercups/papercups \
    --create-namespace \
    --namespace papercups \
    --set configMap:BACKEND_URL=www.papercupsexample.com \
    --set ingress.annotations."kubernetes\.io/ingress\.class"=alb \
    --set ingress.annotations."alb\.ingress\.kubernetes\.io/scheme"=internet-facing \
    --set ingress.annotations."alb\.ingress\.kubernetes\.io/target-type"=instance \
    --set ingress.enabled=true \
    --set ingress.hosts[0].host=www.papercupsexample.com \
    --set ingress.hosts[0].paths[0]=\/ \
    --set secrets.DATABASE_URL="ecto://papercups:changeit@$(aws rds describe-db-clusters --db-cluster-identifier papercups --query 'DBClusters[0].Endpoint' | sed -e 's/\"//g')/papercups" \
    --set service.type="NodePort"
  ```
1. Follow up to check on the status of the deployment.
  ```bash
  kubectl logs -n papercups $(kubectl get po -n papercups | grep Running | egrep -o 'papercups-release[a-zA-Z0-9-]+')
2. Follow up to check on the status of the ingress controller
  ```bash
  kubectl --namespace papercups describe ing papercups
  ```
  ```bash
  # Observe the logs of the aws-load-balancer-controller if you are having trouble
  kubectl logs -n kube-system $(kubectl get po -n kube-system | egrep -o 'aws-load-balancer-controller[a-zA-Z0-9-]+')
  ```
  ```bash
  # Observe the logs of the external-dns-controller if you are having trouble
  kubectl logs -n kube-system $(kubectl get po -n kube-system | egrep -o 'external-dns-controller[a-zA-Z0-9-]+')
  ```



## Deleting the deployment


1. Delete the EKS cluster
   ```bash
      eksctl delete cluster --name papercups
      ```
1. Delete the RDS instance
   ```bash
      aws rds delete-db-cluster --db-cluster-idenfitier papercups
      ```


## References

#### EKS
- [Creating an Amazon EKS Cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)

#### AWS Load Balancer Controller
- [EKS-chart](https://github.com/aws/eks-charts/tree/master/stable/aws-load-balancer-controller)
- [Userguide](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
- [Application guide](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/)

#### External-DNS
- [Bitnami chart](https://github.com/bitnami/charts/tree/master/bitnami/external-dns)
- [Application guide](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md)

#### Papercups
- [Papercups Chart](https://artifacthub.io/packages/helm/papercups/papercups)
