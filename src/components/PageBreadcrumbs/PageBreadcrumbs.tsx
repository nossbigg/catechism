import React from 'react'
import { CCCEnhancedStore } from 'store/cccTypedefs'
import { Breadcrumbs, makeStyles, IconButton } from '@material-ui/core'
import { BreadcrumbsMap } from 'cccMetaGenerator/makeBreadcrumbs'
import { TOCNode, TOCNodes } from 'store/cccTypedefs'
import { Book } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { PageMetaMap } from 'cccMetaGenerator/makePageMetaMap'
import { APP_ROUTES } from 'components/App'

const useStyles = makeStyles({
  container: {
    padding: '20px 10px',
    paddingBottom: 10,
  },
  breadcrumbs: {
    fontFamily: 'inherit',
  },
})

interface PageBreadcrumbsProps {
  store: CCCEnhancedStore
  currentPageId: string
}

export const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = props => {
  const { store, currentPageId } = props
  const {
    extraMeta: { breadcrumbsMap, pageMetaMap },
    store: { toc_nodes: tocNodes },
  } = store
  const styles = useStyles()

  const breadcrumbTrail = findPageBreadcrumbTrail(
    currentPageId,
    breadcrumbsMap
  ).map(getTocNode(tocNodes))
  const lastIndex = breadcrumbTrail.length - 1

  return (
    <div className={styles.container}>
      <Breadcrumbs className={styles.breadcrumbs}>
        {createHomeBreadcrumb()}
        {breadcrumbTrail.map(createBreadcrumbLink(pageMetaMap, lastIndex))}
      </Breadcrumbs>
    </div>
  )
}

const findPageBreadcrumbTrail = (
  currentTocId: string,
  breadcrumbsMap: BreadcrumbsMap
): string[] => {
  const current = breadcrumbsMap[currentTocId]

  if (current.parent === '') {
    return [currentTocId]
  }

  return [
    ...findPageBreadcrumbTrail(current.parent, breadcrumbsMap),
    currentTocId,
  ]
}

const createBreadcrumbText = (text: string, isLastIndex: boolean): string => {
  if (isLastIndex) {
    return text
  }

  return createShortenedBreadcrumbText(text)
}

const createHomeBreadcrumb = () => {
  return (
    <Link to={APP_ROUTES.INDEX}>
      <IconButton size='small'>
        <Book />
      </IconButton>
    </Link>
  )
}

const createBreadcrumbLink = (pageMetaMap: PageMetaMap, lastIndex: number) =>
  function BreadcrumbLink(tocNode: TOCNode, index: number) {
    const { text, id } = tocNode
    const isLastIndex = index === lastIndex
    const breadcrumbText = createBreadcrumbText(text, isLastIndex)
    const pageMeta = pageMetaMap[id]

    if (!pageMeta) {
      return <div key={index}>{breadcrumbText}</div>
    }

    return (
      <Link to={`/p/${pageMeta.url}`} key={index}>
        {breadcrumbText}
      </Link>
    )
  }

const getTocNode = (tocNodes: TOCNodes) => (tocId: string): TOCNode =>
  tocNodes[tocId]

const textsToReplace = [
  [' one', '1'],
  [' two', '2'],
  [' three', '3'],
  [' four', '4'],
  [' five', '5'],
  ['i.', '1'],
  ['ii.', '2'],
  ['iii.', '3'],
  ['iv.', '4'],
  ['v.', '5'],
  ['vi.', '6'],
  ['vii.', '7'],
  ['viii.', '8'],
  ['ix.', '9'],
  ['x.', '10'],
  ['xi.', '11'],
]

const createShortenedBreadcrumbText = (text: string) => {
  const shortenedText = textsToReplace.reduce(
    (currText, args) => currText.replace(args[0], args[1]),
    text.toLowerCase()
  )

  const numberInText = getNumberInText(shortenedText)
  if (!numberInText) {
    return text
  }

  return `${numberInText}.`
}

const FIRST_NUMBER_PATTERN = /\d/
const getNumberInText = (text: string) => {
  const matches = text.match(FIRST_NUMBER_PATTERN)
  if (!matches) {
    return ''
  }

  return matches[0]
}
