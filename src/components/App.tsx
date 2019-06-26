import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'

type AppRouteKeys = 'HOME' | 'PAGE'
type AppRoutes = Record<AppRouteKeys, string>

export const APP_ROUTES: AppRoutes = {
  HOME: '/',
  PAGE: `/p/:${PAGE_TOC_ID_MATCH}`,
}

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Route path={APP_ROUTES.HOME} exact component={Home}></Route>
      <Route path={APP_ROUTES.PAGE} component={Page}></Route>
    </HashRouter>
  )
}
