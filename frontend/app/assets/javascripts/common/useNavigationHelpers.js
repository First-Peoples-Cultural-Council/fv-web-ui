import useWindowPath from 'DataSource/useWindowPath'
import NavigationHelpers, { getNewPaginationUrl } from 'common/NavigationHelpers'
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
  }
}

export default useNavigationHelpers
