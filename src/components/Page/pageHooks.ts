import { useEffect, useState } from 'react'
import request from 'request-promise-native'
import { PUBLIC_FOLDER_URL } from 'components/common/config'
import { LeanPageNode } from './../../makeStaticAssets/typedefs'

export const useLoadPageContentHook = (shortUrl: string) => {
  const [lastShortUrl, setShortUrl] = useState(shortUrl)
  const [pageNode, setPageNode] = useState<LeanPageNode | undefined>(undefined)

  useEffect(() => {
    if (!pageNode || lastShortUrl !== shortUrl) {
      setPageNode(undefined)
      const loadPageContent = async () => {
        const data = await request({
          uri: `${PUBLIC_FOLDER_URL}/ccc/pages/${shortUrl}.json`,
          method: 'GET',
          json: true,
        })
        setShortUrl(shortUrl)
        setPageNode(data)
      }
      setImmediate(loadPageContent)
    }
  }, [shortUrl, pageNode, lastShortUrl])

  return {
    isLoading: !pageNode,
    pageNode,
  }
}
