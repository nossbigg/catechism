import React from 'react'
import { makeStyles } from '@material-ui/core'
import { PUBLIC_FOLDER_URL } from 'components/common/config'

const cccIconPath = `${PUBLIC_FOLDER_URL}/ccc.svg`

export const LoadingPlaceholder: React.FC = () => {
  const styles = useStlyes()

  return (
    <div className={styles.container}>
      <div className={styles.cccIconContainer}>
        <div className={styles.cccIconPlaceholder}>
          <img
            src={cccIconPath}
            height='500px'
            width='auto'
            alt='Catechism Icon'
          />
        </div>
      </div>
    </div>
  )
}

const useStlyes = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '@keyframes cccIconAnimation': {
    '0%': { backgroundColor: 'rgb(215,202,47)' },
    '50%': { backgroundColor: 'rgb(255,245,129)' },
    '100%': { backgroundColor: 'rgb(215,202,47)' },
  },
  cccIconContainer: {
    backgroundColor: 'rgb(215,202,47)',
    maskImage: `url(${cccIconPath})`,
    animationName: '$cccIconAnimation',
    animationDuration: '0.75s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
    maskSize: 'contain',
    maskPosition: 'center',
  },
  cccIconPlaceholder: {
    opacity: 0,
  },
})

export const LoadingPlaceholderMaximized: React.FC = () => {
  const styles = useMaximizedStyles()
  return (
    <div className={styles.loadingContainer}>
      <LoadingPlaceholder />
    </div>
  )
}

const useMaximizedStyles = makeStyles({
  loadingContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
})
