import { makeCCCRefRangeTree, CCCRefRangeTree } from './makeRefRangeTree'
import { makePageMetaMap, PageMetaMap } from './makePageMetaMap'
import { makeUrlToTocMap, UrlToTocIdMap } from './makeUrlMap'
import { makeBreadcrumbsMap, BreadcrumbsMap } from './makeBreadcrumbs'
import { CCCStore, TOCLink, TOCNodes } from '../store/cccTypedefs'

export interface CCCMeta {
  pageMetaMap: PageMetaMap
  urlMap: UrlToTocIdMap
  cccRefRangeTree: CCCRefRangeTree
  breadcrumbsMap: BreadcrumbsMap
}

export interface TocIdToUrlMap {
  // maps tocId to url
  [tocId: string]: string
}

export const makeCCCMeta = (ccc: CCCStore): CCCMeta => {
  const {
    toc_link_tree: tocLinkTree,
    toc_nodes: tocNodes,
    page_nodes: pageNodes,
  } = ccc

  const tocIdToUrlMap = makeTocToUrlMap(tocLinkTree, tocNodes)

  const urlMap = makeUrlToTocMap(tocIdToUrlMap)
  const pageMetaMap = makePageMetaMap(tocLinkTree, pageNodes, tocIdToUrlMap)
  const cccRefRangeTree = makeCCCRefRangeTree(tocLinkTree, pageNodes)
  const breadcrumbsMap = makeBreadcrumbsMap(tocLinkTree, '')

  return { pageMetaMap, urlMap, cccRefRangeTree, breadcrumbsMap }
}

export const makeTocToUrlMap = (
  tocLinkTree: TOCLink[],
  tocNodes: TOCNodes
): TocIdToUrlMap => {
  const withUrls = tocLinkTree.map(makeTocUrl(tocNodes, '', true))
  return mergeObjectsProperties(withUrls)
}

const makeTocUrl = (
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

  const childrenProperties = children.map(makeTocUrl(tocNodes, ownUrl, false))

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

export const getAllTocLinks = (tocLinkTree: TOCLink[]) => {
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
