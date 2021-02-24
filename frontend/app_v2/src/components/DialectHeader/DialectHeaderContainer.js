import React from 'react'
import PropTypes from 'prop-types'
import DialectHeaderPresentation from 'components/DialectHeader/DialectHeaderPresentation'
import DialectHeaderData from 'components/DialectHeader/DialectHeaderData'

/**
 * @summary DialectHeaderContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectHeaderContainer({ className }) {
  const { currentUser, menuData, title, onWorkspaceModeClick, onMenuClick, openMenu, onKeyPress, onClickOutside } = DialectHeaderData()
  return (
    <DialectHeaderPresentation
      className={className}
      onWorkspaceModeClick={onWorkspaceModeClick}
      title={title}
      currentUser={currentUser}
      menuData={menuData}
      onMenuClick={onMenuClick}
      openMenu={openMenu}
      onKeyPress={onKeyPress}
      onClickOutside={onClickOutside}
    />
  )
}
// PROPTYPES
const { string } = PropTypes
DialectHeaderContainer.propTypes = {
  className: string,
}

export default DialectHeaderContainer
