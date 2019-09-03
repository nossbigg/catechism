import {
  CCCStore,
  PageFootnotes,
  PageElementAttributes,
  RefElement,
  CCCRefElement,
  SpacerElement,
  PageParagraphBaseElement,
} from '../store/cccTypedefs'
import { PageMetaMap } from '../cccMetaGenerator/makePageMetaMap'
import { UrlToTocIdMap } from '../cccMetaGenerator/makeUrlMap'
import { CCCRefRangeTree } from '../cccMetaGenerator/makeRefRangeTree'
import { BreadcrumbsMap } from '../cccMetaGenerator/makeBreadcrumbs'

export interface CCCEnhancedStore {
  store: CCCLeanStore
  extraMeta: CCCMeta
}

export type CCCLeanStore = Omit<CCCStore, 'page_nodes'>

export interface LeanPageNode {
  id: string
  footnotes: PageFootnotes
  paragraphs: LeanPageParagraph[]
}

export interface LeanPageParagraph {
  elements: LeanPageParagraphElement[]
  attrs?: PageElementAttributes
}

export type LeanPageParagraphElement =
  | LeanTextElement
  | RefElement
  | LeanAnchorElement
  | CCCRefElement
  | SpacerElement

export interface LeanTextElement extends PageParagraphBaseElement {
  type: 'text'
  text: string
  attrs?: PageElementAttributes
}

export interface LeanAnchorElement extends PageParagraphBaseElement {
  type: 'ref-anchor'
  link: string
  attrs?: PageElementAttributes
}

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
