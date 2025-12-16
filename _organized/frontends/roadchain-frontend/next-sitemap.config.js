/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://roadchain.io',
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
