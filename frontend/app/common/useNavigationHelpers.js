import useWindowPath from 'dataSources/useWindowPath'
import URLHelpers from 'common/URLHelpers'
/**
 * @summary useNavigationHelpers
 * @description Custom hook to make working with NavigationHelpers easier
 *
 * @version 1.0.1
 *
 * @component
 *
 */
function useNavigationHelpers() {
  const { pushWindowPath, replaceWindowPath } = useWindowPath()
  const navigate = (url) => {
    // Add context path if it's defined and isn't in the url
    const ctxPath = URLHelpers.getContextPath()
    pushWindowPath(url.indexOf(ctxPath) === 0 ? url : `${ctxPath}${url}`)
  }

  return {
    navigate,
    navigateReplace: (url) => {
      // Add context path if it's defined and isn't in the url
      const ctxPath = URLHelpers.getContextPath()
      replaceWindowPath(url.indexOf(ctxPath) === 0 ? url : `${ctxPath}${url}`)
    },
    getSearchAsObject: ({ defaults = {}, decode = [], boolean = [] } = {}) => {
      const search = {}
      const toDecode = ['letter', 'searchTerm', ...decode]
      const toBoolean = [...boolean]
      if (window.location.search !== '') {
        const searchParams = (window.location.search || '?').replace(/^\?/, '')
        searchParams.split('&').forEach((item) => {
          if (item !== '' && /=/.test(item)) {
            const [propName, propValue] = item.split('=')
            let searchValue = propValue
            if (toDecode.includes(propName)) {
              searchValue = decodeURI(searchValue)
            }
            if (toBoolean.includes(propName)) {
              searchValue = propValue === 'true' ? true : false
            }
            search[propName] = searchValue
          }
        })
      }

      return Object.assign({}, defaults, search)
    },
    convertObjToUrlQuery: (obj) => {
      const urlQueryArray = []
      for (const [key, value] of Object.entries(obj)) {
        urlQueryArray.push(`${key}=${value}`)
      }
      return `${urlQueryArray.join('&')}`
    },
  }
}

export default useNavigationHelpers
