---
id: functions
title: Functions (beta)
description: 'Set up custom functions to run on events'
slug: /functions
---

Papercups now allows you to write custom scripts to be executed on our webhook events.

## Examples

Below are some examples of common use cases for taking advantage of Papercups Functions.

The code below will just include the `handleMessageCreated` logic, and omit the boilerplate:

```javascript
const papercups = require('@papercups-io/papercups')(
  process.env.PAPERCUPS_API_KEY
);

async function handler({event, payload}) {
  switch (event) {
    case 'message:created':
      return handleMessageCreated(payload);
    default:
      return {event, payload};
  }
}

async function handleMessageCreated(message) {
  // Implement me!
}
```

### Respond to test messages

If a user sends a message that starts with the string `test` (e.g. `Test`, `testing`, `test test test`), respond with `Success!`.

```javascript
// ... See boilerplate above!

async function handleMessageCreated(message) {
  const {body, conversation_id} = message;

  if (body.toLowerCase().startsWith('test')) {
    return papercups.messages.create({
      body: 'Success! :rocket:',
      type: 'bot',
      conversation_id,
    });
  }

  return null;
}
```

### Direct users to your pricing page

If a user sends a message that includes the string `pricing?`, reply with a link to the pricing page.

```javascript
// ... See boilerplate above!

async function handleMessageCreated(message) {
  const {body, conversation_id} = message;

  if (body.toLowerCase().includes('pricing?')) {
    return papercups.messages.create({
      body: 'View our pricing at [papercups.io/pricing](https://papercups.io/pricing)',
      type: 'bot',
      conversation_id,
    });
  }

  return null;
}
```

### Assign agents based on context

If a user sends a message that includes the string `sales`, automatically assign the conversation to the salesperson on the team.

```javascript
// ... See boilerplate above!

async function handleMessageCreated(message) {
  const {body, conversation_id} = message;

  if (body.toLowerCase().includes('sales')) {
    const [salesperson] = papercups.users.list({email: 'sales@papercups.io'});

    return papercups.conversations.update(conversation_id, {
      assignee_id: salesperson.id,
    });
  }

  return null;
}
```

## Coming soon

:::caution
Some of the methods below are currently in alpha, but will be publicly available soon!
:::

### Send alerts triggered by messages from premium users

When your team receives messages from premium customers, you can trigger alerts to Slack/SMS/email so that someone can respond right away.

```javascript
// ... See boilerplate above!

async function handleMessageCreated(message) {
  const {body, customer} = message;
  const {metadata = {}} = customer;
  const isPremiumCustomer = metadata.subscription === 'premium';

  if (isPremiumCustomer) {
    const notifications = [
      papercups.notify.slack({
        channel: '#notifications',
        text: `New message from premium customer: ${body}`,
      }),
      papercups.notify.sms({
        to: '+16501234567',
        body: `New message from premium customer: ${body}`,
      }),
      papercups.notify.gmail({
        to: 'me@company.co',
        subject: `New message from premium customer`,
        body: body,
      }),
    ];

    return Promise.all(notifications);
  }

  return null;
}
```

### Schedule an away message to be sent

If no one from your team is able to respond to a new message within 2 minutes, send an away message.

```javascript
// ... See boilerplate above!

async function handleMessageCreated(message) {
  const {conversation_id} = message;
  const [initialConversationMessage] = await papercups.messages.list({
    conversation_id,
    limit: 1,
  });
  const isInitialMessage = initialConversationMessage?.id === message.id;

  if (isInitialMessage) {
    return papercups.messages.create(
      {
        body: "We're not available at the moment, but we'll get back to you as soon as we can!",
        type: 'bot',
        conversation_id,
      },
      {
        schedule_in: 2 * 60 * 1000, // 2 minutes
        cancel_on: 'agent_reply', // Cancel scheduled message if agent replies in the meantime
      }
    );
  }

  return null;
}
```
