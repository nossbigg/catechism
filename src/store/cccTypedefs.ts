export interface CCCStore {
  toc_nodes: TOCNodes
  toc_link_tree: TOCLink[]
  page_nodes: PageNodes
  ccc_refs: CCCRefs
  meta: CCCStoreMeta
}

export interface TOCNodes {
  [toc_node: string]: TOCNode
}
export interface TOCNode {
  id: string
  indent_level: number
  text: string
  link?: string
}

export interface TOCLink {
  id: string
  children: TOCLink[]
}

export interface PageNodes {
  [page_node: string]: PageNode
}
export interface PageNode {
  id: string
  paragraphs: PageParagraph[]
  footnotes: PageFootnotes
}

export interface PageParagraph {
  elements: PageParagraphElement[]
  attrs: PageElementAttributes
}

interface PageElementAttributes {
  i?: boolean
  b?: boolean
  indent?: boolean
  heavy_header?: boolean
}

export type PageParagraphElement =
  | TextElement
  | RefElement
  | AnchorElement
  | CCCRefElement
  | SpacerElement

export type PageParagraphElementType =
  | 'text'
  | 'ref'
  | 'ref-anchor'
  | 'ref-ccc'
  | 'spacer'

interface PageParagraphBaseElement {
  type: PageParagraphElementType
}
interface TextElement extends PageParagraphBaseElement {
  type: 'text'
  text: string
  attrs: PageElementAttributes
}
interface RefElement extends PageParagraphBaseElement {
  type: 'ref'
  number: number
}
interface AnchorElement extends PageParagraphBaseElement {
  type: 'ref-anchor'
  link: string
  attrs: PageElementAttributes
}
export interface CCCRefElement extends PageParagraphBaseElement {
  type: 'ref-ccc'
  ref_number: number
}
interface SpacerElement extends PageParagraphBaseElement {
  type: 'spacer'
}

interface PageFootnotes {
  [footnote_number: number]: PageFootnote
}
interface PageFootnote {
  number: number
  refs: PageFootnoteRef[]
}
interface PageFootnoteRef {
  text: string
  link: string
}

interface CCCRefs {
  bible: CCCBibleRefs
  others: CCCOthersRefs
}

interface CCCBibleRefs {
  [shorthand: string]: CCCBibleRef
}
interface CCCBibleRef {
  shorthand: string
  text: string
}

interface CCCOthersRefs {
  [shorthand: string]: CCCOthersRef
}
interface CCCOthersRef {
  shorthand: string
  text: string
}

interface CCCStoreMeta {
  version: string
  created_at: string
  attribution: string[]
}
