export interface CCCStore {
  toc_nodes: TOCNodes;
  toc_link_tree: TOCLink[];
  page_nodes: PageNodes;
  ccc_refs: CCCRefs;
  meta: CCCStoreMeta;
}

interface TOCNodes {
  // eslint-disable-next-line @typescript-eslint/camelcase
  [toc_node: string]: TOCNode;
}
interface TOCNode {
  id: string;
  indent_level: number;
  text: string;
  link: string;
}

interface TOCLink {
  id: string;
  children: TOCLink[];
}

interface PageNodes {
  // eslint-disable-next-line @typescript-eslint/camelcase
  [page_node: string]: PageNode;
}
interface PageNode {
  id: string;
  paragraphs: PageParagraph[];
  footnotes: PageFootnotes;
}

interface PageParagraph {
  elements: PageParagraphElement[];
  attrs: PageElementAttributes;
}

interface PageElementAttributes {
  i?: boolean;
  b?: boolean;
  indent?: boolean;
  heavy_header?: boolean;
}

type PageParagraphElement =
  | TextElement
  | RefElement
  | AnchorElement
  | SpacerElement
  | CCCRefElement;
interface PageParagraphBaseElement {
  type: string;
}
interface TextElement extends PageParagraphBaseElement {
  text: "text";
  attrs: PageElementAttributes;
}
interface RefElement extends PageParagraphBaseElement {
  text: "ref";
  number: number;
}
interface AnchorElement extends PageParagraphBaseElement {
  text: "ref-anchor";
  link: string;
  attrs: PageElementAttributes;
}
interface SpacerElement extends PageParagraphBaseElement {
  type: "spacer";
}
interface CCCRefElement extends PageParagraphBaseElement {
  type: "ref-ccc";
  ref_number: number;
}

interface PageFootnotes {
  // eslint-disable-next-line @typescript-eslint/camelcase
  [footnote_number: number]: PageFootnote;
}
interface PageFootnote {
  number: number;
  refs: PageFootnoteRef[];
}
interface PageFootnoteRef {
  text: string;
  link: string;
}

interface CCCRefs {
  bible: CCCBibleRefs;
  others: CCCOthersRefs;
}

interface CCCBibleRefs {
  [shorthand: string]: CCCBibleRef;
}
interface CCCBibleRef {
  shorthand: string;
  text: string;
}

interface CCCOthersRefs {
  [shorthand: string]: CCCOthersRef;
}
interface CCCOthersRef {
  shorthand: string;
  text: string;
}

interface CCCStoreMeta {
  version: string;
  created_at: string;
  attribution: string[];
}
