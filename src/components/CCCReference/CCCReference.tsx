import React from 'react'
import { getCCCStore } from 'store/cccImporter'
import { findPage } from 'cccMetaGenerator/cccMetaGenerator'
import { AppRouteType } from 'components/App'

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

  const cccStore = getCCCStore()
  const matchedPageId = findPage(
    parseInt(cccReferenceMatch, 10),
    cccStore.extraMeta.cccRefRangeTree.root
  )

  if (!matchedPageId) {
    return null
  }

  const targetPageUrl = cccStore.extraMeta.pageMetaMap[matchedPageId].url
  props.history.replace(`/p/${targetPageUrl}`)

  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNumber = (v: any) => !isNaN(v as number)
