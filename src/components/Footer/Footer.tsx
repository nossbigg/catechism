import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container } from '@material-ui/core'

export const Footer: React.FC = () => {
  const styles = useStyles()

  return (
    <div className={styles.footerContainer}>
      <Container maxWidth='md'>
        <b>Catechism of the Catholic Church</b>
        <div>© Libreria Editrice Vaticana</div>
        <div>© St. Charles Borromeo Catholic Church</div>
      </Container>
    </div>
  )
}

const useStyles = makeStyles({
  footerContainer: {
    fontSize: '0.75em',
    backgroundColor: '#f7f0d8',
    padding: '2em 0',
  },
})
