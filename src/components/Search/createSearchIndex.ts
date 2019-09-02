import { PageNodes } from './../../store/cccTypedefs'
import { createPageSnapshot, CCCPageSnapshot } from './createSearchIndexHelpers'
import { CCCEnhancedStore } from 'store/cccTypedefs'
import lunr from 'lunr'
import { createPageNodesFromRemote } from './createPageNodes'

export interface CCCSearchIndexes {
  titleIndex: lunr.Index
  contentIndex: lunr.Index
  cccSnapshot: ConciseCCCSnapshot
  searchByTitle: (term: string) => SearchEntry[]
  searchByContent: (term: string) => SearchEntry[]
  ready: boolean
}

export const createSearchIndexes = async (
  cccStore: CCCEnhancedStore
): Promise<CCCSearchIndexes> => {
  const pageNodes = await createPageNodesFromRemote(cccStore)

  const cccSnapshot = makeConciseCCCSnapshot(cccStore, pageNodes)
  const pageSnapshots = Object.values(cccSnapshot)

  /* eslint-disable fp/no-this */
  const titleIndex = lunr(function() {
    this.ref('id')
    this.field('title')

    pageSnapshots.forEach(entry => {
      const { content, ...rest } = entry
      this.add(rest)
    })
  })

  const contentIndex = lunr(function() {
    this.ref('id')
    this.field('content')

    pageSnapshots.forEach(entry => {
      const { title, ...rest } = entry
      this.add(rest)
    })
  })
  /* eslint-enable fp/no-this */

  const searchByTitle = createSearchHandler(titleIndex, cccSnapshot)
  const searchByContent = createSearchHandler(contentIndex, cccSnapshot)

  return {
    titleIndex,
    contentIndex,
    cccSnapshot,
    searchByTitle,
    searchByContent,
    ready: true,
  }
}

export type SearchEntry = CCCPageSnapshot & lunr.Index.Result

const createSearchHandler = (
  index: lunr.Index,
  cccSnapshot: ConciseCCCSnapshot
) => (term: string): SearchEntry[] => {
  return index.search(term).map(searchResult => ({
    ...searchResult,
    ...cccSnapshot[searchResult.ref],
  }))
}

interface ConciseCCCSnapshot {
  [tocId: string]: CCCPageSnapshot
}

export const makeConciseCCCSnapshot = (
  cccStore: CCCEnhancedStore,
  pageNodes: PageNodes
): ConciseCCCSnapshot => {
  const tocKeys = Object.keys(cccStore.extraMeta.pageMetaMap)
  return tocKeys.reduce(
    (acc, tocId) => ({
      ...acc,
      [tocId]: createPageSnapshot(tocId, cccStore, pageNodes),
    }),
    {}
  )
}

export const createEmptyIndexes = (): CCCSearchIndexes => {
  return {
    titleIndex: createEmptyLunrIndex(),
    contentIndex: createEmptyLunrIndex(),
    cccSnapshot: {},
    searchByTitle: () => [],
    searchByContent: () => [],
    ready: false,
  }
}

const createEmptyLunrIndex = () => lunr(function() {})
