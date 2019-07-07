import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { getCCCStore } from 'store/cccImporter'
import { TOCLink, TOCNodes } from 'store/cccTypedefs'
import { PageMetaMap } from 'store/cccMetaGenerator'
import { Layout } from '../Layout/Layout'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  ul: {
    paddingLeft: 20,
    lineHeight: 1.5,
    '& ul': {
      paddingLeft: 20,
    },
    '& li:last-child': {
      marginBottom: 10,
    },
  },
})

export const TableOfContents: React.FC<RouteComponentProps> = props => {
  const styles = useStyles()

  const cccStore = getCCCStore()
  const { store, extraMeta } = cccStore
  const { toc_link_tree, toc_nodes } = store
  const { pageMetaMap } = extraMeta

  return (
    <Layout routeHistory={props.history}>
      {renderTableOfContents(toc_link_tree, toc_nodes, pageMetaMap, styles)}
    </Layout>
  )
}

const renderTableOfContents = (
  tocTree: TOCLink[],
  tocNodes: TOCNodes,
  pageMetaMap: PageMetaMap,
  styles: Record<string, string>
) => {
  return (
    <ul className={styles.ul}>
      {tocTree.map(renderTableOfContentsNode(tocNodes, pageMetaMap))}
    </ul>
  )
}

const renderTableOfContentsNode = (
  tocNodes: TOCNodes,
  pageMetaMap: PageMetaMap
  // eslint-disable-next-line react/display-name
) => (tocLink: TOCLink, index: number) => {
  const { children, id } = tocLink
  const { text, link } = tocNodes[id]
  const { url } = pageMetaMap[id]

  const renderedChildren =
    children.length > 0 ? (
      <ul>{children.map(renderTableOfContentsNode(tocNodes, pageMetaMap))}</ul>
    ) : (
      <></>
    )
  const renderedText = link ? <Link to={`/p/${url}`}>{text}</Link> : text

  return (
    <li key={index}>
      {renderedText}
      {renderedChildren}
    </li>
  )
}
