import React from 'react'
import PropTypes from 'prop-types'
import AuthenticationFilterPresentation from 'components/AuthenticationFilter/AuthenticationFilterPresentation'
import AuthenticationFilterData from 'components/AuthenticationFilter/AuthenticationFilterData'

/**
 * @summary AuthenticationFilterContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AuthenticationFilterContainer({
  children,
  containerStyle,
  hideFromSections,
  is403,
  notAuthenticatedComponent,
}) {
  return (
    <AuthenticationFilterData>
      {({ routeParams, computeLogin }) => {
        return (
          <AuthenticationFilterPresentation
            // Calling components
            containerStyle={containerStyle}
            hideFromSections={hideFromSections}
            is403={is403}
            notAuthenticatedComponent={notAuthenticatedComponent}
            // Data layer
            computeLogin={computeLogin}
            routeParams={routeParams}
          >
            {children}
          </AuthenticationFilterPresentation>
        )
      }}
    </AuthenticationFilterData>
  )
}

// PROPTYPES
const { bool, node, object } = PropTypes
AuthenticationFilterContainer.propTypes = {
  // Calling components
  children: node,
  containerStyle: object,
  hideFromSections: bool,
  is403: bool,
  notAuthenticatedComponent: node,
}

export default AuthenticationFilterContainer
