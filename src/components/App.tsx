import React, { useEffect, useState } from 'react'
import { HashRouter, Route, RouteComponentProps } from 'react-router-dom'
import { Home } from './Home/Home'
import { PAGE_TOC_ID_MATCH, Page } from './Page/Page'
import { Index } from './Index/Index'
import { CCC_REFERENCE_MATCH, CCCReference } from './CCCReference/CCCReference'
import { CCCEnhancedStore } from 'store/cccTypedefs'
import { Search } from './Search/Search'
import request from 'request-promise-native'

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
    return null
  }

  return (
    <HashRouter>
      <Route path={APP_ROUTES.HOME} exact component={withStore(Home)}></Route>
      <Route path={APP_ROUTES.INDEX} component={withStore(Index)}></Route>
      <Route path={APP_ROUTES.PAGE} component={withStore(Page)}></Route>
      <Route path={APP_ROUTES.SEARCH} component={withStore(Search)}></Route>
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
  const PUBLIC_FOLDER_URL = window.location.origin
  const [store, setStore] = useState<CCCEnhancedStore | undefined>(undefined)

  useEffect(() => {
    if (!store) {
      const loadStore = async () => {
        const ccc = await request({
          uri: `${PUBLIC_FOLDER_URL}/ccc/ccc.json`,
          method: 'GET',
          json: true,
        })
        const cccMeta = await request({
          uri: `${PUBLIC_FOLDER_URL}/ccc/cccMeta.json`,
          method: 'GET',
          json: true,
        })
        setStore({ store: ccc, extraMeta: cccMeta })
      }
      setImmediate(loadStore)
    }
  }, [store, PUBLIC_FOLDER_URL])

  return { store, isLoaded: !!store }
}
