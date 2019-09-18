import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { WrapperRefMeta } from './pageScrollHooks'
import { HighlightWrapper } from 'components/HighlightWrapper/HighlightWrapper'
import {
  LeanPageParagraph,
  LeanPageParagraphElement,
  LeanTextElement,
  LeanAnchorElement,
} from 'makeStaticAssets/typedefs'
import { PageElementAttributes } from 'store/cccTypedefs'

interface PageParagraphProps {
  paragraph: LeanPageParagraph
  wrapperRefMeta: WrapperRefMeta
}

export const PageParagraph: React.FC<PageParagraphProps> = props => {
  const styles = useStyles()

  const { paragraph, wrapperRefMeta } = props
  const { elements, attrs = {} } = paragraph
  return (
    <HighlightWrapper refMeta={wrapperRefMeta}>
      <p
        className={classnames(styles.paragraph, {
          [styles.paragraphIndented]: !!attrs.indent,
        })}
      >
        {elements.map(renderParagraphElement(styles))}
      </p>
    </HighlightWrapper>
  )
}

const renderParagraphElement = (styles: Record<string, string>) => (
  element: LeanPageParagraphElement,
  index: number
) => {
  switch (element.type) {
    case 'spacer':
      return <br key={index} />
    case 'ref':
      return (
        <sup key={index} className={styles.sup}>
          {element.number}
        </sup>
      )
    case 'ref-anchor':
      return (
        <WithElementStyles element={element} key={index}>
          <a href={element.link}>⇒</a>
        </WithElementStyles>
      )
    case 'ref-ccc':
      return (
        <span key={index} className={styles.cccReferenceStyle}>
          {element.ref_number}{' '}
        </span>
      )
    case 'text':
      return (
        <WithElementStyles element={element} key={index}>
          {element.text}
        </WithElementStyles>
      )
    default:
      return ''
  }
}

interface WithElementStylesProps {
  element: LeanTextElement | LeanAnchorElement
}
const WithElementStyles: React.FC<WithElementStylesProps> = props => {
  const { children, element } = props
  const { attrs } = element

  return (
    <span>
      <BoldHOC attrs={attrs}>
        <ItalicHOC attrs={attrs}>{children}</ItalicHOC>
      </BoldHOC>
    </span>
  )
}

interface StyleHOCProps {
  attrs?: PageElementAttributes
}

const BoldHOC: React.FC<StyleHOCProps> = props => {
  const { attrs = {}, children } = props
  return attrs.b ? <b>{children}</b> : <>{children}</>
}
const ItalicHOC: React.FC<StyleHOCProps> = props => {
  const { attrs = {}, children } = props
  return attrs.i ? <i>{children}</i> : <>{children}</>
}

const useStyles = makeStyles({
  paragraph: {
    lineHeight: '1.5em',
    margin: 0,
    marginTop: '1em',
    padding: '0 5px',
  },
  paragraphIndented: {
    marginLeft: '2em',
    marginRight: '2em',
  },
  cccReferenceStyle: {
    borderLeft: '3px solid #b5b129',
    marginLeft: -13,
    paddingLeft: 10,
  },
  sup: {
    fontSize: '0.75em',
    lineHeight: 0,
  },
})
