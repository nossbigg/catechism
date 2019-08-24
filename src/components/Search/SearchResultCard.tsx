import React from 'react'
import { SearchEntry } from './createSearchIndex'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface SearchResultCardProps {
  entry: SearchEntry
}

export const SearchResultCard: React.FC<SearchResultCardProps> = props => {
  const { entry } = props
  const { title } = entry

  const styles = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper className={styles.paper}>{title}</Paper>
    </Grid>
  )
}

const useStyles = makeStyles({ paper: { height: '5em', padding: 20 } })
