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
function BreadcrumbContainer({ matchedPage, routes, routeParams, findReplace }) {
  return (
    <BreadcrumbData matchedPage={matchedPage} routes={routes} routeParams={routeParams} findReplace={findReplace}>
      {({ breadcrumbs, isDialect, portalLogoSrc }) => {
        return <BreadcrumbPresentation breadcrumbs={breadcrumbs} isDialect={isDialect} portalLogoSrc={portalLogoSrc} />
      }}
    </BreadcrumbData>
  )
}
// PROPTYPES
const { object } = PropTypes
BreadcrumbContainer.propTypes = {
  matchedPage: object,
  routes: object.isRequired,
  routeParams: object.isRequired,
  findReplace: object,
}

export default BreadcrumbContainer
