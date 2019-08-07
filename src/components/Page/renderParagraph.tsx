import React from 'react'
import {
  PageParagraph,
  PageParagraphElement,
  TextElement,
} from '../../store/cccTypedefs'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'

export const renderParagraph = (styles: Record<string, string>) =>
  function renderParagraph(paragraph: PageParagraph, index: number) {
    const { elements, attrs } = paragraph
    return (
      <p
        key={index}
        className={classnames({ [styles.paragraphIndented]: !!attrs.indent })}
      >
        {elements.map(renderParagraphElement)}
      </p>
    )
  }

const renderParagraphElement = (
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
      return element.ref_number + ' '
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
