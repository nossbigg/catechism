import {
  TOCNode,
  TOCLink,
  PageNode,
  PageParagraph,
  CCCRefElement,
} from './../store/cccTypedefs'

export const createTocLink = (
  id: string,
  children: TOCLink[] = []
): TOCLink => ({
  id,
  children,
})

export const createTocNode = (
  id: string,
  text: string,
  { indent_level = 0, link = '' }: Partial<TOCNode> = {}
): TOCNode => ({ id, text, indent_level, link })

export const createPageNode = (
  id: string,
  paragraphs: PageParagraph[] = []
): PageNode => {
  return {
    id,
    paragraphs,
    footnotes: [],
  }
}

export const createParagraph = (): PageParagraph => ({
  elements: [],
  attrs: {},
})

export const createParagraphWithCCCRefElements = (
  ref_numbers: number[]
): PageParagraph => ({
  elements: ref_numbers.map(createCCCRefElement),
  attrs: {},
})

export const createCCCRefElement = (ref_number: number): CCCRefElement => ({
  type: 'ref-ccc',
  ref_number,
})
