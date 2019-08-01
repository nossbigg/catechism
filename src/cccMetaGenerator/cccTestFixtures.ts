import { CCCStore } from '../store/cccTypedefs'
import { createTocLink, createTocNode, createPageNode } from './testHelpers'

export const createMockCCC = (): CCCStore =>
  (({
    toc_link_tree: [
      createTocLink('toc-1', [
        createTocLink('toc-2'),
        createTocLink('toc-3'),
        createTocLink('toc-no-page-1'),
      ]),
      createTocLink('toc-10'),
      createTocLink('toc-no-page-2'),
    ],
    toc_nodes: {
      'toc-1': createTocNode('toc-1', 'link text 1'),
      'toc-2': createTocNode('toc-2', 'link text 2'),
      'toc-3': createTocNode('toc-3', 'link text 3'),
      'toc-no-page-1': createTocNode('toc-no-page-1', 'link text x'),
      'toc-10': createTocNode('toc-10', 'link text 10'),
      'toc-no-page-2': createTocNode('toc-no-page-2', 'link text x'),
    },
    page_nodes: {
      'toc-1': createPageNode('toc-1'),
      'toc-2': createPageNode('toc-2'),
      'toc-3': createPageNode('toc-3'),
      'toc-10': createPageNode('toc-10'),
    },
  } as unknown) as CCCStore)
