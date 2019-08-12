import { createRef, useState, useEffect } from 'react'
import { PageNode } from 'store/cccTypedefs'
import queryString from 'query-string'

export interface RefsMap {
  [index: string]: WrapperRefMeta
}

export interface WrapperRefMeta {
  ref: React.RefObject<HTMLDivElement>
  highlighted: boolean
}

export const useElementRefsState = (
  page: PageNode | undefined,
  locationSearch: string
): RefsMap => {
  const pageFilled = page || { id: '', paragraphs: [], footnotes: {} }
  const { paragraphs, footnotes } = pageFilled

  const paragraphKeys = paragraphs.map((_, index) => getParagraphRefKey(index))
  const footnoteKeys = Object.keys(footnotes).map(getFootnoteRefKey)

  const [currentFocusedElement, setCurrentFocusedElement] = useState(
    getCurrentFocusedElement(locationSearch)
  )
  const [elementRefs, setElementRefs] = useState(
    createItemRefs([...paragraphKeys, ...footnoteKeys], currentFocusedElement)
  )

  useEffect(() => {
    if (currentFocusedElement === '') {
      return
    }

    const focusedElement = elementRefs[currentFocusedElement]
    if (!focusedElement) {
      setCurrentFocusedElement('')
      return
    }

    scrollToElement(focusedElement)
    setElementRefs(resetElementRefs(elementRefs, currentFocusedElement))
    setCurrentFocusedElement('')
  }, [currentFocusedElement, elementRefs])

  return elementRefs
}

const createItemRefs = (keys: string[], focusedElementKey: string): RefsMap =>
  keys.reduce(
    (acc, currentKey) => ({
      ...acc,
      [currentKey]: {
        ref: createRef(),
        highlighted: currentKey === focusedElementKey,
      },
    }),
    {}
  )

const resetElementRefs = (
  elementRefs: RefsMap,
  keyToReset: string
): RefsMap => {
  const updatedElementRef: WrapperRefMeta = {
    ...elementRefs[keyToReset],
    highlighted: false,
  }
  return { ...elementRefs, [keyToReset]: updatedElementRef }
}

export const getParagraphRefKey = (index: number) => `paragraph-${index + 1}`

export const getFootnoteRefKey = (footnoteNumber: string) =>
  `footnote-${footnoteNumber}`

const getCurrentFocusedElement = (locationSearch: string): string => {
  const params = queryString.parse(locationSearch)

  const focusedElement = (params['focus'] as string) || ''
  return focusedElement
}

const scrollToElement = (elementMeta: WrapperRefMeta) => {
  const current = elementMeta.ref.current as HTMLDivElement
  window.scrollTo(0, current.offsetTop - SCROLL_TO_ELEMENT_OFFSET)
}

const SCROLL_TO_ELEMENT_OFFSET = 100
