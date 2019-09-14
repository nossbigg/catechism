import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { PUBLIC_FOLDER_URL } from 'components/common/config'

const cccIconPath = `${PUBLIC_FOLDER_URL}/ccc.svg`
const DEFAULT_ICON_SHOW_TIMEOUT = 1000

interface LoadingPlaceholderProps {
  showImmediately?: boolean
}

export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = props => {
  const { showImmediately = false } = props
  const styles = useStlyes()

  const [showIcon, setShowIcon] = useState(showImmediately)
  const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined)

  useEffect(() => {
    if (!showImmediately && !timer) {
      const newTimer = setTimeout(() => {
        setShowIcon(true)
      }, DEFAULT_ICON_SHOW_TIMEOUT)
      setTimer(newTimer)
    }

    return () => {
      timer && clearTimeout(timer)
    }
  }, [showImmediately, timer])

  if (!showIcon) {
    return null
  }

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

export const LoadingPlaceholderMaximized: React.FC<
  LoadingPlaceholderProps
> = props => {
  const styles = useMaximizedStyles()
  return (
    <div className={styles.loadingContainer}>
      <LoadingPlaceholder {...props} />
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
