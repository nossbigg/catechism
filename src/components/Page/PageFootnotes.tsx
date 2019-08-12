import React from 'react'
import {
  PageFootnotes as PageFootnotesType,
  PageFootnote as PageFootnoteType,
  PageFootnoteRef,
} from '../../store/cccTypedefs'
import { makeStyles } from '@material-ui/styles'
import { RefsMap, WrapperRefMeta, getFootnoteRefKey } from './scrollHooks'
import { HighlightWrapper } from 'components/HighlightWrapper/HighlightWrapper'

interface PageFoonotesProps {
  footnotes: PageFootnotesType
  wrapperRefMetas: RefsMap
}

export const PageFootnotes: React.FC<PageFoonotesProps> = props => {
  const { footnotes, wrapperRefMetas } = props
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
      {footnoteKeys.map((key, index) => {
        const footnote = footnotes[key]
        const wrapperRefMeta = wrapperRefMetas[getFootnoteRefKey(key)]

        return (
          <PageFootnote
            footnote={footnote}
            wrapperRefMeta={wrapperRefMeta}
            key={index}
          />
        )
      })}
    </div>
  )
}

interface PageFootnoteProps {
  footnote: PageFootnoteType
  wrapperRefMeta: WrapperRefMeta
}
const PageFootnote: React.FC<PageFootnoteProps> = props => {
  const styles = useStyles()
  const { footnote, wrapperRefMeta } = props
  const { refs, number } = footnote

  const footnoteNumberElement = (
    <span key={-1} className={styles.footnoteRefStyle}>{`${number}. `}</span>
  )

  return (
    <HighlightWrapper refMeta={wrapperRefMeta}>
      <p className={styles.pageFootnote}>
        {refs.reduce(renderFootnoteRefs, [footnoteNumberElement])}
      </p>
    </HighlightWrapper>
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
    const commaElement = <span key={`${index}-comma`}>,</span>
    return [...acc, commaElement, renderedRef]
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
