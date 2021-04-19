---
id: reply-via-sms
title: Replying via SMS
description: 'Reply to messages via SMS using Twilio'
slug: /reply-via-sms
---

Our [Twilio](https://www.twilio.com/) integration allows you to seamlessly receive and reply to Papercups messages via SMS.

Customer messages sent from our widget will be routed to your phone as SMS, and replying to that SMS from your phone will send a Papercups message back to the customer.

This page will walk you through setting up the integration.

## Setup overview

Setup is only a few steps. You'll need to:

1. [Create a Twilio account](https://www.twilio.com/try-twilio).
2. From your [Twilio Console](https://www.twilio.com/console), grab your Twilio [Account SID](https://www.twilio.com/docs/glossary/what-is-a-sid) and [Auth Token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them) (links for extra reference).
3. Enter them into our [Integrations](https://app.papercups.io/integrations) page.
4. Set up a [Twilio Messaging Service](https://www.twilio.com/console/sms/services) and add a webhook to it.

## Step-by-step setup guide

The following is an expanded version of the instructions above, with screenshots.

### 1. Create a Twilio account

First, [create a Twilio account](https://www.twilio.com/try-twilio) unless you already have one. Complete account verification.

![create-twilio-account](https://user-images.githubusercontent.com/7440689/115025949-edad4680-9e8f-11eb-8794-a0fdbe0b7ccb.png)

### 2. Copy your Twilio Account SID and Auth Token from your Twilio Console

After verifying your new Twilio account, go to the [Twilio Console](https://www.twilio.com/console). From here, you can access two important pieces of information: your Twilio [Account SID](https://www.twilio.com/docs/glossary/what-is-a-sid) and [Auth Token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them).

![twilio-console](https://user-images.githubusercontent.com/7440689/115027905-4a116580-9e92-11eb-8303-c7d1c1ad1bad.png)

### 3. Enter your Twilio Account SID and Auth Token into Papercups

In another window, open up the [Papercups Integrations page](https://app.papercups.io/integrations) page. In the Twilio row, click the **Connect** button. Enter your Twilio Account SID and Auth Token and your phone number here.

![papercups-integrations](https://user-images.githubusercontent.com/7440689/115029105-a45ef600-9e93-11eb-984b-1aa93f54f534.gif)

### 4. Create a Twilio Messaging Service

Head back to your Twilio console. You'll need to [create a Twilio Messaging Service](https://www.twilio.com/console/sms/services).

![twilio-messaging-service](https://user-images.githubusercontent.com/7440689/115096149-fc2c4a00-9ef1-11eb-8ebb-e1e2ad886a35.png)

### 5. Add our webhook endpoint to the Messaging Service

Inside the settings for that Messaging Service, go to the Integrations tab.

It'll look like this:

![twilio-integrations-tab](https://user-images.githubusercontent.com/7440689/115097622-4c5ada80-9ef9-11eb-89e4-b609e6b23551.png)

1. First, select **Incoming Messages** > Send a webhook.

2. Then, paste your **Request URL**. If you're using the standard (not self-hosted) version of Papercups, you should use this:

```bash
https://app.papercups.io/api/twilio/webhook
```

3. Finally, click Save at the bottom.

Congrats! You're all set up.
