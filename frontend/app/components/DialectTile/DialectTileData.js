import { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useLogin from 'dataSources/useLogin'
import useWindowPath from 'dataSources/useWindowPath'
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * @summary DialectTileData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectTileData({ children, dialectGroups, dialectId, href, isWorkspaces }) {
  const { computeLogin } = useLogin()
  const { pushWindowPath } = useWindowPath()

  // Set up Dialog and Tooltipstate
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    if (isPrivate) {
      setIsDialogOpen(true)
    } else {
      NavigationHelpers.navigate(hrefToUse, pushWindowPath, false)
    }
  }

  const handleDialogCancel = () => {
    setIsDialogOpen(false)
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    window.location.href = `/register?requestedSite=${dialectId}`
  }

  return children({
    hrefToUse,
    isLoggedIn,
    isPrivate,
    onDialectClick,
    // Dialog
    isDialogOpen,
    handleDialogCancel,
    handleDialogOk,
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
