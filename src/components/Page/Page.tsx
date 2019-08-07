import React from 'react'
import { stripUrlShortLink } from 'cccMetaGenerator/makeUrlMap'
import { CCCEnhancedStore } from 'store/cccImporter'
import { PageNode, PageParagraph as PageParagraphType } from 'store/cccTypedefs'
import { Layout } from 'components/Layout/Layout'
import { makeStyles } from '@material-ui/styles'
import { PageBreadcrumbs } from '../PageBreadcrumbs/PageBreadcrumbs'
import { AppRouteType } from 'components/App'
import { useScrollToTopOnPathChange } from '../common/hooks/useScrollToTopOnRouteChange'
import { PageParagraph } from './PageParagraph'
import { PageFootnotes } from './PageFootnotes'
import { renderPageControls } from './renderPageControls'

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

  useScrollToTopOnPathChange(tocId)
  if (!tocId) {
    return null
  }

  const pageNode = getPageNode(cccStore, tocId)
  const { paragraphs, footnotes } = pageNode
  const emptyTrailingParagraphIndexes = getTrailingEmptyParagraphIndexes(
    paragraphs
  )

  return (
    <Layout routeHistory={props.history}>
      <PageBreadcrumbs store={cccStore} currentPageId={tocId} />
      <div className={styles.pageContainer}>
        {paragraphs.map((paragraph, index) => {
          const isEmptyParagraph = emptyTrailingParagraphIndexes.has(index)
          if (isEmptyParagraph) {
            return null
          }

          return <PageParagraph paragraph={paragraph} key={index} />
        })}
        <PageFootnotes footnotes={footnotes} />
      </div>
      {renderPageControls(styles, tocId, cccStore, props.history)}
    </Layout>
  )
}

const getShortUrl = (props: PageProps): string => {
  const fullUrl = props.match.params[PAGE_TOC_ID_MATCH]
  if (!fullUrl) {
    return ''
  }

  return stripUrlShortLink(fullUrl)
}

const getPageTocId = (cccStore: CCCEnhancedStore, shortUrl: string): string => {
  return cccStore.extraMeta.urlMap[shortUrl] || ''
}
const getPageNode = (cccStore: CCCEnhancedStore, tocId: string): PageNode => {
  return cccStore.store.page_nodes[tocId]
}

const isEmptyParagraph = (paragraph: PageParagraphType): boolean => {
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

const getTrailingEmptyParagraphIndexes = (
  paragraphs: PageParagraphType[]
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

const useStyles = makeStyles({
  pageContainer: {
    padding: '0 10px',
  },
  pageControls: { display: 'flex' },
  pageLeftButton: {},
  pageRightButton: { marginLeft: 'auto' },
  pageControlButton: {
    border: '1px solid gray',
  },
})
