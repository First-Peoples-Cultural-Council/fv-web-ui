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
    isHome,
    isSearchPage,
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
      currentUser={currentUser}
      isHome={isHome}
      isSearchPage={isSearchPage}
      menuData={menuData}
      onClickOutside={onClickOutside}
      onKeyPress={onKeyPress}
      onMenuClick={onMenuClick}
      onWorkspaceModeClick={onWorkspaceModeClick}
      openMenu={openMenu}
      title={title}
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
