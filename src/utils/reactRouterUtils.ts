import * as H from 'history'

export const historyPush = (history: H.History, url: string) =>
  // eslint-disable-next-line fp/no-mutating-methods
  history.push(url)
