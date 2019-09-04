import { LeanPageParagraph } from './typedefs'
import { PageElementAttributes, PageParagraph } from '../store/cccTypedefs'

export const filterTrailingEmptyParagraphs = (
  paragraphs: PageParagraph[]
): PageParagraph[] => {
  const indexesToFilter = getTrailingEmptyParagraphIndexes(paragraphs)
  return paragraphs.filter((_, index) => !indexesToFilter.has(index))
}

const getTrailingEmptyParagraphIndexes = (
  paragraphs: LeanPageParagraph[]
): Set<number> => {
  const emptyParagraphIndexes = paragraphs.reduceRight<
    TrailingEmptyParagraphAccumulator
  >(
    (acc, paragraph, index) => {
      if (acc.ignoreRest) {
        return acc
      }

      if (isEmptyParagraph(paragraph)) {
        return { ...acc, indexes: [...acc.indexes, index] }
      }

      return { ...acc, ignoreRest: true }
    },
    { ignoreRest: false, indexes: [] }
  )

  return new Set(emptyParagraphIndexes.indexes)
}

const isEmptyParagraph = (paragraph: LeanPageParagraph): boolean => {
  const { elements } = paragraph
  if (elements.length === 0) {
    return true
  }

  if (elements.length === 1) {
    const [firstElement] = elements
    if (firstElement.type === 'spacer') {
      return true
    }
  }

  return false
}

interface TrailingEmptyParagraphAccumulator {
  ignoreRest: boolean
  indexes: number[]
}

export const filterEmptyAttrs = (attrs: PageElementAttributes) => {
  const isEmptyAttrs = Object.keys(attrs).length === 0
  return isEmptyAttrs ? {} : { attrs }
}
