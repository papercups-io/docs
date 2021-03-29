module.exports = {
  docs: {
    Introduction: [
      'introduction/about',
      'introduction/faqs',
      {
        type: 'link',
        label: 'Demo',
        href: 'https://app.papercups.io/demo',
      },
    ],
    'Getting Started': [
      'getting-started/chat',
      'getting-started/reply-from-slack',
      'getting-started/reply-from-mattermost',
      'getting-started/development',
    ],
    Webhooks: ['webhooks/subscribing', 'webhooks/events'],
    'API Reference': ['api-reference/api-keys', 'api-reference/api-endpoints'],
    Deploying: [
      'deploying/aws',
      'deploying/heroku',
      'deploying/slack'
    ],
    'Additional Information': [
      'support',
      'contributing',
      {
        type: 'link',
        label: 'Pricing',
        href: 'https://papercups.io/pricing',
      },
    ],
  },
};
