import { CCCEnhancedStore } from 'store/cccTypedefs'
import {
  PageNode,
  PageParagraph,
  PageParagraphElementType,
  PageParagraphElement,
  TextElement,
  RefElement,
  CCCRefElement,
  PageFootnotes,
} from '../../store/cccTypedefs'

export interface CCCPageSnapshot {
  id: string
  title: string
  content: string
}

export const createPageSnapshot = (
  cccStore: CCCEnhancedStore,
  tocId: string
): CCCPageSnapshot => {
  const { store } = cccStore
  const { page_nodes, toc_nodes } = store

  const { text: pageTitle } = toc_nodes[tocId]
  const pageContent = extractTextFromPage(page_nodes[tocId])

  return { title: pageTitle, content: pageContent, id: tocId }
}

export const extractTextFromPage = (page: PageNode) => {
  const { paragraphs, footnotes } = page

  const paragraphText = extractTextFromPageParagraphs(paragraphs)
  const footnotesText = extractTextFromPageFootnotes(footnotes)
  return `${paragraphText}${footnotesText}`
}

export const extractTextFromPageParagraphs = (
  pageParagraphs: PageParagraph[]
) => {
  const texts = pageParagraphs
    .map(paragraph => {
      return paragraph.elements
        .map(element => {
          const mapper = PARAGRAPH_ELEMENT_TEXT_MAPPER[element.type]
          return mapper(element)
        })
        .join('')
    })
    .join('\n\n')

  return texts
}

export const extractTextFromPageFootnotes = (pageFootnotes: PageFootnotes) => {
  const texts = Object.values(pageFootnotes).map(footnote => {
    const { number, refs } = footnote

    const footnoteText = refs
      .reduce<string[]>((acc, curr) => [...acc, curr.text], [])
      .join(', ')

    return `${number}: ${footnoteText}`
  })

  return texts.join('\n')
}

const PARAGRAPH_ELEMENT_TEXT_MAPPER: Record<
  PageParagraphElementType,
  (element: PageParagraphElement) => string
> = {
  text: e => {
    const elm = e as TextElement
    return `${elm.text}`
  },
  ref: e => {
    const elm = e as RefElement
    return `${elm.number}`
  },
  'ref-anchor': () => '',
  'ref-ccc': e => {
    const elm = e as CCCRefElement
    return `${elm.ref_number} `
  },
  spacer: () => '\n',
}
