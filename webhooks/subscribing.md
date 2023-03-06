---
id: subscribing
title: Subscribing to events
description: 'Building your own integrations with webhooks'
slug: /subscribe-to-events
---

If you want to build your own integrations, you can quickly subscribe to Papercups events (e.g. `message:created`) via webhooks.

This page will walk you through setting up your own webhook URL. Let's get started!

### Step 1: Go to the Integrations page

After logging in, navigate to the [Integrations page](https://app.papercups.io/integrations) to get started: https://app.papercups.io/integrations

![](https://user-images.githubusercontent.com/5264279/90997389-62ddab80-e58f-11ea-89c4-78da69d8fefc.png)

### Step 2: Click "Add webhook URL"

Click the "Add webhook URL" to open the modal which will guide you through setting up your first webhook URL.

![](https://user-images.githubusercontent.com/5264279/90997390-63764200-e58f-11ea-81ed-e2892aab55c5.png)

### Step 3: Enter your webhook URL

Enter the URL that you would like Papercups to notify of new events. After you enter a URL, we will attempt to verify it by sending it a POST request with a request body that looks like:

```json
{
  "event": "webhook:verify",
  // Randomly generated string
  "payload": "ABC1XXXXXXXXXXXXXXXXXXXXX2WYZ"
}
```

In order to get your URL verified, it will need to respond with the randomly generated string in the `payload`. In a NodeJS backend, this might look something like:

```js
app.post('/api/webhook', (req, res) => {
  const {event, payload} = req.body;

  switch (event) {
    case 'webhook:verify':
      // Alternatively, this will work as well:
      // return res.json({challenge: payload})

      // Respond with the random string in the payload
      return res.send(payload);
    case 'message:created':
    case 'conversation:created':
    case 'customer:created':
      // TODO: handle events here!
      return res.json({ok: true});
  }
});
```

To quickly test that your endpoint is working as expected, the following cURL command should output `PONG`. (Note that it assumes your endpoint is called `/api/webhook` and is running on `localhost:3000`. Be sure to change the URL below to whatever you're using!)

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"event":"webhook:verify","payload":"PONG"}' \
  http://localhost:3000/api/webhook

# PONG%
```

_**NB:** In development, you may need to use a service like [ngrok](https://ngrok.com/) to test your webhook. URLs like `http://localhost:3000/api/webhook` or `127.0.0.1/api/webhook` will not work._

### Step 4: Respond to events

The following events will be sent to your webhook URL once it's verified:

- `message:created` - sent when a message is created
- `conversation:created`- sent when a conversation is created
- `conversation:updated`- sent when a conversation is updated (e.g. closed, assigned, etc)
- `customer:created` (coming soon!) - sent when a customer is created
- `customer:updated` (coming soon!) - sent when a customer is updated

As an example, the `message:created` event request body would look something like this:

```json
{
  "event": "message:created",
  "payload": {
    "account_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "attachments": [],
    "body": "Hey there!",
    "conversation_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "created_at": "2021-02-24T00:10:45",
    "customer": {
      "browser": "Chrome",
      "company_id": null,
      "created_at": "2021-02-02T20:35:01",
      "current_url": "http://myapp.co/account",
      "email": "joe@example.com",
      "external_id": "a1b2c3d4e5",
      "host": "myapp.co",
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "metadata": {
        "plan": "premium"
      },
      "name": "Joe",
      "object": "customer",
      "os": "Mac OS X",
      "pathname": "/account",
      "phone": null,
      "profile_photo_url": null,
      "updated_at": "2021-02-24T00:10:43"
    },
    "customer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "object": "message",
    "private": false,
    "seen_at": null,
    "sent_at": "2021-02-24T00:10:45Z",
    "type": "reply",
    "user": null,
    "user_id": null
  }
}
```

To see some examples of webhook integrations, check out this demo: https://github.com/papercups-io/webhooks-demo
