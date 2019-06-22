import { CCCStore, TOCLink, TOCNode } from './cccTypedefs'
import {
  mergeObjectsProperties,
  FriendlyUrlMap,
  generateFriendlyUrlMap,
  generatePageMetaHashmap,
  parseToShortLinkText,
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

const createMockCCC = (): CCCStore =>
  (({
    toc_link_tree: [
      createTocLink('toc-1', [createTocLink('toc-2'), createTocLink('toc-3')]),
      createTocLink('toc-10'),
      createTocLink('toc-20'),
    ],
    toc_nodes: {
      'toc-1': createTocNode('toc-1', 'link text 1'),
      'toc-2': createTocNode('toc-2', 'link text 2'),
      'toc-3': createTocNode('toc-3', 'link text 3'),
      'toc-10': createTocNode('toc-10', 'link text 10'),
    },
  } as unknown) as CCCStore)

describe('cccMetaGenerator', () => {
  describe('generateFriendlyUrlMap', () => {
    const doAction = (): FriendlyUrlMap => {
      const cccStore = createMockCCC()
      return generateFriendlyUrlMap(cccStore.toc_link_tree, cccStore.toc_nodes)
    }
    const resultMap = doAction()

    const assertEntryPresent = (
      expectedUrl: string,
      expectedPageMapping: string
    ) => {
      expect(expectedUrl in resultMap).toBe(true)
      expect(resultMap[expectedUrl]).toEqual(expectedPageMapping)
    }

    it('generates a top-level node url', () => {
      assertEntryPresent('0+link-text-1', 'toc-1')
      assertEntryPresent('1+link-text-10', 'toc-10')
    })

    it('generates a nested level node url', () => {
      assertEntryPresent('0.1+link-text-2', 'toc-2')
      assertEntryPresent('0.2+link-text-3', 'toc-3')
    })

    it('skips a node which does not have a page', () => {
      expect('2+link-text-20' in resultMap).toBe(false)
    })
  })

  describe('generatePageMetaHashmap', () => {
    const doAction = () => {
      const cccStore = createMockCCC()
      const urlMap: FriendlyUrlMap = {
        '0+link-text-1': 'toc-1',
        '0.1+link-text-2': 'toc-2',
        '0.2+link-text-3': 'toc-3',
        '1+link-text-10': 'toc-10',
      }
      return generatePageMetaHashmap(cccStore.toc_link_tree, urlMap)
    }
    const resultMap = doAction()

    it('maps url to meta node', () => {
      expect(resultMap['toc-1'].url).toEqual('0+link-text-1')
    })

    it('generates meta node with next/prev refs', () => {
      expect(resultMap['toc-2']).toEqual(
        expect.objectContaining({
          id: 'toc-2',
          prev: 'toc-1',
          next: 'toc-3',
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
