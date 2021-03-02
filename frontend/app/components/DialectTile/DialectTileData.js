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
function DialectTileData({ children, dialectGroups, dialectTitle, href, isWorkspaces }) {
  const { computeLogin } = useLogin()
  const { pushWindowPath } = useWindowPath()

  // Check if user is a member of the dialect
  let userIsMember = false

  const userGroups = selectn('response.properties.groups', computeLogin)

  if (userGroups && userGroups.length > 0) {
    const arrayIntersection = userGroups.filter((value) => dialectGroups.indexOf('group:' + value) > -1)
    userIsMember = arrayIntersection.length >= 1
  }

  // Only set to private if it is a Workspaces href, or not in Workspaces, or the user is not a member of the dialect
  const isPrivate = !(href.indexOf('Workspaces') === -1 || isWorkspaces || userIsMember)
  const isLoggedIn = computeLogin.success && computeLogin.isConnected
  const hrefToUse = isPrivate ? '/register' : NavigationHelpers.generateStaticURL(href)

  const onDialectClick = (e) => {
    e.preventDefault()
    // If it is a private site, but the user is already a logged in FirstVoices member, use mailto
    if (isPrivate && isLoggedIn) {
      window.location.href = `mailto:hello@firstvoices.com?subject=Request to join ${dialectTitle}&body=${computeLogin.response.id} would like to request access to the ${dialectTitle} Language Site`
    } else {
      NavigationHelpers.navigate(hrefToUse, pushWindowPath, false)
    }
  }

  return children({
    hrefToUse,
    isLoggedIn,
    isPrivate,
    onDialectClick,
  })
}
// PROPTYPES
const { array, bool, func, string } = PropTypes
DialectTileData.propTypes = {
  children: func,
  dialectGroups: array,
  dialectTitle: string,
  href: string,
  isWorkspaces: bool,
}

export default DialectTileData
