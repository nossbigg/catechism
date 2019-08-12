import React from 'react'
import { getCCCStore } from 'store/cccImporter'
import { findPage } from 'cccMetaGenerator/makeRefRangeTree'
import { AppRouteType } from 'components/App'
import { getCCCRefKey } from 'components/Page/pageScrollHooks'

export const CCC_REFERENCE_MATCH = 'CCC_REFERENCE_MATCH'

interface PageRouteParams {
  [CCC_REFERENCE_MATCH]: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CCCReferenceProps extends AppRouteType<PageRouteParams> {}

export const CCCReference: React.FC<CCCReferenceProps> = props => {
  const cccReferenceMatch = props.match.params[CCC_REFERENCE_MATCH]
  if (!cccReferenceMatch || !isNumber(cccReferenceMatch)) {
    return null
  }

  const cccReferenceNumber = parseInt(cccReferenceMatch, 10)
  const cccStore = getCCCStore()
  const matchedPageId = findPage(
    cccReferenceNumber,
    cccStore.extraMeta.cccRefRangeTree.root
  )

  if (!matchedPageId) {
    return null
  }

  const targetPageUrl = cccStore.extraMeta.pageMetaMap[matchedPageId].url
  props.history.replace(
    `/p/${targetPageUrl}?focus=${getCCCRefKey(cccReferenceNumber)}`
  )

  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNumber = (v: any) => !isNaN(v as number)
