import { stripUrlShortLink } from './../cccMetaGenerator/makeUrlMap'
import { CCCStore } from '../store/cccTypedefs'
import { CCCMeta } from './typedefs'

export const makeCCCPages = async (
  ccc: CCCStore,
  cccMeta: CCCMeta
): Promise<CCCExportedPage[]> => {
  const { page_nodes } = ccc
  const { urlMap } = cccMeta

  return Object.keys(urlMap)
    .map(fullUrl => {
      const shortUrl = stripUrlShortLink(fullUrl)
      const tocId = urlMap[fullUrl]
      const page = page_nodes[tocId]
      return { fileName: shortUrl, jsonContent: JSON.stringify(page) }
    })
    .filter(page => !!page.jsonContent)
}

export interface CCCExportedPage {
  fileName: string
  jsonContent: string
}
