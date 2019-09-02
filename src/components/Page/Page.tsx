import React from 'react'
import { stripUrlShortLink } from 'cccMetaGenerator/makeUrlMap'
import {
  PageParagraph as PageParagraphType,
  CCCEnhancedStore,
} from 'store/cccTypedefs'
import { Layout } from 'components/Layout/Layout'
import { makeStyles } from '@material-ui/styles'
import { PageBreadcrumbs } from '../PageBreadcrumbs/PageBreadcrumbs'
import { AppRouteType } from 'components/App'
import { useScrollToTopOnPathChange } from '../common/hooks/useScrollToTopOnRouteChange'
import { PageParagraph } from './PageParagraph'
import { PageFootnotes } from './PageFootnotes'
import { PageControls } from './PageControls'
import { usePageScrollHooks, getParagraphRefKey } from './pageScrollHooks'
import { useLoadPageContentHook } from './pageHooks'

export const PAGE_TOC_ID_MATCH = 'PAGE_TOC_ID'

interface PageRouteParams {
  [PAGE_TOC_ID_MATCH]: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PageProps extends AppRouteType<PageRouteParams> {}

export const Page: React.FC<PageProps> = props => {
  const { cccStore, location } = props
  const styles = useStyles()

  const shortUrl = getShortUrl(props)
  const tocId = getPageTocId(cccStore, shortUrl)

  useScrollToTopOnPathChange(tocId)
  const { pageNode } = useLoadPageContentHook(shortUrl)
  const elementRefs = usePageScrollHooks(pageNode, location.search)

  if (!pageNode) {
    return null
  }

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

          const wrapperRefMeta = elementRefs[getParagraphRefKey(index)]

          return (
            <PageParagraph
              paragraph={paragraph}
              key={index}
              wrapperRefMeta={wrapperRefMeta}
            />
          )
        })}
        <PageFootnotes footnotes={footnotes} wrapperRefMetas={elementRefs} />
      </div>
      <PageControls cccStore={cccStore} history={props.history} tocId={tocId} />
    </Layout>
  )
}

export const getShortUrl = (props: PageProps): string => {
  const fullUrl = props.match.params[PAGE_TOC_ID_MATCH]
  if (!fullUrl) {
    return ''
  }

  return stripUrlShortLink(fullUrl)
}

const getPageTocId = (cccStore: CCCEnhancedStore, shortUrl: string): string => {
  return cccStore.extraMeta.urlMap[shortUrl] || ''
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
})
