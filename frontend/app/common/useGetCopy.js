import { useState, useEffect } from 'react'

// useGetCopy
// ============================================
export const useGetCopy = (webpackDynamicImport) => {
  const [copy, setCopy] = useState()
  useEffect(() => {
    const promised = webpackDynamicImport()
    promised.then((_copy) => {
      setCopy(_copy)
    })
  }, [])
  return copy
}
