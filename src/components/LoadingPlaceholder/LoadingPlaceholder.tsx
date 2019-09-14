import React from 'react'
import { makeStyles } from '@material-ui/core'
import { PUBLIC_FOLDER_URL } from 'components/common/config'

const cccIconPath = `${PUBLIC_FOLDER_URL}/ccc.svg`

export const LoadingPlaceholder: React.FC = () => {
  const styles = useStlyes()

  return (
    <div className={styles.cccIconContainer}>
      <div className={styles.cccIconPlaceholder}>
        <img
          src={cccIconPath}
          height='300px'
          width='auto'
          alt='Catechism Icon'
        />
      </div>
    </div>
  )
}

const useStlyes = makeStyles({
  '@keyframes cccIconAnimation': {
    '0%': { backgroundColor: 'rgb(215,202,47)' },
    '50%': { backgroundColor: 'rgb(255,245,129)' },
    '100%': { backgroundColor: 'rgb(215,202,47)' },
  },
  cccIconContainer: {
    backgroundColor: 'rgb(215,202,47)',
    maskImage: `url(${cccIconPath})`,
    maskRepeat: 'no-repeat',
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
    height: '100vh',
    width: '100vw',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
})
