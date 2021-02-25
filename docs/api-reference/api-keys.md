---
id: api-keys
title: Getting an API key
description: 'Public Papercups API keys'
slug: /api-keys
---

Before you can start using the Papercups API, you'll need to generate a personal API key in the dashboard.

:::danger
When using personal API keys, be sure to keep these secret! Do not check them into source code or share them with anyone outside your team.
:::

You can do this by going to the [Integrations](https://app.papercups.io/integrations) page, scrolling to the bottom, and clicking the "**Generate new API key**" button:

![generate-api-key](https://user-images.githubusercontent.com/5264279/109174317-bbfee580-7752-11eb-975b-244eca2f608a.gif)

To verify that your API key is working, you can run the following cURL command in your terminal:

```bash
curl https://app.papercups.io/api/v1/me \
  -H "Authorization: Bearer [YOUR_API_KEY]"
```
