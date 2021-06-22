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
