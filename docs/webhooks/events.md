---
id: events
title: Webhook events
description: 'The different types of webhook events'
slug: /webhook-events
---

We currently support the following webhook events:

- [`webhook:verify`](#webhookverify)
- [`message:created`](#messagecreated)
- [`conversation:created`](#conversationcreated)
- [`conversation:updated`](#conversationupdated)
- [`customer:created`](#customercreated) (coming soon!)
- [`customer:updated`](#customerupdated) (coming soon!)

_See below to learn more about each event, and view example payloads._

### `webhook:verify`

The `webhook:verify` event is sent when setting up your webhook URL. In order to verify your URL, it will need to respond with the `payload` sent with the event.

Example:

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

### `message:created`

The `message:created` event is sent whenever a new message is created. A message may be created from any channel: the chat widget, the dashboard, Slack, etc.

Example:

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

### `conversation:created`

The `conversation:created` event is sent whenever a new conversation is started.

Example:

```json
{
  "event": "conversation:created",
  "payload": {
    "account_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "assignee_id": null,
    "closed_at": null,
    "created_at": "2021-02-24T00:20:30",
    "customer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "object": "conversation",
    "priority": "not_priority",
    "read": false,
    "source": "chat",
    "status": "open"
  }
}
```

### `conversation:updated`

The `conversation:updated` event is sent whenever a conversation is updated.

Things to note:

- the `payload` included in this event represents the entire conversation record, not the diff
- this event may get fired if a database update is triggered, even if the data hasn't changed

Example:

```json
{
  "event": "conversation:updated",
  "payload": {
    "account_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "assignee_id": 1,
    "closed_at": null,
    "created_at": "2021-02-23T00:30:00",
    "customer_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "object": "conversation",
    "priority": "not_priority",
    "read": false,
    "source": "chat",
    "status": "open"
  }
}
```

### `customer:created`

The `customer:created` event is sent whenever a new customer record is created.

Not yet implemented.

### `customer:updated`

The `customer:updated` event is sent whenever a customer is updated.

Not yet implemented.
