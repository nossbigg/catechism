import { useEffect } from 'react'

export const useScrollToTopOnPathChange = (path: string) =>
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])
