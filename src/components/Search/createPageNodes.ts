import request from 'request-promise-native'
import { PageNodes, PageNode } from './../../store/cccTypedefs'
import { CCCEnhancedStore } from 'makeStaticAssets/typedefs'
import { PUBLIC_FOLDER_URL } from 'components/common/config'

export const createPageNodesFromRemote = async (
  cccStore: CCCEnhancedStore
): Promise<PageNodes> => {
  const { urlMap, pageMetaMap } = cccStore.extraMeta

  const reverseUrlMap: Record<string, string> = Object.keys(urlMap).reduce(
    (acc, shortUrl) => {
      const tocId = urlMap[shortUrl]
      return { ...acc, [tocId]: shortUrl }
    },
    {}
  )

  const shortUrls = Object.keys(pageMetaMap).map(k => reverseUrlMap[k])
  const pageNodesRaw: PageNode[] = await Promise.all(
    shortUrls.map(loadPageContent)
  )

  return pageNodesRaw.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {})
}

const loadPageContent = async (shortUrl: string) => {
  return request({
    uri: `${PUBLIC_FOLDER_URL}/ccc/pages/${shortUrl}.json`,
    method: 'GET',
    json: true,
  })
}
