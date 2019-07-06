import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { CCC_REFERENCE_MATCH, CCCReference } from './CCCReference/CCCReference'

type AppRouteKeys = 'HOME' | 'PAGE' | 'TABLE_OF_CONTENTS' | 'CCC_REFERENCE'
type AppRoutes = Record<AppRouteKeys, string>

export const APP_ROUTES: AppRoutes = {
  HOME: '/',
  PAGE: `/p/:${PAGE_TOC_ID_MATCH}`,
  TABLE_OF_CONTENTS: '/toc',
  CCC_REFERENCE: `/r/:${CCC_REFERENCE_MATCH}`,
}

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Route path={APP_ROUTES.HOME} exact component={Home}></Route>
      <Route path={APP_ROUTES.PAGE} component={Page}></Route>
      <Route path={APP_ROUTES.CCC_REFERENCE} component={CCCReference}></Route>
      <Route
        path={APP_ROUTES.TABLE_OF_CONTENTS}
        component={TableOfContents}
      ></Route>
    </HashRouter>
  )
}
