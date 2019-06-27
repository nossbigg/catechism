import React from 'react'
import { getCCCStore } from 'store/cccImporter'
import { TOCLink, TOCNodes } from 'store/cccTypedefs'

export const TableOfContents: React.FC = () => {
  const cccStore = getCCCStore()
  const { store } = cccStore
  const { toc_link_tree, toc_nodes } = store

  return renderTableOfContents(toc_link_tree, toc_nodes)
}

const renderTableOfContents = (tocTree: TOCLink[], tocNodes: TOCNodes) => {
  return <ul>{tocTree.map(renderTableOfContentsNode(tocNodes))}</ul>
}

// eslint-disable-next-line react/display-name
const renderTableOfContentsNode = (tocNodes: TOCNodes) => (
  tocLink: TOCLink,
  index: number
) => {
  const { children, id } = tocLink
  const { text, link } = tocNodes[id]

  const renderedChildren =
    children.length > 0 ? (
      <ul>{children.map(renderTableOfContentsNode(tocNodes))}</ul>
    ) : (
      <></>
    )
  const renderedText = link ? <a href={link}>{text}</a> : text

  return (
    <li key={index}>
      {renderedText}
      {renderedChildren}
    </li>
  )
}
