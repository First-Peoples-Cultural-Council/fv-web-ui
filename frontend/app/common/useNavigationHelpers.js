import useWindowPath from 'dataSources/useWindowPath'
import NavigationHelpers, { getNewPaginationUrl } from 'common/NavigationHelpers'
import URLHelpers from 'common/URLHelpers'
/**
 * @summary useNavigationHelpers
 * @description Custom hook to make working with NavigationHelpers easier
 *
 * @version 1.0.1
 *
 * @component
 *
 * @returns object {object} {changePagination}
 * @returns object.changePagination {function} Url is updated when changePagination({page, pageSize}) is called
 */
function useNavigationHelpers() {
  const { splitWindowPath, pushWindowPath, replaceWindowPath } = useWindowPath()
  return {
    changePagination: ({ page, pageSize }) => {
      NavigationHelpers.navigate(getNewPaginationUrl({ splitWindowPath, page, pageSize }), pushWindowPath, false)
    },
    navigate: (url) => {
      NavigationHelpers.navigate(url, pushWindowPath, false)
    },
    navigateReplace: (url) => {
      NavigationHelpers.navigate(url, replaceWindowPath, false)
    },
    getSearchObject: () => {
      if (window.location.search === '') {
        return {}
      }

      const search = {}
      const searchParams = (window.location.search || '?').replace(/^\?/, '')
      searchParams.split('&').forEach((item) => {
        if (item !== '' && /=/.test(item)) {
          const propValue = item.split('=')
          search[propValue[0]] = propValue[1]
        }
      })
      return search
    },
    getBaseURL: () => {
      return URLHelpers.getBaseURL()
    },
  }
}

export default useNavigationHelpers
