import React from 'react'
import { RouteComponentProps } from 'react-router'

export const Home: React.FC<RouteComponentProps> = props => {
  props.history.replace('/toc')
  return null
}
