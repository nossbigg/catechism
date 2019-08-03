import React from 'react'
import { HashRouter, Route, RouteComponentProps } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'
import { Index } from './Index/Index'
import { CCC_REFERENCE_MATCH, CCCReference } from './CCCReference/CCCReference'
import { CCCEnhancedStore, getCCCStore } from 'store/cccImporter'

type AppRouteKeys = 'HOME' | 'PAGE' | 'INDEX' | 'CCC_REFERENCE'
type AppRoutes = Record<AppRouteKeys, string>

export const APP_ROUTES: AppRoutes = {
  HOME: '/',
  PAGE: `/p/:${PAGE_TOC_ID_MATCH}`,
  INDEX: '/index',
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
      <Route path={APP_ROUTES.INDEX} component={withStore(Index)}></Route>
      <Route path={APP_ROUTES.PAGE} component={withStore(Page)}></Route>
      <Route
        path={APP_ROUTES.CCC_REFERENCE}
        component={withStore(CCCReference)}
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
