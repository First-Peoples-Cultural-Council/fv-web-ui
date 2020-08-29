import useWindowPath from 'DataSource/useWindowPath'
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
  const { splitWindowPath, pushWindowPath } = useWindowPath()
  return {
    changePagination: ({ page, pageSize }) => {
      NavigationHelpers.navigate(getNewPaginationUrl({ splitWindowPath, page, pageSize }), pushWindowPath, false)
    },
    navigate: (url) => {
      NavigationHelpers.navigate(url, pushWindowPath, false)
    },
    getBaseURL: () => {
      return URLHelpers.getBaseURL()
    },
  }
}

export default useNavigationHelpers
