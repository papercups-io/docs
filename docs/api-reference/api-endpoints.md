---
id: api-endpoints
title: API endpoints
description: 'Public Papercups API endpoints'
slug: /api-endpoints
---

The Papercups API is organized around REST. Our API has predictable resource-oriented URLs, accepts both form-encoded and JSON request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

Before you can use the API, you'll need to [get an API key](api-keys).

### Users

A user represents a person with a Papercups account. For your company's users, see `customers` below.

#### Retrieve your personal information

```bash title="GET /api/v1/me"
curl https://app.papercups.io/api/v1/me \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

### Conversations

A conversation represents a thread of messages.

#### The conversation object

```json
{
  "id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
  "object": "conversation",
  "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
  "assignee_id": 1,
  "closed_at": null,
  "created_at": "2021-02-24T17:24:37",
  "customer": {...},
  "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
  "id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
  "messages": [{...}],
  "priority": "not_priority",
  "read": true,
  "source": "chat",
  "status": "open",
  "tags": []
}
```

#### Create a conversation

```bash title="POST /api/v1/conversations"
curl https://app.papercups.io/api/v1/conversations \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X POST \
  -d "conversation[customer_id]"=[customer_id] \
  -d "conversation[source]"="chat" \
  -d "conversation[status]"="open"
```

```json title="Response"
{
  "data": {
    "id": "05f67a21-xxxx-xxxx-xxxx-71b22039cf49",
    "object": "conversation",
    "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
    "assignee_id": null,
    "closed_at": null,
    "created_at": "2021-02-25T18:00:00",
    "customer_id": "...",
    "priority": "not_priority",
    "read": false,
    "source": "chat",
    "status": "open"
  }
}
```

#### Retrieve a conversation

```bash title="GET /api/v1/conversations/:id"
curl https://app.papercups.io/api/v1/conversations/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

```json title="Response"
{
  "data": {
    "id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
    "object": "conversation",
    "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
    "assignee_id": 1,
    "closed_at": null,
    "created_at": "2021-02-24T17:24:37",
    "customer": {...},
    "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
    "messages": [{...}],
    "priority": "not_priority",
    "read": true,
    "source": "chat",
    "status": "open",
    "tags": []
  }
}
```

#### Update a conversation

```bash title="PUT /api/v1/conversations/:id"
curl https://app.papercups.io/api/v1/conversations/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X PUT \
  -d "conversation[status]"="closed"
```

```json title="Response"
{
  "data": {
    "id": "05f67a21-xxxx-xxxx-xxxx-71b22039cf49",
    "object": "conversation",
    "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
    "assignee_id": null,
    "closed_at": "2021-02-25T18:55:00Z",
    "created_at": "2021-02-25T18:50:00",
    "customer_id": "...",
    "priority": "not_priority",
    "read": false,
    "source": "chat",
    "status": "closed"
  }
}
```

#### Delete a conversation

```bash title="DELETE /api/v1/conversations/:id"
curl https://app.papercups.io/api/v1/conversations/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X DELETE
```

```bash title="Response"
No response
```

#### List all conversations

```bash title="GET /api/v1/conversations"
curl https://app.papercups.io/api/v1/conversations \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

We also support filtering by `status`, `priority`, `customer_id`, and `assignee_id`:

```bash title="GET /api/v1/conversations?status=closed"
curl https://app.papercups.io/api/v1/conversations \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -G \
  -d status="closed"
```

```json title="Response"
{
  "data": [
    {
      "id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
      "object": "conversation",
      "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
      "assignee_id": 1,
      "closed_at": null,
      "created_at": "2021-02-24T17:24:37",
      "customer": {...},
      "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
      "id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
      "messages": [{...}],
      "priority": "not_priority",
      "read": true,
      "source": "chat",
      "status": "closed",
      "tags": []
    },
    {
      "id": "1a2b3c4d-xxxx-xxxx-xxxx-5e6f7g8h9i0j",
      "object": "conversation",
      ...
    }
  ]
}
```

### Customers

A customer represents one of your business's users, leads, or contacts.

#### The customer object

```json
{
  "id": "b4b6eaa9-xxxx-xxxx-xxxx-7c8b6fd36974",
  "object": "customer",
  "browser": "Chrome",
  "company": null,
  "company_id": null,
  "created_at": "2020-12-18T10:00:00",
  "current_url": "http://localhost:3000/",
  "email": "test@test.com",
  "external_id": "1a2b3c",
  "first_seen": "2020-12-19",
  "host": "localhost:3000",
  "ip": "127.0.0.1",
  "last_seen": "2020-12-19",
  "metadata": {
    "age": 25,
    "plan": "starter",
    "registered_at": "2020-09-01",
    "valid": true
  },
  "name": "Test User",
  "os": "Mac OS X",
  "pathname": "/",
  "phone": "1231231230",
  "profile_photo_url": null,
  "tags": [],
  "time_zone": "America/New_York",
  "updated_at": "2021-02-22T11:50:00"
}
```

#### Create a customer

```bash title="POST /api/v1/customers"
curl https://app.papercups.io/api/v1/customers \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X POST \
  -d "customer[name]"="Alex" \
  -d "customer[email]"="alex@alex.com" \
  -d "customer[external_id]"="abc123" \
  -d "customer[account_id]"=[account_id]
```

```json title="Response"
{
  "data": {
    "id": "0e52c2c9-xxxx-xxxx-xxxx-9094418f22fd",
    "object": "customer",
    "browser": null,
    "company": null,
    "company_id": null,
    "created_at": "2021-02-25T20:51:48",
    "current_url": null,
    "email": "alex@alex.com",
    "external_id": "abc123",
    "first_seen": "2021-02-25",
    "host": null,
    "ip": "127.0.0.1",
    "last_seen": "2021-02-25",
    "metadata": null,
    "name": "Alex",
    "os": null,
    "pathname": null,
    "phone": null,
    "profile_photo_url": null,
    "tags": [],
    "time_zone": null,
    "updated_at": "2021-02-25T20:50:40"
  }
}
```

#### Retrieve a customer

```bash title="GET /api/v1/customers/:id"
curl https://app.papercups.io/api/v1/customers/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

```json title="Response"
{
  "data": {
    "id": "b4b6eaa9-xxxx-xxxx-xxxx-7c8b6fd36974",
    "object": "customer",
    "browser": "Chrome",
    "company": null,
    "company_id": null,
    "created_at": "2020-12-18T10:00:00",
    "current_url": "http://localhost:3000/",
    "email": "test@test.com",
    "external_id": "1a2b3c",
    "first_seen": "2020-12-19",
    "host": "localhost:3000",
    "ip": "127.0.0.1",
    "last_seen": "2020-12-19",
    "metadata": {
      "age": 25,
      "plan": "starter",
      "registered_at": "2020-09-01",
      "valid": true
    },
    "name": "Test User",
    "os": "Mac OS X",
    "pathname": "/",
    "phone": "1231231230",
    "profile_photo_url": null,
    "tags": [],
    "time_zone": "America/New_York",
    "updated_at": "2021-02-22T11:50:00"
  }
}
```

#### Update a customer

```bash title="PUT /api/v1/customers/:id"
curl https://app.papercups.io/api/v1/customers/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X PUT \
  -d "customer[phone]"="650-555-6789"
```

```json title="Response"
{
  "data": {
    "id": "0e52c2c9-xxxx-xxxx-xxxx-9094418f22fd",
    "object": "customer",
    "browser": null,
    "company": null,
    "company_id": null,
    "created_at": "2021-02-25T20:51:48",
    "current_url": null,
    "email": "alex@alex.com",
    "external_id": "abc123",
    "first_seen": "2021-02-25",
    "host": null,
    "ip": "127.0.0.1",
    "last_seen": "2021-02-25",
    "metadata": null,
    "name": "Alex",
    "os": null,
    "pathname": null,
    "phone": "650-555-6789",
    "profile_photo_url": null,
    "tags": [],
    "time_zone": null,
    "updated_at": "2021-02-25T20:50:40"
  }
}
```

#### Delete a customer

```bash title="DELETE /api/v1/customers/:id"
curl https://app.papercups.io/api/v1/customers/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X DELETE
```

```bash title="Response"
No response
```

#### List all customers

```bash title="GET /api/v1/customers"
curl https://app.papercups.io/api/v1/customers \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

We also support filtering by `name`, `email`, `host`, and `company_id`:

```bash title="GET /api/v1/customers?name=Alex"
curl https://app.papercups.io/api/v1/customers \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -G \
  -d name="Alex"
```

```json title="Response"
{
  "data": [
    {
      "id": "a73f2841-xxxx-xxxx-xxxx-99e9437ec96f",
      "object": "customer",
      "name": "Alex",
      "browser": null,
      "company": null,
      "company_id": null,
      "created_at": "2021-02-25T20:50:00",
      "current_url": null,
      "email": "alex@alex.com",
      "external_id": "abc123",
      "first_seen": "2021-02-25",
      "host": null,
      "ip": "127.0.0.1",
      "last_seen": "2021-02-25",
      "metadata": null,
      "os": null,
      "pathname": null,
      "phone": null,
      "profile_photo_url": null,
      "tags": [],
      "time_zone": null,
      "updated_at": "2021-02-25T20:00:00"
    },
    {
      "id": "0e52c2c9-xxxx-xxxx-xxxx-9094418f22fd",
      "object": "customer",
      "name": "Alex",
      ...
    }
  ]
}
```

### Messages

Represents messages sent from the chat widget, the dashboard, Slack, etc.

#### The message object

```json
{
  "id": "2a1239b8-xxxx-xxxx-xxxx-16267296abcf",
  "object": "message",
  "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
  "attachments": [],
  "body": "Hello world!",
  "conversation_id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
  "created_at": "2021-02-24T17:00:30",
  "customer": {
    "browser": "Chrome",
    "company_id": null,
    "created_at": "2021-02-24T17:20:30",
    "current_url": "http://localhost:3000/demo",
    "email": null,
    "external_id": null,
    "host": "localhost:3000",
    "id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
    "metadata": null,
    "name": null,
    "object": "customer",
    "os": "Mac OS X",
    "pathname": "/demo",
    "phone": null,
    "profile_photo_url": null,
    "updated_at": "2021-02-24T17:24:38"
  },
  "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
  "private": false,
  "seen_at": null,
  "sent_at": "2021-02-24T17:00:30Z",
  "type": "reply",
  "user": null,
  "user_id": null
}
```

#### Create a message

```bash title="POST /api/v1/messages"
curl https://app.papercups.io/api/v1/messages \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X POST \
  -d "message[body]"="How can I help you?" \
  -d "message[conversation_id]"="56d2cfd6-c8a6-410b-93f5-c4770868ee4c"
```

```json title="Response"
{
  "data": {
    "id": "62dfee85-xxxx-xxxx-xxxx-5d0759f6495b",
    "object": "message",
    "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
    "attachments": [],
    "body": "How can I help you?",
    "conversation_id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
    "created_at": "2021-02-25T20:10:00",
    "customer_id": null,
    "private": false,
    "seen_at": null,
    "sent_at": null,
    "type": "reply",
    "user": {
      "created_at": "2020-12-03T18:47:37",
      "disabled_at": null,
      "display_name": "Alex",
      "email": "alex@example.com",
      "full_name": null,
      "id": 1,
      "object": "user",
      "profile_photo_url": null,
      "role": "admin"
    },
    "user_id": 1
  }
}
```

#### Retrieve a message

```bash title="GET /api/v1/messages/:id"
curl https://app.papercups.io/api/v1/messages/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

```json title="Response"
{
  "data": {
    "id": "2a1239b8-xxxx-xxxx-xxxx-16267296abcf",
    "object": "message",
    "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
    "attachments": [],
    "body": "Hello world!",
    "conversation_id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
    "created_at": "2021-02-24T17:00:30",
    "customer": {
      "browser": "Chrome",
      "company_id": null,
      "created_at": "2021-02-24T17:20:30",
      "current_url": "http://localhost:3000/demo",
      "email": null,
      "external_id": null,
      "host": "localhost:3000",
      "id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
      "metadata": null,
      "name": null,
      "object": "customer",
      "os": "Mac OS X",
      "pathname": "/demo",
      "phone": null,
      "profile_photo_url": null,
      "updated_at": "2021-02-24T17:24:38"
    },
    "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
    "private": false,
    "seen_at": null,
    "sent_at": "2021-02-24T17:00:30Z",
    "type": "reply",
    "user": null,
    "user_id": null
  }
}
```

#### Delete a message

```bash title="DELETE /api/v1/messages/:id"
curl https://app.papercups.io/api/v1/messages/[id] \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -X DELETE
```

```bash title="Response"
No response
```

#### List all messages

```bash title="GET /api/v1/messages"
curl https://app.papercups.io/api/v1/messages \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```

```json title="Response"
{
  "data": [
    {
      "id": "2a1239b8-xxxx-xxxx-xxxx-16267296abcf",
      "object": "message",
      "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
      "attachments": [],
      "body": "Hello world!",
      "conversation_id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
      "created_at": "2021-02-24T17:00:30",
      "customer": {...},
      "customer_id": "68eaa004-xxxx-xxxx-xxxx-8c3173c273b9",
      "private": false,
      "seen_at": null,
      "sent_at": "2021-02-24T17:00:30Z",
      "type": "reply",
      "user": null,
      "user_id": null
    },
    {
      "id": "62dfee85-xxxx-xxxx-xxxx-5d0759f6495b",
      "object": "message",
      "account_id": "2ebbad4c-xxxx-xxxx-xxxx-eaf9ebf469a5",
      "attachments": [],
      "body": "How can I help you?",
      "conversation_id": "56d2cfd6-xxxx-xxxx-xxxx-c4770868ee4c",
      "created_at": "2021-02-25T20:10:00",
      "customer_id": null,
      "private": false,
      "seen_at": null,
      "sent_at": null,
      "type": "reply",
      "user": {...},
      "user_id": 1
    }
  ]
}
```
