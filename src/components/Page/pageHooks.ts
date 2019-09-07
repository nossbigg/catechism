import { useEffect, useState } from 'react'
import request from 'request-promise-native'
import { PUBLIC_FOLDER_URL } from 'components/common/config'
import { LeanPageNode } from './../../makeStaticAssets/typedefs'

export const useLoadPageContentHook = (shortUrl: string) => {
  const [lastShortUrl, setShortUrl] = useState('')
  const [pageNode, setPageNode] = useState<LeanPageNode | undefined>(undefined)

  useEffect(() => {
    if (urlHasChanged(lastShortUrl, shortUrl)) {
      setShortUrl(shortUrl)
      setPageNode(undefined)
      setImmediate(() => loadPageContent(shortUrl, data => setPageNode(data)))
    }
  }, [shortUrl, pageNode, lastShortUrl])

  return {
    isLoading: !pageNode,
    pageNode,
  }
}

const urlHasChanged = (url1: string, url2: string) => url1 !== url2

const loadPageContent = async (
  shortUrl: string,
  onDataLoad: (data: LeanPageNode) => void
) => {
  const data: LeanPageNode = await request({
    uri: `${PUBLIC_FOLDER_URL}/ccc/pages/${shortUrl}.json`,
    method: 'GET',
    json: true,
  })
  onDataLoad(data)
}
