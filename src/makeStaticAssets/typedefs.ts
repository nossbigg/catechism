import { TextElement, AnchorElement } from './../store/cccTypedefs'
import { LeanPageParagraph } from './typedefs'
import {
  CCCStore,
  PageElementAttributes,
  RefElement,
  CCCRefElement,
  SpacerElement,
  TOCLink,
  PageNode,
  PageParagraph,
} from '../store/cccTypedefs'
import { PageMetaMap } from '../cccMetaGenerator/makePageMetaMap'
import { UrlToTocIdMap } from '../cccMetaGenerator/makeUrlMap'
import { CCCRefRangeTree } from '../cccMetaGenerator/makeRefRangeTree'
import { BreadcrumbsMap } from '../cccMetaGenerator/makeBreadcrumbs'

export interface CCCEnhancedStore {
  store: CCCLeanStore
  extraMeta: CCCMeta
}

export type CCCLeanStore = Omit<CCCStore, 'page_nodes' | 'toc_link_tree'> & {
  toc_link_tree: LeanTOCLink[]
}

export type LeanTOCLink = Omit<TOCLink, 'children'> & {
  children?: LeanTOCLink[]
}

export type LeanPageNode = Omit<PageNode, 'paragraphs'> & {
  paragraphs: LeanPageParagraph[]
}

export type LeanPageParagraph = Omit<PageParagraph, 'elements' | 'attrs'> & {
  elements: LeanPageParagraphElement[]
  attrs?: PageElementAttributes
}

export type LeanPageParagraphElement =
  | LeanTextElement
  | RefElement
  | LeanAnchorElement
  | CCCRefElement
  | SpacerElement

export type LeanTextElement = Omit<TextElement, 'attrs'> & {
  attrs?: PageElementAttributes
}

export type LeanAnchorElement = Omit<AnchorElement, 'attrs'> & {
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
