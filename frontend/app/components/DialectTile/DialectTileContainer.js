import React from 'react'
import PropTypes from 'prop-types'

import DialectTilePresentation from 'components/DialectTile/DialectTilePresentation'
import DialectTileData from 'components/DialectTile/DialectTileData'

/**
 * @summary DialectTileContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectTileContainer({
  actionIcon,
  dialectGroups,
  dialectId,
  dialectLogo,
  dialectTitle,
  isWorkspaces,
  joinText,
  href,
}) {
  return (
    <DialectTileData
      dialectGroups={dialectGroups}
      dialectId={dialectId}
      dialectTitle={dialectTitle}
      isWorkspaces={isWorkspaces}
      href={href}
    >
      {({ isLoggedIn, isPrivate, hrefToUse, onDialectClick, isDialogOpen, handleDialogCancel, handleDialogOk }) => {
        return (
          <DialectTilePresentation
            actionIcon={actionIcon}
            dialectLogo={dialectLogo}
            dialectTitle={dialectTitle}
            href={hrefToUse}
            isLoggedIn={isLoggedIn}
            isPrivate={isPrivate}
            onDialectClick={onDialectClick}
            handleDialogCancel={handleDialogCancel}
            handleDialogOk={handleDialogOk}
            isDialogOpen={isDialogOpen}
            joinText={joinText}
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
  dialectId: string.isRequired,
  dialectLogo: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  joinText: string.isRequired,
  href: string.isRequired,
  isWorkspaces: bool.isRequired,
}

export default DialectTileContainer
