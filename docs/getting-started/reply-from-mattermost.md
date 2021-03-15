---
id: reply-from-mattermost
title: Replying from Mattermost
description: 'Reply to messages directly from Mattermost'
slug: /reply-from-mattermost
---

Our **Mattermost** integration allows you to respond to messages from your customers directly from your self-hosted Mattermost instance.

This page will walk you through setting up the integration at https://app.papercups.io/integrations

:::caution
All the API tokens used in this guide have been revoked and are no longer valid. Please keep all your API tokens a secret!
:::

## Getting started

On the **Integrations** page at https://app.papercups.io/integrations, find **Reply from Mattermost** and click the "**Connect**" button:
![integrations-page-mattermost](https://user-images.githubusercontent.com/5264279/111208083-b30a7280-85a0-11eb-8671-aa2daf0131db.png)

A modal should pop up that looks like this:
![Mattermost authorization modal](https://user-images.githubusercontent.com/5264279/111202805-aedb5680-859a-11eb-86de-c805c2f8e306.png)

## Your Mattermost URL

First, you'll need to fill in your **Mattermost URL**.

Your Mattermost URL is simply the URL at which your Mattermost instance is hosted. (If you don't already have Mattermost and want to try it, the easiest way to get your own instance set up is by **deploying to Heroku**: https://github.com/mattermost/mattermost-server#deploy-on-heroku)

For example, the URL we use for our Mattermost demo would be: https://papercups-mattermost-demo.herokuapp.com
![Mattermost dashboard URL](https://user-images.githubusercontent.com/5264279/111203020-e21de580-859a-11eb-81c7-169f93aaa1d9.png)

Fill in your **Mattermost URL** here:
![papercups-ui-mattermost-url](https://user-images.githubusercontent.com/5264279/111204468-881e1f80-859c-11eb-8691-cce51852fa08.png)

## Getting a bot token

In order to get a bot token for Papercups, you may need to first enable bot accounts in your settings.

### Enabling bot accounts

To enable bot accounts, you'll need to navigate to `Menu > System Console > Integrations > Bot Accounts`.

First, open the menu and navigate to the **System Console**:
![Mattermost menu System Console](https://user-images.githubusercontent.com/5264279/111203164-0679c200-859b-11eb-92fd-650a2063e6ac.png)

Then, navigate to the **Bot Accounts** subsection under the **Integrations** section.
![System Console Bot Accounts](https://user-images.githubusercontent.com/5264279/111203187-10032a00-859b-11eb-85cb-4a0285661b2a.png)

Set **Enable Bot Account Creation** to **true** and hit the **Save** button at the bottom.

### Creating a bot account

Next, set up your bot account by navigating to `Menu > Integrations > Bot Accounts > Add Bot Account`.

First, open the menu and navigate to the **Integrations**:
![menu-integrations](https://user-images.githubusercontent.com/5264279/111204134-35446800-859c-11eb-9a72-cb8ddf54c45f.png)

On the **Integrations** page, navigate to **Bot Accounts**:
![mattermost-integrations-bot-accounts](https://user-images.githubusercontent.com/5264279/111203578-93248000-859b-11eb-8fdf-654b530282b8.png)

Click the "**Add Bot Account**" button:
![mattermost-add-bot-account-page](https://user-images.githubusercontent.com/5264279/111203639-a3d4f600-859b-11eb-815c-55c2b2b935ba.png)

Then, enter the following information in the **Add Bot Account** form:
![mattermost-add-bot-account](https://user-images.githubusercontent.com/5264279/111203651-a7687d00-859b-11eb-930d-221b380eb249.png)

Bot account details:

- **Username**: `papercups` (name this whatever you want)
- **Display Name**: `Papercups` (name this whatever you want)
- **Role**: `System Admin` (important!)

Click "**Create Bot Account**". That should lead you to this page:
![bot-account-success](https://user-images.githubusercontent.com/5264279/111203977-08905080-859c-11eb-8bab-44455d087605.png)

Take note of the **Token**. This is the bot token which you should paste into Papercups:
![papercups-ui-bot-token](https://user-images.githubusercontent.com/5264279/111204526-979d6880-859c-11eb-9468-ad0da5a6216c.png)

## Select a channel to reply from

If your bot token is working properly, you should now be able to **select the channel** from which you would like to reply to messages from Papercups.

![Select Mattermost channel](https://user-images.githubusercontent.com/5264279/111204986-15fa0a80-859d-11eb-9e5d-3772cf7bb097.png)

_As a best practice, it's good to set up a channel dedicated to responding to messages and nothing else._

## Setting up an outgoing webhook

In order to reply to messages directly from Mattermost, you'll need to set up an outgoing webhook.

To do this, navigate to `Menu > Integrations > Outgoing Webhooks > Add Outgoing Webhook`

Once again, open the menu and navigate to the **Integrations**:
![menu-integrations](https://user-images.githubusercontent.com/5264279/111204134-35446800-859c-11eb-9a72-cb8ddf54c45f.png)

On the **Integrations** page, navigate to **Outgoing Webhooks**:
![Integrations page outgoing webhooks](https://user-images.githubusercontent.com/5264279/111205178-548fc500-859d-11eb-9f32-428221f58449.png)

_If you don't see this option, you may need to [enable outgoing webhooks](#enabling-outgoing-webhooks)._

Click the "**Add Outgoing Webhook**" button:
![mattermost-outgoing-webhooks-page](https://user-images.githubusercontent.com/5264279/111205403-96b90680-859d-11eb-8fd6-723bb96404bb.png)

Then, enter the following information in the form:
![mattermost-add-outgoing-webhook](https://user-images.githubusercontent.com/5264279/111205701-e4ce0a00-859d-11eb-86a3-b480c17cf289.png)

Outgoing webhook details:

- **Title**: `Papercups`
- **Description**: `Webhook events for the Papercups integration`
- **Content Type**: `application/json` (important!)
- **Channel**: _Should match the channel you chose above_ (important!)
- **Callback URLs**: `https://app.papercups.io/api/mattermost/webhook` (important!)

Click **Save**. After creating the new outgoing webhook, take note of the **Token**.
![mattermost-webhook-success](https://user-images.githubusercontent.com/5264279/111205731-eef00880-859d-11eb-86cf-a27d2d075211.png)

Finally, copy the token into the Papercups UI:
![papercups-ui-webhook-token](https://user-images.githubusercontent.com/5264279/111205929-25c61e80-859e-11eb-8034-d6347a330299.png)

### Enabling outgoing webhooks

If you don't see an option for outgoing webhooks, you may need to enable it. 

You can do this by navigating to `Menu > System Console > Integrations > Integrations Management` and setting **Enable Outgoing Webhooks** set to **true**.

## Testing the integration

The easiest way to test that everything is working is by going to the **Getting Started** page at https://app.papercups.io/account/getting-started
![reply-from-mattermost](https://user-images.githubusercontent.com/5264279/111211777-33cb6d80-85a5-11eb-951d-38a70d875d60.gif)

From here, you can test sending messages through the chat widget to verify that they show up in your Mattermost channel.

In order to reply from Mattermost, simply reply to the message in a thread.

<!-- 
## Troubleshooting

TODO:
- Enabling bot accounts
- Enabling outgoing webhooks
- Including http/https in Mattermost URL
- Testing with ngrok 
-->