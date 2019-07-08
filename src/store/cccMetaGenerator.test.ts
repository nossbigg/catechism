import { CCCStore, TOCLink, TOCNode, PageNode } from './cccTypedefs'
import {
  mergeObjectsProperties,
  TocIdToUrlMap,
  parseToShortLinkText,
  makeCCCMeta,
  makeTocToUrlMap,
} from './cccMetaGenerator'

const createTocLink = (id: string, children: TOCLink[] = []): TOCLink => ({
  id,
  children,
})
const createTocNode = (
  id: string,
  text: string,
  { indent_level = 0, link = '' }: Partial<TOCNode> = {}
): TOCNode => ({ id, text, indent_level, link })
const createPageNode = (id: string): PageNode => ({
  id,
  paragraphs: [],
  footnotes: [],
})

const createMockCCC = (): CCCStore =>
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

describe('cccMetaGenerator', () => {
  describe('generating page meta map', () => {
    const doAction = () => {
      const cccStore = createMockCCC()
      const metadata = makeCCCMeta(cccStore)
      return metadata.pageMetaMap
    }
    const resultMap = doAction()

    it('maps url to meta node', () => {
      expect(resultMap['toc-1'].url).toEqual('0+link-text-1')
    })

    it('generates meta node with next/prev refs', () => {
      expect(resultMap['toc-3']).toEqual(
        expect.objectContaining({
          id: 'toc-3',
          prev: 'toc-2',
          next: 'toc-10',
        })
      )
    })

    it('generates first meta node with no prev ref', () => {
      expect(resultMap['toc-1']).toEqual(
        expect.objectContaining({
          id: 'toc-1',
          prev: '',
          next: 'toc-2',
        })
      )
    })

    it('generates last meta node with no next ref', () => {
      expect.objectContaining({
        id: 'toc-10',
        prev: 'toc-3',
        next: '',
      })
    })

    it('skips a node which does not have a page', () => {
      expect('toc-doesnt-exist-1' in resultMap).toBe(false)
      expect('toc-doesnt-exist-2' in resultMap).toBe(false)
    })
  })

  describe('generating url map', () => {
    const doAction = () => {
      const cccStore = createMockCCC()
      const metadata = makeCCCMeta(cccStore)
      return metadata.urlMap
    }
    const resultMap = doAction()

    it('generates a correct url map with truncated urls', () => {
      expect('0.1' in resultMap).toBe(true)
      expect(resultMap['0.1']).toEqual('toc-2')
    })
  })

  describe('generateTocToUrlMap', () => {
    const doAction = (): TocIdToUrlMap => {
      const cccStore = createMockCCC()
      return makeTocToUrlMap(cccStore.toc_link_tree, cccStore.toc_nodes)
    }
    const resultMap = doAction()

    const assertEntryPresent = (
      expectedPageMapping: string,
      expectedUrl: string
    ) => {
      expect(expectedPageMapping in resultMap).toBe(true)
      expect(resultMap[expectedPageMapping]).toEqual(expectedUrl)
    }

    it('generates a top-level node url', () => {
      assertEntryPresent('toc-1', '0+link-text-1')
      assertEntryPresent('toc-10', '1+link-text-10')
    })

    it('generates a nested level node url', () => {
      assertEntryPresent('toc-2', '0.1+link-text-2')
      assertEntryPresent('toc-3', '0.2+link-text-3')
    })

    it('skips a node which does not have a page', () => {
      expect('toc-doesnt-exist-1' in resultMap).toBe(false)
      expect('toc-doesnt-exist-2' in resultMap).toBe(false)
    })
  })

  describe('parseToShortLinkText', () => {
    it('parses the following titles correctly', () => {
      expect(parseToShortLinkText('SECTION TWO I. THE CREEDS')).toEqual(
        'the-creeds'
      )
      expect(
        parseToShortLinkText("CHAPTER ONE MAN'S CAPACITY FOR GOD")
      ).toEqual('mans-capacity-for-god')
      expect(
        parseToShortLinkText('Article 5 THE MORALITY OF THE PASSIONS')
      ).toEqual('the-morality-of-the-passions')
      expect(parseToShortLinkText('Paragraph 2. THE FATHER')).toEqual(
        'the-father'
      )
      expect(parseToShortLinkText('PART ONE: THE PROFESSION OF FAITH')).toEqual(
        'the-profession-of-faith'
      )
    })

    it('parses only up to the correct number of words in a link title', () => {
      expect(
        parseToShortLinkText(
          'Paragraph 2. "CONCEIVED BY THE POWER OF THE HOLY SPIRIT AND BORN OF THE VIRGIN MARY"'
        )
      ).toEqual('conceived-by-the-power-of')
    })
  })

  describe('mergeObjectsProperties', () => {
    it('merges object properties', () => {
      expect(mergeObjectsProperties([{ a: 1 }, { b: 1 }])).toEqual({
        a: 1,
        b: 1,
      })
    })
  })
})
