import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DialectHeaderPresentationMenu from './DialectHeaderPresentationMenu'
import DialectHeaderPresentationMobile from './DialectHeaderPresentationMobile'
import FVToggle from 'components/FVToggle'

import useIcon from 'common/useIcon'

/**
 * @summary DialectHeaderPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectHeaderPresentation({ currentUser, menuData }) {
  const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false)
  const [workspaceMode, setWorkspaceMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const openCloseMobileNavbar = () => {
    setMobileNavbarOpen(!mobileNavbarOpen)
  }

  const onWorkspaceModeClick = () => {
    setWorkspaceMode(!workspaceMode)
  }

  // Logic to close menu on click away
  const userMenu = useRef()
  const handleClickOutside = (event) => {
    if (userMenu.current.contains(event.target)) {
      // inside click
      return
    }
    // outside click
    setIsUserMenuOpen(false)
  }
  useEffect(() => {
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const menus = menuData.map((menu) => (
    <DialectHeaderPresentationMenu
      key={`DialectHeaderMenu_${menu.title}`}
      title={menu.title}
      itemsData={menu.itemsData}
      href={menu.href ? menu.href : null}
    />
  ))

  return (
    <header id="Dialect_header" className="relative bg-fv-charcoal">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 xl:px-20">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="justify-start lg:w-0 lg:flex-1">
            <a href="/home">
              <span className="sr-only">FirstVoices Logo</span>
              {useIcon('Logo', 'fill-current text-white h-10')}
            </a>
          </div>

          <div className="hidden md:flex space-x-6">{menus}</div>
          {!currentUser ? (
            <div className="ml-8 hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <a
                href="/nuxeo/logout?requestedUrl=login.jsp"
                className="whitespace-nowrap text-lg font-medium text-white hover:text-gray-100"
              >
                Sign in
              </a>
              <a
                href="/register?requestedUrl=/register"
                className="ml-4 whitespace-nowrap inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-3xl  shadow-sm text-base font-medium text-white bg-fv-orange hover:bg-fv-orange-dark"
              >
                Register
              </a>
            </div>
          ) : (
            <div ref={userMenu} className="relative ml-8 flex justify-end flex-1 lg:w-0">
              {/* User Avatar */}
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="max-w-xs p-3 bg-fv-orange hover:bg-fv-orange-dark text-white text-xl rounded-full h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                >
                  <span className="sr-only">Open user menu</span>
                  {currentUser.userInitials}
                </button>
              </div>
              {/* User Menu dropdown */}
              {isUserMenuOpen ? (
                <div className="absolute mt-8 w-72 py-8 transform lg:-translate-x-0" role="menu">
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <ul className="text-base text-fv-charcoal font-medium grid bg-white gap-12 p-8 md:gap-8">
                      <li className="-m-3 py-1  hover:bg-gray-100" role="menuitem">
                        <a href="/dashboard">Dashboard</a>
                      </li>
                      <li className="whitespace-nowrap -m-3 py-1 hover:bg-gray-100">
                        <label htmlFor="toggle" className="inline-block">
                          Workspace Mode
                        </label>
                        <FVToggle
                          toggled={workspaceMode}
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
              ) : null}
            </div>
          )}
          <div className="-mr-2 -my-2 md:hidden">
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
      </nav>
      {/* -- Mobile Menu -- */}
      {mobileNavbarOpen ? (
        <DialectHeaderPresentationMobile openCloseNavbar={openCloseMobileNavbar} menuData={menuData} />
      ) : null}
    </header>
  )
}
// PROPTYPES
const { array, object } = PropTypes
DialectHeaderPresentation.propTypes = {
  currentUser: object,
  menuData: array,
}

export default DialectHeaderPresentation
