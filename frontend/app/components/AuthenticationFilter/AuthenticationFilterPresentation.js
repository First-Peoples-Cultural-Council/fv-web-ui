import React from 'react'
import PropTypes from 'prop-types'

import selectn from 'selectn'
import { SECTIONS } from 'common/Constants'
import Error403 from 'components/Error403'
import CircularProgress from '@material-ui/core/CircularProgress'

/**
 * @summary AuthenticationFilterPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AuthenticationFilterPresentation({
  // Calling components
  children,
  containerStyle,
  hideFromSections,
  is403,
  notAuthenticatedComponent,
  // Data layer
  routeParams,
  computeLogin,
}) {
  if (is403) {
    return <Error403 redirect={window.location.pathname} />
  }

  const { isFetching, success, isConnected } = computeLogin

  if (isFetching) {
    return <CircularProgress mode="indeterminate" />
  }

  // Logged in user.
  if (success && isConnected) {
    // Hide from sections for logged in user as well.
    const isSection = selectn('area', routeParams) === SECTIONS
    if (hideFromSections && isSection) {
      return null
    }

    return <div style={containerStyle}>{children}</div>
  }

  return notAuthenticatedComponent
}

// PROPTYPES
const { boolean, node, object } = PropTypes
AuthenticationFilterPresentation.propTypes = {
  // Calling components
  children: node,
  containerStyle: object,
  hideFromSections: boolean,
  is403: boolean,
  notAuthenticatedComponent: node,
  // Data layer
  routeParams: object,
  computeLogin: object,
}
AuthenticationFilterPresentation.defaultProps = {
  computeLogin: {},
  notAuthenticatedComponent: null,
  is403: false,
  hideFromSections: false,
}
export default AuthenticationFilterPresentation
