import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavigationHelpers from 'common/NavigationHelpers'
import PortalListDialects from 'components/PortalListDialects'
import FVLabel from 'components/FVLabel'
/**
 * @summary ExploreLanguagesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ExploreLanguagesPresentation({ isKids, isLoggedIn, isWorkspaces, portalListProps }) {
  return (
    <div className="ExploreLanguages">
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className={classNames({ hidden: isKids })}>
              <h1>
                <FVLabel transKey="general.explore" defaultStr="Explore Languages" transform="title" />
              </h1>
            </div>
            {isLoggedIn && isWorkspaces && <p>You are a member of the following language sites:</p>}
            <PortalListDialects {...portalListProps} />
            {isWorkspaces && (
              <a style={{ marginTop: '20px' }} href={NavigationHelpers.generateStaticURL('/explore/FV/sections/Data')}>
                Click here to view all publicly available language sites.
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { bool, object } = PropTypes
ExploreLanguagesPresentation.propTypes = {
  isKids: bool,
  isLoggedIn: bool,
  isWorkspaces: bool,
  portalListProps: object,
}

export default ExploreLanguagesPresentation
