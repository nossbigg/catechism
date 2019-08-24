import React, { useState, useEffect } from 'react'
import { AppRouteType } from 'components/App'
import { Layout } from 'components/Layout/Layout'
import { TextField, IconButton } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'
import { useSearchIndexHook } from './useSearchIndexHook'
import { CCCSearchIndexes, SearchEntry } from './createSearchIndex'
import { SearchResults } from './SearchResults'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SearchProps extends AppRouteType {}

export const Search: React.FC<SearchProps> = props => {
  const { cccStore } = props
  const { searchIndex } = useSearchIndexHook(cccStore)

  const [searchTerm, setSearchTerm] = useState('')
  const [doSearch, setDoSearch] = useState(false)
  const [searchResult, setSearchResult] = useState(emptySearchResult)

  useEffect(() => {
    if (!doSearch) {
      return
    }

    const doSearchOperation = async () => {
      const searchMatches = getMatchingPages(searchIndex, searchTerm)
      setSearchResult(searchMatches)
      setDoSearch(false)
    }
    setImmediate(doSearchOperation)
  }, [doSearch, searchIndex, searchTerm, cccStore])

  return (
    <Layout routeHistory={props.history}>
      <div>
        <TextField
          label='Search Term'
          value={searchTerm}
          disabled={doSearch}
          autoFocus={true}
          onChange={evt => setSearchTerm(evt.target.value)}
        />
        <IconButton onClick={() => setDoSearch(true)} disabled={doSearch}>
          <SearchIcon />
        </IconButton>
      </div>
      <div>
        <SearchResults searchResult={searchResult} searchTerm={searchTerm} />
      </div>
    </Layout>
  )
}

export interface SearchResult {
  byTitle: SearchEntry[]
  byContent: SearchEntry[]
}

const getMatchingPages = (
  searchIndex: CCCSearchIndexes,
  term: string
): SearchResult => {
  const { ready, searchByTitle, searchByContent } = searchIndex
  if (!ready) {
    return emptySearchResult
  }

  const indexSearchTerm = `${term}*`
  const titleMatches = searchByTitle(indexSearchTerm)
  const contentMatches = searchByContent(indexSearchTerm)
  return { byTitle: titleMatches, byContent: contentMatches }
}

const emptySearchResult: SearchResult = { byTitle: [], byContent: [] }
