import { CCCStore, TOCLink, TOCNodes } from './cccTypedefs'

interface CCCMeta {
  pages: PageMetaMap
  urlMap: UrlToTocIdMap
}

interface PageMetaMap {
  [tocId: string]: PageMeta
}
export interface PageMeta {
  id: string
  prev: string
  next: string
  url: string
}

export interface TocIdToUrlMap {
  // maps tocId to url
  [tocId: string]: string
}
interface UrlToTocIdMap {
  [url: string]: string
}

export const generateCCCMeta = (ccc: CCCStore): CCCMeta => {
  const { toc_link_tree: tocLinkTree, toc_nodes: tocNodes } = ccc

  const tocIdToUrlMap = generateTocToUrlMap(tocLinkTree, tocNodes)

  const urlMap = generateUrlToTocMap(tocIdToUrlMap)
  const pages = generatePageMetaHashmap(tocLinkTree, tocIdToUrlMap)
  return { pages, urlMap }
}

export const generateTocToUrlMap = (
  tocLinkTree: TOCLink[],
  tocNodes: TOCNodes
): TocIdToUrlMap => {
  const withUrls = tocLinkTree.map(generateTocUrl(tocNodes, '', true))
  return mergeObjectsProperties(withUrls)
}

const generateTocUrl = (
  tocNodes: TOCNodes,
  prefix: string,
  isTopLevelNode: boolean
) => (tocLink: TOCLink, index: number): TocIdToUrlMap => {
  const { id, children } = tocLink
  const hasPage = id in tocNodes
  const linkText = hasPage ? tocNodes[id].text : ''

  const ownUrl = hasPage ? generateShortLink(isTopLevelNode, prefix, index) : ''
  const shortLinkText = '+' + parseToShortLinkText(linkText)
  const ownUrlMap = hasPage ? { [id]: ownUrl + shortLinkText } : {}

  const childrenProperties = children.map(
    generateTocUrl(tocNodes, ownUrl, false)
  )

  return {
    ...ownUrlMap,
    ...mergeObjectsProperties(childrenProperties),
  }
}

export const generateShortLink = (
  isTopLevelNode: boolean,
  prefix: string,
  index: number
): string => {
  const shorthand = !isTopLevelNode ? `${prefix}.${index + 1}` : `${index}`
  return shorthand
}

const nonDigitWordPattern = /[^\d\w ]/g
const linkPrefixPattern = /(section|chapter|article|paragraph|part) (\w|\d)+/i
const romanNumeralPattern = /[MDCLXVI]+\. /

const SHORT_LINK_WORDS_LIMIT = 5
export const parseToShortLinkText = (linkText: string): string => {
  const normalizedText = linkText
    .replace(linkPrefixPattern, '')
    .replace(romanNumeralPattern, '')
    .replace(nonDigitWordPattern, '')
    .replace(/[ ]{2,}/, ' ')
    .trim()
    .toLowerCase()
  return normalizedText
    .split(' ')
    .filter((_, i) => i < SHORT_LINK_WORDS_LIMIT)
    .join('-')
}

const SHORT_LINK_PATTERN = /\+.*$/
export const stripUrlShortLink = (url: string) =>
  url.replace(SHORT_LINK_PATTERN, '')
const generateUrlToTocMap = (tocIdToUrlMap: TocIdToUrlMap) => {
  return Object.entries(tocIdToUrlMap).reduce((acc, [tocId, url]) => {
    const urlWithoutShortLink = stripUrlShortLink(url)
    return { ...acc, [urlWithoutShortLink]: tocId }
  }, {})
}

export const generatePageMetaHashmap = (
  tocLinkTree: TOCLink[],
  tocIdMap: TocIdToUrlMap
): PageMetaMap => {
  const tocIds = getAllTocLinks(tocLinkTree)

  return tocIds
    .filter(tocId => tocId in tocIdMap)
    .map(convertTocIdToPageMeta(tocIds, tocIdMap))
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

const getAllTocLinks = (tocLinkTree: TOCLink[]) => {
  return tocLinkTree.reduce<string[]>(
    (acc, tocLink) => [...acc, ...flattenTocLinks(tocLink)],
    []
  )
}

const flattenTocLinks = (tocLink: TOCLink): string[] => {
  const { id, children } = tocLink
  const childrenLinks = children
    .map(flattenTocLinks)
    .reduce((acc, curr) => [...acc, ...curr], [])
  return [id, ...childrenLinks]
}

export function mergeObjectsProperties<T>(objectList: T[]) {
  return objectList.reduce((acc, curr) => ({ ...acc, ...curr }), {})
}
