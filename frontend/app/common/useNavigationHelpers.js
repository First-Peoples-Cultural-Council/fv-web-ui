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
    getSearchAsObject: (defaultSearch = {}) => {
      const search = {}
      const decode = ['letter']
      if (window.location.search !== '') {
        const searchParams = (window.location.search || '?').replace(/^\?/, '')
        searchParams.split('&').forEach((item) => {
          if (item !== '' && /=/.test(item)) {
            const propValue = item.split('=')
            search[propValue[0]] = decode.includes(propValue[0]) ? decodeURI(propValue[1]) : propValue[1]
          }
        })
      }

      return Object.assign({}, defaultSearch, search)
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
