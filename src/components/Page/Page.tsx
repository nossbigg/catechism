import React from 'react'
import { stripUrlShortLink } from 'cccMetaGenerator/makeUrlMap'
import { CCCEnhancedStore, LeanPageNode } from 'makeStaticAssets/typedefs'
import { Layout, makeDocumentTitle } from 'components/Layout/Layout'
import { makeStyles } from '@material-ui/styles'
import { PageBreadcrumbs } from '../PageBreadcrumbs/PageBreadcrumbs'
import { AppRouteType } from 'components/App'
import { useScrollToTopOnPathChange } from '../common/hooks/useScrollToTopOnRouteChange'
import { PageParagraph } from './PageParagraph'
import { PageFootnotes } from './PageFootnotes'
import { PageControls } from './PageControls'
import { usePageScrollHooks, getParagraphRefKey } from './pageScrollHooks'
import { useLoadPageContentHook } from './pageHooks'
import { DocumentTitle } from 'components/common/DocumentTitle'

export const PAGE_TOC_ID_MATCH = 'PAGE_TOC_ID'

interface PageRouteParams {
  [PAGE_TOC_ID_MATCH]: string
}

interface EnhancedPageProps extends PageProps {
  pageNode: LeanPageNode
}

export const EnhancedPage: React.FC<EnhancedPageProps> = props => {
  const { cccStore, location, pageNode } = props
  const styles = useStyles()

  const shortUrl = getShortUrl(props)
  const tocId = getPageTocId(cccStore, shortUrl)

  useScrollToTopOnPathChange(tocId)

  const elementRefs = usePageScrollHooks(pageNode, location.search)

  const { paragraphs, footnotes } = pageNode

  return (
    <>
      {setDocumentTitle(cccStore, tocId)}
      <PageBreadcrumbs store={cccStore} currentPageId={tocId} />
      <div className={styles.pageContainer}>
        {paragraphs.map((paragraph, index) => {
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
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PageProps extends AppRouteType<PageRouteParams> {}

export const Page: React.FC<PageProps> = props => {
  const shortUrl = getShortUrl(props)
  const { pageNode, isLoading } = useLoadPageContentHook(shortUrl)

  return (
    <Layout
      routeHistory={props.history}
      documentTitle={makeDocumentTitle('...')}
    >
      {isLoading ? null : (
        <EnhancedPage {...props} pageNode={pageNode as LeanPageNode} />
      )}
    </Layout>
  )
}

const setDocumentTitle = (ccc: CCCEnhancedStore, tocId: string) => {
  const { text } = ccc.store.toc_nodes[tocId]
  return <DocumentTitle title={text} />
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

const useStyles = makeStyles({
  pageContainer: {
    padding: '0 10px',
  },
})
