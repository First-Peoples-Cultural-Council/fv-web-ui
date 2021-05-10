import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// FPCC
import NavBarPresentationMenu from './NavBarPresentationMenu'
import NavBarPresentationMobile from './NavBarPresentationMobile'
import FVToggle from 'components/FVToggle'
import SearchInput from 'components/SearchInput'

import useIcon from 'common/useIcon'

/**
 * @summary NavBarPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function NavBarPresentation({
  title,
  className,
  currentUser,
  isHome,
  isSearchPage,
  workspaceToggleValue,
  menuData,
  onClickOutside,
  onKeyPress,
  onMenuClick,
  onWorkspaceModeClick,
  openMenu,
}) {
  const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false)

  const { sitename } = useParams()

  const openCloseMobileNavbar = () => {
    setMobileNavbarOpen(!mobileNavbarOpen)
  }
  const userMenuId = 'user'

  const menus = menuData.map((menu) => (
    <NavBarPresentationMenu
      key={`NavBarMenu_${menu.title}`}
      title={menu.title}
      itemsData={menu.itemsData}
      href={menu.href}
      onMenuClick={onMenuClick}
      id={menu.id}
      openMenu={openMenu}
      onClickOutside={onClickOutside}
    />
  ))

  const fvlogo = isHome
    ? useIcon('FVLogo', 'fill-current h-10')
    : useIcon('FVShortLogo', 'text-fv-charcoal-light fill-current h-6')

  return (
    <header id="NavBar" className={`relative bg-fv-charcoal ${className}`} onKeyUp={onKeyPress}>
      <nav className="max-w-screen-2xl mx-auto px-2 lg:px-6 xl:px-16">
        <div className="flex justify-between items-center py-1  lg:space-x-10">
          <div className="flex items-center">
            <Link className="text-white flex items-center" to={'/'}>
              <span className="sr-only">FirstVoices Logo</span>
              {fvlogo}
            </Link>
            {!isHome && (
              <Link
                className="text-white flex items-center group p-1 bg-fv-charcoal rounded-md text-lg font-medium hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fv-turquoise"
                to={`/${sitename}/`}
              >
                <span className="sr-only">{title}</span>
                {useIcon('Home', 'fill-current h-12 w-8')}
                <span className="md:hidden ml-3 mr-2">{title}</span>
              </Link>
            )}
          </div>

          <div className="hidden lg:flex xl:space-x-6 ">{menus}</div>
          <div className="relative inline-flex">
            {currentUser?.username === 'Guest' || currentUser?.username === undefined ? (
              <div className="hidden lg:flex items-center">
                <a
                  href="/nuxeo/logout?requestedUrl=login.jsp"
                  className="whitespace-nowrap text-lg font-medium text-white hover:text-gray-100"
                >
                  Sign in
                </a>
                <a
                  href="/register?requestedUrl=/register"
                  className="hidden ml-4 whitespace-nowrap xl:inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-3xl  shadow-sm text-base font-medium text-white bg-fv-orange hover:bg-fv-orange-dark"
                >
                  Register
                </a>
              </div>
            ) : (
              <div
                onClick={(event) => {
                  onClickOutside(event, userMenuId)
                }}
                onMouseDown={(event) => {
                  if (openMenu === userMenuId) {
                    event.stopPropagation()
                  }
                }}
              >
                {/* User Avatar */}
                <button
                  className="max-w-xs p-3 bg-fv-orange hover:bg-fv-orange-dark text-white text-xl rounded-full h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fv-turquoise"
                  id="user-menu"
                  onClick={() => {
                    onMenuClick(userMenuId)
                  }}
                  onKeyPress={(event) => {
                    if (event.code.toLowerCase() !== 'escape') {
                      event.stopPropagation()
                      onMenuClick(userMenuId)
                    }
                  }}
                >
                  <span className="sr-only">Open user menu</span>
                  {currentUser.userInitials}
                </button>
                {/* User Menu dropdown */}
                {openMenu === userMenuId && (
                  <div className="absolute top-6 right-0 w-72 py-8 transform lg:-translate-x-0" role="menu">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <ul className="text-base text-fv-charcoal font-medium grid bg-white gap-12 p-8 md:gap-8">
                        <li className="-m-3 py-1  hover:bg-gray-100" role="menuitem">
                          <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="whitespace-nowrap -m-3 py-1 hover:bg-gray-100">
                          <label htmlFor="toggle" className="inline-block">
                            Workspace Mode
                          </label>
                          <FVToggle
                            toggled={workspaceToggleValue}
                            toggleCallback={onWorkspaceModeClick}
                            styling={'ml-6 inline-block align-middle'}
                          />
                        </li>
                        <li className="-m-3 py-1 hover:bg-gray-100" role="menuitem">
                          <a href="/nuxeo/logout">Sign out</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!isHome && !isSearchPage && (
              <div className="flex items-center">
                <SearchInput.Container minimal />
              </div>
            )}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => openCloseMobileNavbar()}
                className="bg-fv-charcoal rounded-md p-2 inline-flex items-center justify-center text-white hover:text-gray-100 focus:outline-none"
              >
                <span className="sr-only">{mobileNavbarOpen ? 'Close menu' : 'Open menu'}</span>
                {mobileNavbarOpen ? useIcon('Close', 'h-6 w-6') : useIcon('HamburgerMenu', 'h-6 w-6')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* -- Mobile Menu -- */}
      {mobileNavbarOpen ? (
        <NavBarPresentationMobile openCloseNavbar={openCloseMobileNavbar} menuData={menuData} />
      ) : null}
    </header>
  )
}
// PROPTYPES
const { array, bool, object, string, func } = PropTypes
NavBarPresentation.propTypes = {
  currentUser: object,
  isHome: bool,
  menuData: array,
  title: string,
  className: string,
  workspaceToggleValue: bool,
  onWorkspaceModeClick: func,
  onMenuClick: func,
  onKeyPress: func,
  onClickOutside: func,
  openMenu: string,
}
NavBarPresentation.defaultProps = {
  title: '/',
  workspaceToggleValue: false,
  onWorkspaceModeClick: () => {},
  onMenuClick: () => {},
  onKeyPress: () => {},
  onClickOutside: () => {},
}

export default NavBarPresentation
