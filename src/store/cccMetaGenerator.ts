import {
  CCCStore,
  TOCLink,
  TOCNodes,
  PageNodes,
  PageNode,
  CCCRefElement,
} from './cccTypedefs'

export interface CCCMeta {
  pageMetaMap: PageMetaMap
  urlMap: UrlToTocIdMap
  cccRefRangeTree: CCCRefRangeTree
}

export interface PageMetaMap {
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

export const makeCCCMeta = (ccc: CCCStore): CCCMeta => {
  const {
    toc_link_tree: tocLinkTree,
    toc_nodes: tocNodes,
    page_nodes: pageNodes,
  } = ccc

  const tocIdToUrlMap = makeTocToUrlMap(tocLinkTree, tocNodes)

  const urlMap = makeUrlToTocMap(tocIdToUrlMap)
  const pageMetaMap = makePageMetaHashmap(tocLinkTree, tocIdToUrlMap)
  const cccRefRangeTree = makeCCCRefRangeTree(tocLinkTree, pageNodes)
  return { pageMetaMap, urlMap, cccRefRangeTree }
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

const SHORT_LINK_PATTERN = /\+.*$/
export const stripUrlShortLink = (url: string) =>
  url.replace(SHORT_LINK_PATTERN, '')
const makeUrlToTocMap = (tocIdToUrlMap: TocIdToUrlMap) => {
  return Object.entries(tocIdToUrlMap).reduce((acc, [tocId, url]) => {
    const urlWithoutShortLink = stripUrlShortLink(url)
    return { ...acc, [urlWithoutShortLink]: tocId }
  }, {})
}

export const makePageMetaHashmap = (
  tocLinkTree: TOCLink[],
  tocIdMap: TocIdToUrlMap
): PageMetaMap => {
  const tocIds = getAllTocLinks(tocLinkTree)
  const tocIdsWithPages = tocIds.filter(tocId => tocId in tocIdMap)

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

interface CCCRefRangeTree {
  root: RangeTreeNode
}
interface RangeTreeNode {
  left: RangeTreeNode | undefined
  right: RangeTreeNode | undefined
  min: number
  max: number
  tocId: string | undefined
}

const getRefRangeForPage = (pageNode: PageNode): RangeTreeNode | undefined => {
  const { id, paragraphs } = pageNode

  const paragraphElements = paragraphs.map(p => p.elements).flat()
  const cccRefNumbers = paragraphElements
    .filter(e => e.type === 'ref-ccc')
    .map(e => {
      return (e as CCCRefElement).ref_number
    })
    .filter(n => n)

  if (cccRefNumbers.length === 0) {
    return undefined
  }

  return {
    left: undefined,
    right: undefined,
    min: Math.min.apply(null, cccRefNumbers),
    max: Math.max.apply(null, cccRefNumbers),
    tocId: id,
  }
}

const makeCCCRefRangeTree = (
  tocLinkTree: TOCLink[],
  pageNodes: PageNodes
): CCCRefRangeTree => {
  const tocIds = getAllTocLinks(tocLinkTree)
  const tocIdsWithPages = tocIds.filter(tocId => tocId in pageNodes)

  const rangeNodes: RangeTreeNode[] = tocIdsWithPages
    .map(tocId => pageNodes[tocId])
    .map(getRefRangeForPage)
    .filter(n => !!n) as RangeTreeNode[]

  /* eslint-disable  */
  let remainingNodes: RangeTreeNode[] = [...rangeNodes]
  let tempNodes: RangeTreeNode[] = []

  while (remainingNodes.length > 1) {
    const evenIndexes = remainingNodes.map((_, i) => i).filter(i => i % 2 === 0)
    evenIndexes.forEach(i => {
      const currentNode = remainingNodes[i]

      const hasNextElement = !!remainingNodes[i + 1]
      if (!hasNextElement) {
        tempNodes.push(currentNode)
        return
      }

      const nextNode = remainingNodes[i + 1]

      const newParentNode: RangeTreeNode = {
        left: currentNode,
        right: nextNode,
        min: currentNode.min,
        max: nextNode.max,
        tocId: undefined,
      }
      tempNodes.push(newParentNode)
    })

    remainingNodes = [...tempNodes]
    tempNodes = []
  }

  /* eslint-enable  */
  const rootNode = remainingNodes[0]
  return { root: rootNode }
}

export const findPage = (
  cccRefNumber: number,
  rootRangeNode: RangeTreeNode
): string | undefined => {
  /* eslint-disable  */
  let currentNode: RangeTreeNode = rootRangeNode

  while (true) {
    const { left, right } = currentNode
    const isInLeft = !!left ? cccRefNumber <= left.max : false
    const isInRight = !!right ? cccRefNumber >= right.min : false

    if (isInLeft) {
      currentNode = left as RangeTreeNode
    } else if (isInRight) {
      currentNode = right as RangeTreeNode
    } else {
      return undefined
    }

    if (!!currentNode.tocId) {
      break
    }
  }

  /* eslint-enable  */

  return currentNode.tocId
}
