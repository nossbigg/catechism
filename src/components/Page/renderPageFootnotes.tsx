import React from 'react'
import {
  PageFootnotes,
  PageFootnote,
  PageFootnoteRef,
} from '../../store/cccTypedefs'

export const renderFootnotes = (footnotes: PageFootnotes) => {
  // TODO sort ascending
  const footnoteKeys = Object.keys(footnotes)

  const hasFootnotes = footnoteKeys.length > 0
  if (!hasFootnotes) {
    return null
  }

  return (
    <div>{footnoteKeys.map(key => footnotes[key]).map(renderFootnote)}</div>
  )
}

const renderFootnote = (footnote: PageFootnote) => {
  const { refs, number } = footnote
  return (
    <p>
      {refs.reduce(renderFootnoteRefs, [<span key={-1}>{`${number}. `}</span>])}
    </p>
  )
}

const renderFootnoteRefs = (
  acc: JSX.Element[],
  curr: PageFootnoteRef,
  index: number
) => {
  const shouldAddComma = index > 0
  const renderedRef = <span key={index}>{curr.text}</span>

  if (shouldAddComma) {
    return [...acc, <>,</>, renderedRef]
  }
  return [...acc, renderedRef]
}
