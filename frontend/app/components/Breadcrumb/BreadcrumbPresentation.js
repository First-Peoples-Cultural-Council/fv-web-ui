import React from 'react'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'

import '!style-loader!css-loader!./Breadcrumb.css'

/**
 * @summary BreadcrumbPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function BreadcrumbPresentation({ breadcrumbs, isDialect, portalLogoSrc }) {
  return isDialect ? (
    <div className="row Breadcrumb__container">
      <div className="Breadcrumb__link">
        <Avatar src={portalLogoSrc} size={50} />
        <ul className="Breadcrumb breadcrumb fontBCSans">{breadcrumbs}</ul>
      </div>
    </div>
  ) : null
}

// PROPTYPES
const { array, bool, string } = PropTypes
BreadcrumbPresentation.propTypes = {
  breadcrumbs: array,
  isDialect: bool,
  portalLogoSrc: string,
}

export default BreadcrumbPresentation
