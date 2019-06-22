import { CCCStore, TOCLink, TOCNodes } from './cccTypedefs'

interface CCCMeta {
  pages: PageMetaHashmap
  urlMap: FriendlyUrlMap
}

interface PageMetaHashmap {
  [tocId: string]: PageMeta
}
export interface PageMeta {
  id: string
  prev: string
  next: string
  url: string
}

export interface FriendlyUrlMap {
  // maps friendly url to toc-id
  [friendlyUrl: string]: string
}

export const generateCCCMeta = (ccc: CCCStore): CCCMeta => {
  const { toc_link_tree: tocLinkTree, toc_nodes: tocNodes } = ccc

  const urlMap = generateFriendlyUrlMap(tocLinkTree, tocNodes)
  const pages = generatePageMetaHashmap(tocLinkTree, urlMap)
  return { pages, urlMap }
}

export const generateFriendlyUrlMap = (
  tocLinkTree: TOCLink[],
  tocNodes: TOCNodes
): FriendlyUrlMap => {
  const withFriendlyUrls = tocLinkTree.map(
    generateFriendlyUrl(tocNodes, '', true)
  )
  return mergeObjectsProperties(withFriendlyUrls)
}

const generateFriendlyUrl = (
  tocNodes: TOCNodes,
  prefix: string,
  isTopLevelNode: boolean
) => (tocLink: TOCLink, index: number): FriendlyUrlMap => {
  const { id, children } = tocLink
  const hasPage = id in tocNodes
  const linkText = hasPage ? tocNodes[id].text : ''

  const ownUrl = hasPage ? generateShortLink(isTopLevelNode, prefix, index) : ''
  const shortLinkText = '+' + parseToShortLinkText(linkText)
  const ownUrlMap = hasPage ? { [ownUrl + shortLinkText]: id } : {}

  const childrenProperties = children.map(
    generateFriendlyUrl(tocNodes, ownUrl, false)
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

interface FlippedUrlMap {
  [tocId: string]: string
}

export const generatePageMetaHashmap = (
  tocLinkTree: TOCLink[],
  urlMap: FriendlyUrlMap
): PageMetaHashmap => {
  const tocIds = getAllTocLinks(tocLinkTree)
  const flippedUrlMap: FlippedUrlMap = Object.entries(urlMap).reduce(
    (acc, [url, tocId]) => ({ ...acc, [tocId]: url }),
    {}
  )

  return tocIds
    .map(convertTocIdToPageMeta(tocIds, flippedUrlMap))
    .reduce((acc, pageMeta) => ({ ...acc, [pageMeta.id]: pageMeta }), {})
}

const convertTocIdToPageMeta = (
  tocIds: string[],
  flippedUrlMap: FlippedUrlMap
) => (tocId: string, index: number): PageMeta => {
  const prevPage = index - 1 >= 0 ? tocIds[index - 1] : ''
  const nextPage = index + 1 <= tocIds.length - 1 ? tocIds[index + 1] : ''
  return {
    id: tocId,
    prev: prevPage,
    next: nextPage,
    url: flippedUrlMap[tocId],
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
