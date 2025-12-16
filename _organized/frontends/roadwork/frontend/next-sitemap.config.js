/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://roadwork.blackroad.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/onboarding/'],
      },
    ],
  },
  transform: async (config, path) => {
    // Set priority and change frequency based on path
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path === '/pricing' || path === '/signup') {
      priority = 0.9
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
