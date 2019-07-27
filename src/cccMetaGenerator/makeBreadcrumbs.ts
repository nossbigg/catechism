import { mergeObjectsProperties } from './cccMetaGenerator'
import { TOCLink } from 'store/cccTypedefs'

export interface BreadcrumbsMap {
  [tocId: string]: PageBreadcrumb
}

interface PageBreadcrumb {
  id: string
  parent: string
}

export const makeBreadcrumbsMap = (
  crumbs: TOCLink[],
  parent: string
): BreadcrumbsMap => {
  const currentCrumbs = crumbs.map(tocLink => ({
    [tocLink.id]: makeBreadcrumb(parent)(tocLink),
  }))

  const childrenBreadcrumbs = crumbs
    .filter(tocLink => tocLink.children.length > 0)
    .map(tocLink => makeBreadcrumbsMap(tocLink.children, tocLink.id))

  return {
    ...mergeObjectsProperties(currentCrumbs),
    ...mergeObjectsProperties(childrenBreadcrumbs),
  }
}

const makeBreadcrumb = (parent: string) => (
  tocLink: TOCLink
): PageBreadcrumb => ({
  id: tocLink.id,
  parent,
})
