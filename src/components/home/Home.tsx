import React from 'react'
import { RouteComponentProps } from 'react-router'
import { APP_ROUTES } from 'components/App'

export const Home: React.FC<RouteComponentProps> = props => {
  props.history.replace(APP_ROUTES.INDEX)
  return null
}
