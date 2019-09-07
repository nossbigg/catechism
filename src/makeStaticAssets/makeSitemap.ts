import { createSitemap, ISitemapItemOptionsLoose } from 'sitemap'
import { CCCMeta } from './typedefs.js'

const SITE_HOMEPAGE = 'https://nossbigg.github.io/catechism'
const makeIndexUrl = () => `${SITE_HOMEPAGE}/#/index`
const makePageUrl = (pageUrl: string) => `${SITE_HOMEPAGE}/#/p/${pageUrl}`

export const makeSitemapXml = (cccMeta: CCCMeta): string => {
  const indexItem: ISitemapItemOptionsLoose = { url: makeIndexUrl() }
  const pageItems: ISitemapItemOptionsLoose[] = Object.keys(cccMeta.urlMap)
    .map(makePageUrl)
    .map(url => ({ url }))

  const sitemap = createSitemap({
    hostname: SITE_HOMEPAGE,
    urls: [indexItem, ...pageItems],
  })
  return sitemap.toXML()
}
