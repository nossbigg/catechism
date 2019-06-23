import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Home } from './Home/Home'

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Route path='/' component={Home}></Route>
    </HashRouter>
  )
}
