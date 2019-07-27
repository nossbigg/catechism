import React from 'react'
import {
  stripUrlShortLink,
  PageMetaMap,
} from 'cccMetaGenerator/cccMetaGenerator'
import { CCCEnhancedStore } from 'store/cccImporter'
import {
  PageParagraph,
  PageParagraphElement,
  PageNode,
} from 'store/cccTypedefs'
import { Layout } from 'components/Layout/Layout'
import { Box, IconButton } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { historyPush } from '../../utils/reactRouterUtils'
import * as H from 'history'
import { AppRouteType } from 'components/App'

export const PAGE_TOC_ID_MATCH = 'PAGE_TOC_ID'

interface PageRouteParams {
  [PAGE_TOC_ID_MATCH]: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PageProps extends AppRouteType<PageRouteParams> {}

export const Page: React.FC<PageProps> = props => {
  const { cccStore } = props
  const styles = useStyles()

  const shortUrl = getShortUrl(props)
  const tocId = getPageTocId(cccStore, shortUrl)
  if (!tocId) {
    return null
  }

  const pageNode = getPageNode(cccStore, tocId)
  const { paragraphs } = pageNode
  return (
    <Layout routeHistory={props.history}>
      {paragraphs.map(renderParagraph)}
      {renderPageControls(styles, tocId, cccStore, props.history)}
    </Layout>
  )
}

const renderParagraph = (paragraph: PageParagraph, index: number) => {
  const { elements } = paragraph
  return <p key={index}>{elements.map(renderParagraphElement)}</p>
}

const renderParagraphElement = (
  element: PageParagraphElement,
  index: number
) => {
  switch (element.type) {
    case 'spacer':
      return <br key={index} />
    case 'ref':
      return <sup key={index}>{element.number}</sup>
    case 'ref-anchor':
      return (
        <a key={index} href={element.link}>
          ⇒
        </a>
      )
    case 'ref-ccc':
      return element.ref_number + ' '
    case 'text':
      return element.text + ' '
    default:
      return ''
  }
}

const renderPageControls = (
  styles: Record<string, string>,
  tocId: string,
  cccStore: CCCEnhancedStore,
  history: H.History
) => {
  const { pageMetaMap } = cccStore.extraMeta
  const { next, prev } = pageMetaMap[tocId]

  const hasNext = hasUrl(next, pageMetaMap)
  const hasPrev = hasUrl(prev, pageMetaMap)

  return (
    <Box className={styles.pageControls}>
      {hasPrev && (
        <IconButton
          className={`${styles.pageControlButton} ${styles.pageLeftButton}`}
          onClick={() =>
            historyPush(history, `/p/${getUrl(prev, pageMetaMap)}`)
          }
        >
          <KeyboardArrowLeft fontSize='large' />
        </IconButton>
      )}
      {hasNext && (
        <IconButton
          className={`${styles.pageControlButton} ${styles.pageRightButton}`}
          onClick={() =>
            historyPush(history, `/p/${getUrl(next, pageMetaMap)}`)
          }
        >
          <KeyboardArrowRight fontSize='large' />
        </IconButton>
      )}
    </Box>
  )
}

const hasUrl = (tocId: string, pageMetaMap: PageMetaMap) => tocId in pageMetaMap
const getUrl = (tocId: string, pageMetaMap: PageMetaMap) =>
  pageMetaMap[tocId].url

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

const useStyles = makeStyles({
  pageControls: { display: 'flex' },
  pageLeftButton: {},
  pageRightButton: { marginLeft: 'auto' },
  pageControlButton: {
    border: '1px solid gray',
  },
})
