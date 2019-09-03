import React from 'react'
import { PageMetaMap } from '../../cccMetaGenerator/makePageMetaMap'
import { CCCEnhancedStore } from 'makeStaticAssets/typedefs'
import { Box, IconButton, makeStyles } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { historyPush } from '../../utils/reactRouterUtils'
import * as H from 'history'

interface PageControlsProps {
  tocId: string
  cccStore: CCCEnhancedStore
  history: H.History
}

export const PageControls: React.FC<PageControlsProps> = props => {
  const styles = useStyles()
  const { cccStore, history, tocId } = props

  const { pageMetaMap } = cccStore.extraMeta
  const { next, prev } = pageMetaMap[tocId]

  const hasNext = hasUrl(next, pageMetaMap)
  const hasPrev = hasUrl(prev, pageMetaMap)

  return (
    <Box className={styles.pageControls}>
      {hasPrev && (
        <IconButton
          className={`${styles.pageControlButton} ${styles.pageLeftButton}`}
          onClick={() =>
            historyPush(history, `/p/${getUrl(prev, pageMetaMap)}`)
          }
        >
          <KeyboardArrowLeft fontSize='large' />
        </IconButton>
      )}
      {hasNext && (
        <IconButton
          className={`${styles.pageControlButton} ${styles.pageRightButton}`}
          onClick={() =>
            historyPush(history, `/p/${getUrl(next, pageMetaMap)}`)
          }
        >
          <KeyboardArrowRight fontSize='large' />
        </IconButton>
      )}
    </Box>
  )
}

const hasUrl = (tocId: string, pageMetaMap: PageMetaMap) => tocId in pageMetaMap
const getUrl = (tocId: string, pageMetaMap: PageMetaMap) =>
  pageMetaMap[tocId].url

const useStyles = makeStyles({
  pageControls: { display: 'flex', paddingTop: '2em', paddingBottom: '1em' },
  pageLeftButton: {},
  pageRightButton: { marginLeft: 'auto' },
  pageControlButton: {
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
})
