import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { stripUrlShortLink } from 'store/cccMetaGenerator'
import { getCCCStore, CCCEnhancedStore } from 'store/cccImporter'
import {
  PageParagraph,
  PageParagraphElement,
  CCCRefElement,
  PageNode,
} from 'store/cccTypedefs'

export const PAGE_TOC_ID_MATCH = 'PAGE_TOC_ID'

interface PageRouteParams {
  [PAGE_TOC_ID_MATCH]: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PageProps extends RouteComponentProps<PageRouteParams> {}

export const Page: React.FC<PageProps> = props => {
  const cccStore = getCCCStore()

  const shortUrl = getShortUrl(props)
  const tocId = getPageTocId(cccStore, shortUrl)
  if (!tocId) {
    return null
  }

  const pageNode = getPageNode(cccStore, tocId)
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

const getShortUrl = (props: PageProps): string => {
  const fullUrl = props.match.params[PAGE_TOC_ID_MATCH]
  if (!fullUrl) {
    return ''
  }

  return stripUrlShortLink(fullUrl)
}

const getPageTocId = (
  cccStore: CCCEnhancedStore,
  shortUrl: string
): string | undefined => {
  return cccStore.extraMeta.urlMap[shortUrl]
}
const getPageNode = (cccStore: CCCEnhancedStore, tocId: string): PageNode => {
  return cccStore.store.page_nodes[tocId]
}
