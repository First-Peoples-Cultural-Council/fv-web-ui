import React from 'react'
import PropTypes from 'prop-types'

import DialectTilePresentation from 'components/DialectTile/DialectTilePresentation'
import DialectTileData from 'components/DialectTile/DialectTileData'

/**
 * @summary DialectTileContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectTileContainer({ dialectGroups, dialectLogo, dialectTitle, actionIcon, isWorkspaces, href }) {
  return (
    <DialectTileData dialectGroups={dialectGroups} dialectTitle={dialectTitle} isWorkspaces={isWorkspaces} href={href}>
      {({ isLoggedIn, isPrivate, hrefToUse, onDialectClick }) => {
        return (
          <DialectTilePresentation
            actionIcon={actionIcon}
            dialectLogo={dialectLogo}
            dialectTitle={dialectTitle}
            href={hrefToUse}
            isLoggedIn={isLoggedIn}
            isPrivate={isPrivate}
            onDialectClick={onDialectClick}
          />
        )
      }}
    </DialectTileData>
  )
}
// PROPTYPES
const { array, bool, object, string } = PropTypes
DialectTileContainer.propTypes = {
  dialectGroups: array.isRequired,
  dialectLogo: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  href: string.isRequired,
  isWorkspaces: bool.isRequired,
}

export default DialectTileContainer
