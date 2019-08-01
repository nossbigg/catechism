import { TOCNode, TOCLink, PageNode } from './../store/cccTypedefs'

export const createTocLink = (
  id: string,
  children: TOCLink[] = []
): TOCLink => ({
  id,
  children,
})

export const createTocNode = (
  id: string,
  text: string,
  { indent_level = 0, link = '' }: Partial<TOCNode> = {}
): TOCNode => ({ id, text, indent_level, link })

export const createPageNode = (id: string): PageNode => ({
  id,
  paragraphs: [],
  footnotes: [],
})
