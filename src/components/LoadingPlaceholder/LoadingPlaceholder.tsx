import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core'

export const LoadingPlaceholder: React.FC = () => {
  const styles = useStlyes()

  return (
    <div className={styles.container}>
      <CircularProgress />
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
})
