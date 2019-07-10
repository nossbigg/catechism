import React from 'react'
import { HashRouter, Route, RouteComponentProps } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'
import { TableOfContents } from './TableOfContents/TableOfContents'
import { CCC_REFERENCE_MATCH, CCCReference } from './CCCReference/CCCReference'
import { CCCEnhancedStore, getCCCStore } from 'store/cccImporter'

type AppRouteKeys = 'HOME' | 'PAGE' | 'TABLE_OF_CONTENTS' | 'CCC_REFERENCE'
type AppRoutes = Record<AppRouteKeys, string>

export const APP_ROUTES: AppRoutes = {
  HOME: '/',
  PAGE: `/p/:${PAGE_TOC_ID_MATCH}`,
  TABLE_OF_CONTENTS: '/toc',
  CCC_REFERENCE: `/r/:${CCC_REFERENCE_MATCH}`,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppRouteType<TRouteParams = any>
  extends RouteComponentProps<TRouteParams> {
  cccStore: CCCEnhancedStore
}

export const App: React.FC = () => {
  const cccStore = getCCCStore()
  const withStore = withStoreEnhancer(cccStore)

  return (
    <HashRouter>
      <Route path={APP_ROUTES.HOME} exact component={withStore(Home)}></Route>
      <Route path={APP_ROUTES.PAGE} component={withStore(Page)}></Route>
      <Route
        path={APP_ROUTES.CCC_REFERENCE}
        component={withStore(CCCReference)}
      ></Route>
      <Route
        path={APP_ROUTES.TABLE_OF_CONTENTS}
        component={withStore(TableOfContents)}
      ></Route>
    </HashRouter>
  )
}

const withStoreEnhancer = (store: CCCEnhancedStore) => (
  Component: React.FC<AppRouteType>
) =>
  function withStoreEnhancer(props: RouteComponentProps) {
    return <Component {...props} cccStore={store} />
  }
