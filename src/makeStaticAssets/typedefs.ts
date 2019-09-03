import { CCCStore } from '../store/cccTypedefs'
import { PageMetaMap } from '../cccMetaGenerator/makePageMetaMap'
import { UrlToTocIdMap } from '../cccMetaGenerator/makeUrlMap'
import { CCCRefRangeTree } from '../cccMetaGenerator/makeRefRangeTree'
import { BreadcrumbsMap } from '../cccMetaGenerator/makeBreadcrumbs'

export interface CCCEnhancedStore {
  store: CCCLeanStore
  extraMeta: CCCMeta
}

export type CCCLeanStore = Omit<CCCStore, 'page_nodes'>

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
