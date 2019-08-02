import { getAllTocLinks } from './cccMetaGenerator'
import {
  PageNode,
  CCCRefElement,
  TOCLink,
  PageNodes,
} from './../store/cccTypedefs'
export interface CCCRefRangeTree {
  root: RangeTreeNode
}
export interface RangeTreeNode {
  left: RangeTreeNode | undefined
  right: RangeTreeNode | undefined
  min: number
  max: number
  tocId: string | undefined
}

export const makeCCCRefRangeTree = (
  tocLinkTree: TOCLink[],
  pageNodes: PageNodes
): CCCRefRangeTree => {
  const tocIds = getAllTocLinks(tocLinkTree)
  const tocIdsWithPages = tocIds.filter(tocId => tocId in pageNodes)

  const rangeNodes: RangeTreeNode[] = tocIdsWithPages
    .map(tocId => pageNodes[tocId])
    .map(getRefRangeForPage)
    .filter(n => !!n) as RangeTreeNode[]

  /* eslint-disable  */
  let remainingNodes: RangeTreeNode[] = [...rangeNodes]
  let tempNodes: RangeTreeNode[] = []

  while (remainingNodes.length > 1) {
    const evenIndexes = remainingNodes.map((_, i) => i).filter(i => i % 2 === 0)
    evenIndexes.forEach(i => {
      const currentNode = remainingNodes[i]

      const hasNextElement = !!remainingNodes[i + 1]
      if (!hasNextElement) {
        tempNodes.push(currentNode)
        return
      }

      const nextNode = remainingNodes[i + 1]

      const newParentNode: RangeTreeNode = {
        left: currentNode,
        right: nextNode,
        min: currentNode.min,
        max: nextNode.max,
        tocId: undefined,
      }
      tempNodes.push(newParentNode)
    })

    remainingNodes = [...tempNodes]
    tempNodes = []
  }

  /* eslint-enable  */
  const rootNode = remainingNodes[0]
  return { root: rootNode }
}

const getRefRangeForPage = (pageNode: PageNode): RangeTreeNode | undefined => {
  const { id, paragraphs } = pageNode

  if (paragraphs.length === 0) {
    return undefined
  }

  const paragraphElements = paragraphs
    .map(p => p.elements)
    .reduce((acc, curr) => [...acc, ...curr], [])
  const cccRefNumbers = paragraphElements
    .filter(e => e.type === 'ref-ccc')
    .map(e => {
      return (e as CCCRefElement).ref_number
    })
    .filter(n => n)

  if (cccRefNumbers.length === 0) {
    return undefined
  }

  return {
    left: undefined,
    right: undefined,
    min: Math.min.apply(null, cccRefNumbers),
    max: Math.max.apply(null, cccRefNumbers),
    tocId: id,
  }
}

export const findPage = (
  cccRefNumber: number,
  rootRangeNode: RangeTreeNode
): string | undefined => {
  /* eslint-disable  */
  let currentNode: RangeTreeNode = rootRangeNode

  while (true) {
    const { left, right } = currentNode
    const isInLeft = !!left ? cccRefNumber <= left.max : false
    const isInRight = !!right ? cccRefNumber >= right.min : false

    if (isInLeft) {
      currentNode = left as RangeTreeNode
    } else if (isInRight) {
      currentNode = right as RangeTreeNode
    } else {
      return undefined
    }

    if (!!currentNode.tocId) {
      break
    }
  }

  /* eslint-enable  */

  return currentNode.tocId
}
