import React from 'react'
import { SearchResult } from './Search'
import { makeStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { SearchResultCard } from './SearchResultCard'

interface SearchResultsProps {
  searchResult: SearchResult
  searchTerm: string
}

export const SearchResults: React.FC<SearchResultsProps> = props => {
  const styles = useStyles()
  const { searchResult, searchTerm } = props

  const withWrapperContainer = (element: JSX.Element) => (
    <div className={styles.searchResultsWrapper}>
      <div className={styles.searchResultsLabel}>Search Results</div>
      {element}
    </div>
  )

  if (isEmptySearchTerm(searchTerm)) {
    return withWrapperContainer(
      <div className={styles.labelDiv}>No Search Term</div>
    )
  }

  if (hasNoMatchingResults(searchResult)) {
    return withWrapperContainer(
      <div className={styles.labelDiv}>No Matching Results</div>
    )
  }

  const { byTitle, byContent } = searchResult
  const combinedEntries = [...byTitle, ...byContent]
  return withWrapperContainer(
    <Grid container spacing={3}>
      {combinedEntries.map((entry, index) => (
        <SearchResultCard entry={entry} key={index} />
      ))}
    </Grid>
  )
}

const isEmptySearchTerm = (term: string): boolean => term === ''

const hasNoMatchingResults = (result: SearchResult): boolean => {
  const { byTitle, byContent } = result
  const totalResults = byTitle.length + byContent.length

  return totalResults === 0
}

const useStyles = makeStyles({
  searchResultsWrapper: {
    paddingTop: '1em',
    paddingBottom: '1em',
    minHeight: 200,
  },
  searchResultsLabel: {
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: '0.5em',
  },
  labelDiv: { height: '100%', color: 'gray' },
})
