import React from 'react'
import {
  PageParagraph as PageParagraphType,
  PageParagraphElement,
  TextElement,
} from '../../store/cccTypedefs'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'

interface PageParagraphProps {
  paragraph: PageParagraphType
}

export const PageParagraph: React.FC<PageParagraphProps> = props => {
  const styles = useStyles()

  const { paragraph } = props
  const { elements, attrs } = paragraph
  return (
    <p
      className={classnames(styles.paragraph, {
        [styles.paragraphIndented]: !!attrs.indent,
      })}
    >
      {elements.map(renderParagraphElement(styles))}
    </p>
  )
}

const renderParagraphElement = (styles: Record<string, string>) => (
  element: PageParagraphElement,
  index: number
) => {
  switch (element.type) {
    case 'spacer':
      return <br key={index} />
    case 'ref':
      return <sup key={index}>{element.number}</sup>
    case 'ref-anchor':
      return (
        <WithElementStyles element={element} key={index}>
          <a href={element.link}>⇒</a>
        </WithElementStyles>
      )
    case 'ref-ccc':
      return (
        <span className={styles.cccReferenceStyle}>{element.ref_number} </span>
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
  element: PageParagraphElement
}
const WithElementStyles: React.FC<WithElementStylesProps> = props => {
  const styles = useStyles()
  const element = props.element as TextElement
  const { attrs = {} } = element

  return (
    <span
      className={classnames(styles.elementTextDefaults, {
        [styles.elementTextBold]: attrs.b,
        [styles.elementTextItalicised]: attrs.i,
      })}
    >
      {props.children}
    </span>
  )
}

const useStyles = makeStyles({
  paragraph: {
    lineHeight: '1.5em',
    margin: 0,
    marginTop: '1em',
  },
  paragraphIndented: {
    margin: '0 5vh',
  },
  cccReferenceStyle: {
    borderLeft: '3px solid #b5b129',
    marginLeft: -13,
    paddingLeft: 10,
  },
  elementTextDefaults: {
    display: 'inline',
  },
  elementTextBold: {
    fontWeight: 'bold',
  },
  elementTextItalicised: {
    fontStyle: 'italic',
  },
})
