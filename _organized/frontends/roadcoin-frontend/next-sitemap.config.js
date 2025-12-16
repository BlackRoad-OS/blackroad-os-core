/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://roadcoin.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
