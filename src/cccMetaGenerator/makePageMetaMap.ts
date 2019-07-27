import { TOCLink, PageNodes } from '../store/cccTypedefs'
import { TocIdToUrlMap, getAllTocLinks } from './cccMetaGenerator'

export interface PageMetaMap {
  [tocId: string]: PageMeta
}
export interface PageMeta {
  id: string
  prev: string
  next: string
  url: string
}

export const makePageMetaMap = (
  tocLinkTree: TOCLink[],
  pageNodes: PageNodes,
  tocIdMap: TocIdToUrlMap
): PageMetaMap => {
  const tocIds = getAllTocLinks(tocLinkTree)
  const tocIdsWithPages = tocIds.filter(tocId => tocId in pageNodes)

  return tocIdsWithPages
    .map(convertTocIdToPageMeta(tocIdsWithPages, tocIdMap))
    .reduce((acc, pageMeta) => ({ ...acc, [pageMeta.id]: pageMeta }), {})
}

const convertTocIdToPageMeta = (tocIds: string[], tocIdMap: TocIdToUrlMap) => (
  tocId: string,
  index: number
): PageMeta => {
  const prevPage = index - 1 >= 0 ? tocIds[index - 1] : ''
  const nextPage = index + 1 <= tocIds.length - 1 ? tocIds[index + 1] : ''
  return {
    id: tocId,
    prev: prevPage,
    next: nextPage,
    url: tocIdMap[tocId],
  }
}
