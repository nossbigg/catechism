import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { getCCCStore } from 'store/cccImporter'
import { TOCLink, TOCNodes } from 'store/cccTypedefs'
import { PageMetaMap } from 'store/cccMetaGenerator'
import { Layout } from '../Layout/Layout'

export const TableOfContents: React.FC<RouteComponentProps> = props => {
  const cccStore = getCCCStore()
  const { store, extraMeta } = cccStore
  const { toc_link_tree, toc_nodes } = store
  const { pageMetaMap } = extraMeta

  return (
    <Layout routeHistory={props.history}>
      {renderTableOfContents(toc_link_tree, toc_nodes, pageMetaMap)}
    </Layout>
  )
}

const renderTableOfContents = (
  tocTree: TOCLink[],
  tocNodes: TOCNodes,
  pageMetaMap: PageMetaMap
) => {
  return (
    <ul>{tocTree.map(renderTableOfContentsNode(tocNodes, pageMetaMap))}</ul>
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
