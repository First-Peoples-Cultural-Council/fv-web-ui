import PropTypes from 'prop-types'
import selectn from 'selectn'

import useLogin from 'dataSources/useLogin'
import useWindowPath from 'dataSources/useWindowPath'
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * @summary DialectTileData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectTileData({ children, dialectGroups, href, isWorkspaces }) {
  const { computeLogin } = useLogin()
  const { pushWindowPath } = useWindowPath()

  // Check if user is a member of the dialect
  const userGroups = selectn('response.properties.groups', computeLogin)
  const arrayIntersection = userGroups.filter((value) => dialectGroups.indexOf('group:' + value) > -1)
  const userIsMember = arrayIntersection.length >= 1

  // Only set to private if it is a Workspaces href, or not in Workspaces, or the user is not a member of the dialect
  const isPrivate = !(href.indexOf('Workspaces') === -1 || isWorkspaces || userIsMember)
  const hrefToUse = isPrivate ? '/register' : NavigationHelpers.generateStaticURL(href)

  const onDialectClick = (e) => {
    e.preventDefault()
    NavigationHelpers.navigate(hrefToUse, pushWindowPath, false)
  }

  return children({
    hrefToUse,
    isPrivate,
    onDialectClick,
  })
}
// PROPTYPES
const { array, bool, func, string } = PropTypes
DialectTileData.propTypes = {
  children: func,
  dialectGroups: array,
  href: string,
  isWorkspaces: bool,
}

export default DialectTileData
