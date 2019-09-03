import { TocIdToUrlMap } from 'makeStaticAssets/typedefs'

export interface UrlToTocIdMap {
  [url: string]: string
}

export const makeUrlToTocMap = (
  tocIdToUrlMap: TocIdToUrlMap
): UrlToTocIdMap => {
  return Object.entries(tocIdToUrlMap).reduce((acc, [tocId, url]) => {
    const urlWithoutShortLink = stripUrlShortLink(url)
    return { ...acc, [urlWithoutShortLink]: tocId }
  }, {})
}

const SHORT_LINK_PATTERN = /\+.*$/
export const stripUrlShortLink = (url: string) =>
  url.replace(SHORT_LINK_PATTERN, '')
