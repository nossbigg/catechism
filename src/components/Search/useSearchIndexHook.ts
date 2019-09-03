import {
  createSearchIndexes,
  CCCSearchIndexes,
  createEmptyIndexes,
} from './createSearchIndex'
import { CCCEnhancedStore } from 'makeStaticAssets/typedefs'
import { useState, useEffect } from 'react'
import { once } from 'ramda'

export const useSearchIndexHook = (cccStore: CCCEnhancedStore) => {
  const [searchIndex, setSearchIndex] = useState<CCCSearchIndexes>(
    createEmptyIndexes()
  )
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (hasLoaded) {
      return
    }

    const loadSearchIndex = async () => {
      const newIndex = await createSearchIndex(cccStore)
      setSearchIndex(newIndex)
      setHasLoaded(true)
    }
    // to make this non-blocking to UI thread
    setImmediate(loadSearchIndex)
  }, [cccStore, hasLoaded])

  return {
    searchIndex,
  }
}

const createSearchIndex: (
  cccStore: CCCEnhancedStore
) => Promise<CCCSearchIndexes> = once((cccStore: CCCEnhancedStore) =>
  createSearchIndexes(cccStore)
)
