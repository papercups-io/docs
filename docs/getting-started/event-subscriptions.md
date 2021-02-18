---
id: event-subscriptions
title: Event subscriptions with webhooks
description: 'Building your own integrations with webhooks'
slug: /event-subscriptions
---

If you want to build your own integrations, you can quickly subscribe to Papercups events (e.g. `message:created`) via webhooks.

## Setting up a webhook

### Step 1: Go to the Integrations page

After logging in, navigate to the [Integrations page](https://app.papercups.io/integrations) to get started: https://app.papercups.io/integrations

![](https://user-images.githubusercontent.com/5264279/90997389-62ddab80-e58f-11ea-89c4-78da69d8fefc.png)

### Step 2: Click "Add webhook URL"

Click the "Add webhook URL" to open the modal which will guide you through setting up your first webhook.

![](https://user-images.githubusercontent.com/5264279/90997390-63764200-e58f-11ea-81ed-e2892aab55c5.png)

### Step 3: Enter your webhook URL

Enter the URL that you would like Papercups to notify of new events. After you enter a URL, we will attempt to verify it by sending it a POST request with a request body that looks like:

```json
{
  "event": "webhook:verify",
  "payload": "_SOME_RANDOMLY_GENERATED_STRING_"
}
```

In order to get your URL verified, it will need to respond with the randomly generated string. In a Node backend, this might look something like:

```js
api.post('/webhook', (req, res) => {
  const {event, payload} = req.body;

  switch (event) {
    case 'webhook:verify':
      // Just respond with random string in the payload
      return res.send(payload);
    case 'message:created':
    // Not implemented yet
  }
});
```

_**NB:** In development, you may need to use a service like [ngrok](https://ngrok.com/) to test your webhook. URLs like `https://localhost:3000/api/webhook` or `127.0.0.1/api/webhook` will not work._

### Step 4: Respond to events

The following events will be sent to your webhook URL once it's verified:

- `message:created` - sent when a message is created
- `conversation:created` (coming soon!) - sent when a conversation is created
- `conversation:updated` (coming soon!) - sent when a conversation is updated (e.g. closed, assigned, etc)

As an example, the `message:created` event request body would look something like this:

```json
{
  "event": "message:created",
  "payload": {
    "body": "Hello world!",
    "created_at": "2020-09-01T23:00:00",
    "conversation_id": "xxx-xxxx-xxx",
    "customer_id": "xxx-xxxx-xxx"
  }
}
```

To see some examples of webhook integrations, check out this demo: https://github.com/reichert621/papercups-webhooks-demo
