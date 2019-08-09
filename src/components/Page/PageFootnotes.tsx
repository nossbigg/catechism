import React from 'react'
import {
  PageFootnotes as PageFootnotesType,
  PageFootnote as PageFootnoteType,
  PageFootnoteRef,
} from '../../store/cccTypedefs'
import { makeStyles } from '@material-ui/styles'

interface PageFoonotesProps {
  footnotes: PageFootnotesType
}

export const PageFootnotes: React.FC<PageFoonotesProps> = props => {
  const { footnotes } = props
  const styles = useStyles()

  // TODO sort ascending
  const footnoteKeys = Object.keys(footnotes)

  const hasFootnotes = footnoteKeys.length > 0
  if (!hasFootnotes) {
    return null
  }

  return (
    <div className={styles.pageFootnotesContainer}>
      <h2 className={styles.pageFootnoteLabel}>Footnotes</h2>
      {footnoteKeys
        .map(key => footnotes[key])
        .map((footnote, index) => (
          <PageFootnote footnote={footnote} key={index} />
        ))}
    </div>
  )
}

interface PageFootnoteProps {
  footnote: PageFootnoteType
}
const PageFootnote: React.FC<PageFootnoteProps> = props => {
  const styles = useStyles()
  const { refs, number } = props.footnote

  const footnoteNumberElement = (
    <span key={-1} className={styles.footnoteRefStyle}>{`${number}. `}</span>
  )

  return (
    <p className={styles.pageFootnote}>
      {refs.reduce(renderFootnoteRefs, [footnoteNumberElement])}
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

const useStyles = makeStyles({
  pageFootnotesContainer: {
    marginTop: '2em',
  },
  pageFootnote: {
    fontSize: '0.75em',
  },
  pageFootnoteLabel: {
    margin: 0,
    fontWeight: 'normal',
    color: 'gray',
  },
  footnoteRefStyle: {
    borderLeft: '3px solid #247300',
    marginLeft: -13,
    paddingLeft: 10,
  },
})
