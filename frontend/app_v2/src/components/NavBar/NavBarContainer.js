import React from 'react'
import PropTypes from 'prop-types'
import NavBarPresentation from 'components/NavBar/NavBarPresentation'
import NavBarData from 'components/NavBar/NavBarData'

/**
 * @summary NavBarContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function NavBarContainer({ className }) {
  const {
    currentUser,
    logoUrl,
    menuData,
    title,
    onWorkspaceModeClick,
    onMenuClick,
    openMenu,
    onKeyPress,
    onClickOutside,
    workspaceToggleValue,
  } = NavBarData()
  return (
    <NavBarPresentation
      className={className}
      onWorkspaceModeClick={onWorkspaceModeClick}
      title={title}
      currentUser={currentUser}
      logoUrl={logoUrl}
      menuData={menuData}
      onMenuClick={onMenuClick}
      openMenu={openMenu}
      onKeyPress={onKeyPress}
      onClickOutside={onClickOutside}
      workspaceToggleValue={workspaceToggleValue}
    />
  )
}
// PROPTYPES
const { string } = PropTypes
NavBarContainer.propTypes = {
  className: string,
}

export default NavBarContainer
