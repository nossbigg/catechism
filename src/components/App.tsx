import React, { useEffect, useState } from 'react'
import { HashRouter, Route, RouteComponentProps } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'
import { Index } from './Index/Index'
import { CCC_REFERENCE_MATCH, CCCReference } from './CCCReference/CCCReference'
import { CCCEnhancedStore } from 'makeStaticAssets/typedefs'
import { Search } from './Search/Search'
import request from 'request-promise-native'
import { FLAG_ENABLE_SEARCH_PAGE } from 'components/common/featureFlags'
import { PUBLIC_FOLDER_URL } from 'components/common/config'
import { LoadingPlaceholder } from './LoadingPlaceholder/LoadingPlaceholder'

type AppRouteKeys = 'HOME' | 'PAGE' | 'INDEX' | 'CCC_REFERENCE' | 'SEARCH'
type AppRoutes = Record<AppRouteKeys, string>

export const APP_ROUTES: AppRoutes = {
  HOME: '/',
  PAGE: `/p/:${PAGE_TOC_ID_MATCH}`,
  INDEX: '/index',
  CCC_REFERENCE: `/r/:${CCC_REFERENCE_MATCH}`,
  SEARCH: `/s`,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppRouteType<TRouteParams = any>
  extends RouteComponentProps<TRouteParams> {
  cccStore: CCCEnhancedStore
}

export const App: React.FC = () => {
  const { isLoaded, store: cccStore } = useCCCStoreHook()
  const withStore = withStoreEnhancer(cccStore as CCCEnhancedStore)

  if (!isLoaded) {
    return <LoadingPlaceholder />
  }

  return (
    <HashRouter>
      <Route path={APP_ROUTES.HOME} exact component={withStore(Home)}></Route>
      <Route path={APP_ROUTES.INDEX} component={withStore(Index)}></Route>
      <Route path={APP_ROUTES.PAGE} component={withStore(Page)}></Route>
      {FLAG_ENABLE_SEARCH_PAGE && (
        <Route path={APP_ROUTES.SEARCH} component={withStore(Search)}></Route>
      )}
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

const useCCCStoreHook = () => {
  const [store, setStore] = useState<CCCEnhancedStore | undefined>(undefined)

  useEffect(() => {
    if (!store) {
      setImmediate(() => loadRemoteStores(setStore))
    }
  }, [store])

  return { store, isLoaded: !!store }
}

const loadRemoteStores = async (
  setStore: (store: CCCEnhancedStore) => void
) => {
  const cccRequest = () =>
    request({
      uri: `${PUBLIC_FOLDER_URL}/ccc/ccc.json`,
      method: 'GET',
      json: true,
    })
  const cccMetaRequest = () =>
    request({
      uri: `${PUBLIC_FOLDER_URL}/ccc/cccMeta.json`,
      method: 'GET',
      json: true,
    })

  const [ccc, cccMeta] = await Promise.all([cccRequest(), cccMetaRequest()])
  setStore({ store: ccc, extraMeta: cccMeta })
}
