import React from 'react'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import FVButton from 'components/FVButton'
import WorkspaceSwitcher from 'components/WorkspaceSwitcher'
import './Breadcrumb.css'

/**
 * @summary BreadcrumbPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function BreadcrumbPresentation({
  breadcrumbs,
  dialect,
  showJoin,
  membershipStatus,
  portalLogoSrc,
  showWorkspaceSwitcher,
  area,
}) {
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
          disabled={membershipStatus === 'pending'}
          onClick={() =>
            (window.location.href = `/join?requestedSite=${
              dialect?.versionableId ? dialect?.versionableId : dialect?.uid
            }`)
          }
          style={{ margin: '10px', float: 'right' }}
        >
          {membershipStatus === 'pending' ? 'Request submitted' : `Request to join ${dialect.title}`}
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
  membershipStatus: string,
  portalLogoSrc: string,
  showJoin: bool,
  showWorkspaceSwitcher: bool,
  area: string,
}

export default BreadcrumbPresentation
