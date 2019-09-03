import {
  PageNode,
  PageParagraphElement,
  PageParagraph,
  PageElementAttributes,
  TextElement,
  AnchorElement,
} from './../store/cccTypedefs'
import { stripUrlShortLink } from './../cccMetaGenerator/makeUrlMap'
import { CCCStore } from '../store/cccTypedefs'
import {
  CCCMeta,
  LeanPageNode,
  LeanPageParagraph,
  LeanPageParagraphElement,
} from './typedefs'

export const makeCCCPages = async (
  ccc: CCCStore,
  cccMeta: CCCMeta
): Promise<CCCExportedPage[]> => {
  const { page_nodes } = ccc
  const { urlMap } = cccMeta

  const filterNullPages = (fullUrl: string) => {
    const tocId = urlMap[fullUrl]
    const page = page_nodes[tocId]
    return !!page
  }

  return Object.keys(urlMap)
    .filter(filterNullPages)
    .map(fullUrl => {
      const shortUrl = stripUrlShortLink(fullUrl)
      const tocId = urlMap[fullUrl]
      const page = page_nodes[tocId]

      const leanPage = makeLeanPage(page)
      return { fileName: shortUrl, jsonContent: JSON.stringify(leanPage) }
    })
    .filter(page => !!page.jsonContent)
}

const makeLeanPage = (page: PageNode): LeanPageNode => {
  const { paragraphs } = page
  const leanParagraphs = paragraphs.map(makeLeanParagraph)
  return { ...page, paragraphs: leanParagraphs }
}

const makeLeanParagraph = (paragraph: PageParagraph): LeanPageParagraph => {
  const { attrs, elements } = paragraph
  const leanElements = elements.map(makeLeanParagraphElement)

  return { elements: leanElements, ...filterEmptyAttrs(attrs) }
}

const makeLeanParagraphElement = (
  element: PageParagraphElement
): LeanPageParagraphElement => {
  const { type } = element

  if (type === 'text') {
    const { attrs, ...rest } = element as TextElement
    return { ...filterEmptyAttrs(attrs), ...rest }
  }

  if (type === 'ref-anchor') {
    const { attrs, ...rest } = element as AnchorElement
    return { ...filterEmptyAttrs(attrs), ...rest }
  }

  return element
}

const filterEmptyAttrs = (attrs: PageElementAttributes) => {
  const isEmptyAttrs = Object.keys(attrs).length === 0
  return isEmptyAttrs ? {} : { attrs }
}

export interface CCCExportedPage {
  fileName: string
  jsonContent: string
}
