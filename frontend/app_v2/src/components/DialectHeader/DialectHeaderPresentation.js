import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import DialectHeaderMenu from './DialectHeaderMenu'
import DialectHeaderMobile from './DialectHeaderMobile'
import FVToggle from 'components/FVToggle'

import Logo from 'components/icons/Logo'
import AboutIcon from 'components/icons/AboutIcon'
import DictionaryIcon from 'components/icons/DictionaryIcon'
import KidsIcon from 'components/icons/KidsIcon'
import LearnIcon from 'components/icons/LearnIcon'
import ResourcesIcon from 'components/icons/ResourcesIcon'

/**
 * @summary DialectHeaderPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectHeaderPresentation({ currentUser }) {
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

  // Hardcoding menu data temporarily
  // TODO: Store menu data on dialect
  const menuData = [
    {
      title: 'Dictionary',
      icon: <DictionaryIcon styling={'fill-current h-12 w-8'} />,
      itemsData: [
        { title: 'Words', href: '/dialect/words' },
        { title: 'Phrases', href: '/dialect/phrases' },
        { title: 'Alphabet', href: '/dialect/alphabet' },
        { title: 'Browse by Topic', href: '/dialect/topics' },
      ],
    },
    {
      title: 'Learn',
      icon: <LearnIcon styling={'fill-current h-12 w-8'} />,
      itemsData: [
        { title: 'Songs', href: '/dialect/songs' },
        { title: 'Stories', href: '/dialect/stories' },
        { title: 'Games', href: '/dialect/games' },
      ],
    },
    {
      title: 'Resources',
      icon: <ResourcesIcon styling={'fill-current h-12 w-8'} />,
      itemsData: [
        { title: 'Kids Site', href: '/dialect/kids' },
        { title: 'Mobile App', href: '/dialect/app' },
        { title: 'Keyboard App', href: '/dialect/keyboard' },
      ],
    },
    {
      title: 'About',
      icon: <AboutIcon styling={'fill-current h-12 w-8'} />,
      itemsData: [
        { title: 'Our Language', href: '/dialect/ourlanguage' },
        { title: 'Our People', href: '/dialect/ourpeople' },
      ],
    },
    { title: 'Kids', icon: <KidsIcon styling={'fill-current h-12 w-8'} />, href: '/dialect/kids' },
  ]

  const menus = menuData.map((menu) => (
    <DialectHeaderMenu
      key={`DialectHeaderMenu_${menu.title}`}
      title={menu.title}
      icon={menu.icon}
      itemsData={menu.itemsData}
      href={menu.href ? menu.href : null}
    />
  ))

  return (
    <div id="Dialect_header" className="relative bg-fv-charcoal">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 xl:px-20">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="justify-start lg:w-0 lg:flex-1">
            <a href="/home">
              <span className="sr-only">FirstVoices Logo</span>
              <Logo styling={'fill-current text-white h-10'} />
            </a>
          </div>

          <div className="hidden md:flex space-x-6">{menus}</div>
          {/* <form name="searchForm" id="searchForm" action="/explore/FV/sections/Data/search">
                  <div className="">
                    <div className="">
                      <input
                        name="query"
                        placeholder="Search:"
                        type="search"
                      />
                      <input value="&#x1F50E;" type="submit" tabIndex="0" />
                    </div>
                  </div>
                </form> */}
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
                  className="max-w-xs p-3 bg-fv-orange  text-white text-xl rounded-full h-12 w-12 flex items-center justify-center focus:outline-none"
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
                    <div className="text-base text-fv-charcoal font-medium grid bg-white gap-12 p-8 md:gap-8">
                      <a href="/dashboard" className="-m-3 py-1  hover:bg-gray-100" role="menuitem">
                        Dashboard
                      </a>
                      <div className="whitespace-nowrap -m-3 py-1 hover:bg-gray-100">
                        <label htmlFor="toggle" className="inline-block">
                          Workspace Mode
                        </label>
                        <FVToggle
                          toggled={workspaceMode}
                          toggleCallback={onWorkspaceModeClick}
                          styling={'ml-6 inline-block align-middle'}
                        />
                      </div>
                      <a href="/nuxeo/logout" className="-m-3 py-1 hover:bg-gray-100" role="menuitem">
                        Sign out
                      </a>
                    </div>
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
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileNavbarOpen ? (
                  // X icon
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger menu icon
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* -- Mobile Menu -- */}
      {mobileNavbarOpen ? <DialectHeaderMobile openCloseNavbar={openCloseMobileNavbar} menuData={menuData} /> : null}
      <header className="bg-white shadow">
        <div className="max-w-screen-2xl py-6 px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
          <h1 className="text-lg leading-tight text-gray-900">Breadcrumbs</h1>
        </div>
      </header>
    </div>
  )
}
// PROPTYPES
const { object } = PropTypes
DialectHeaderPresentation.propTypes = {
  currentUser: object,
}

export default DialectHeaderPresentation
