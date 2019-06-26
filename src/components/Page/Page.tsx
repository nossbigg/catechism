import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { stripUrlShortLink } from 'store/cccMetaGenerator'
import { getCCCStore } from 'store/cccImporter'
import {
  PageParagraph,
  PageParagraphElement,
  CCCRefElement,
} from 'store/cccTypedefs'

export const PAGE_TOC_ID_MATCH = 'PAGE_TOC_ID'

export const Page: React.FC<RouteComponentProps> = props => {
  const cccStore = getCCCStore()

  const params: Record<string, string> = props.match.params
  const fullUrl = params[PAGE_TOC_ID_MATCH]
  const shortUrl = stripUrlShortLink(fullUrl)

  const { extraMeta, store } = cccStore
  const { urlMap } = extraMeta
  const tocId = urlMap[shortUrl]

  const { page_nodes } = store
  const pageNode = page_nodes[tocId]
  const { paragraphs } = pageNode

  return <div>{paragraphs.map(renderParagraph)}</div>
}

const renderParagraph = (paragraph: PageParagraph, index: number) => {
  const { elements } = paragraph
  return <p key={index}>{elements.map(renderParagraphElement)}</p>
}

const renderParagraphElement = (element: PageParagraphElement) => {
  switch (element.type) {
    case 'spacer':
      return <br />
    case 'ref':
      return element.text + ''
    case 'ref-anchor':
      return element.text + ''
    case 'ref-ccc': {
      const e = element as CCCRefElement
      return `${e.ref_number} `
    }
    case 'text':
      return element.text + ''
    default:
      return ''
  }
}
