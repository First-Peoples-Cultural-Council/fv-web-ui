import React from 'react'
import PropTypes from 'prop-types'
import BreadcrumbPresentation from 'components/Breadcrumb/BreadcrumbPresentation'
import BreadcrumbData from 'components/Breadcrumb/BreadcrumbData'

/**
 * @summary BreadcrumbContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function BreadcrumbContainer({ matchedPage, routes, showWorkspaceSwitcher, area }) {
  return (
    <BreadcrumbData matchedPage={matchedPage} routes={routes}>
      {({ breadcrumbs, dialect, showJoin, portalLogoSrc, membershipStatus }) => {
        return (
          <BreadcrumbPresentation
            breadcrumbs={breadcrumbs}
            dialect={dialect}
            showJoin={showJoin}
            membershipStatus={membershipStatus}
            portalLogoSrc={portalLogoSrc}
            showWorkspaceSwitcher={showWorkspaceSwitcher}
            area={area}
          />
        )
      }}
    </BreadcrumbData>
  )
}
// PROPTYPES
const { bool, object, string } = PropTypes
BreadcrumbContainer.propTypes = {
  matchedPage: object,
  routes: object.isRequired,
  showWorkspaceSwitcher: bool,
  area: string,
}

export default BreadcrumbContainer
