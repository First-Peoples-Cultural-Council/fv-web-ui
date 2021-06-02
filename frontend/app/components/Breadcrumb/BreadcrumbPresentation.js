import React from 'react'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import FVButton from 'components/FVButton'
import WorkspaceSwitcher from 'components/WorkspaceSwitcher'
import './Breadcrumb.css'

/**
 * @summary BreadcrumbPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function BreadcrumbPresentation({ breadcrumbs, dialect, showJoin, portalLogoSrc, showWorkspaceSwitcher, area }) {
  return dialect ? (
    <>
      <div className="row Breadcrumb__container">
        <div className="Breadcrumb__link">
          <Avatar src={portalLogoSrc} size={50} />
          <ul className="Breadcrumb breadcrumb fontBCSans">{breadcrumbs}</ul>
        </div>
      </div>
      {showJoin && (
        <FVButton
          variant="contained"
          color="primary"
          onClick={() =>
            (window.location.href = `/join?requestedSite=${
              dialect?.versionableId ? dialect?.versionableId : dialect?.uid
            }`)
          }
          style={{ margin: '10px', float: 'right' }}
        >
          Request to join {dialect.title}
        </FVButton>
      )}
      {showWorkspaceSwitcher && !showJoin && (
        <WorkspaceSwitcher className="AppFrontController__workspaceSwitcher" area={area} />
      )}
    </>
  ) : null
}

// PROPTYPES
const { array, bool, object, string } = PropTypes
BreadcrumbPresentation.propTypes = {
  breadcrumbs: array,
  dialect: object,
  showJoin: bool,
  portalLogoSrc: string,
  showWorkspaceSwitcher: bool,
  area: string,
}

export default BreadcrumbPresentation
