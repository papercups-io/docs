module.exports = {
  title: 'Papercups',
  tagline: 'Open source customer messaging',
  url: 'https://papercups.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'papercups-io', // Usually your GitHub org/user name.
  projectName: 'papercups', // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Papercups Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/papercups-io/papercups',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'About',
              to: 'docs/',
            },
            {
              label: 'FAQs',
              to: 'docs/faqs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Slack',
              href:
                'https://join.slack.com/t/papercups-io/shared_invite/zt-h0c3fxmd-hZi1Zp8~D61S6GD16aMqmg',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/papercups-io/papercups',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/Dq2A3eh',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/papercups_io',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://papercups.io/blog',
            },
            {
              label: 'Demo',
              href: 'https://app.papercups.io/demo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Papercups, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/papercups-io/papercups/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/papercups-io/papercups/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
