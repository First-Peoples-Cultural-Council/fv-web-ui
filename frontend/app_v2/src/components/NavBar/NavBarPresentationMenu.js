import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary NavBarPresentationMenu
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function NavBarPresentationMenu({ id, title, itemsData, href, onMenuClick, openMenu, onClickOutside }) {
  const hasItems = !Array.isArray(itemsData) || !itemsData.length ? false : true

  const menuItems = itemsData
    ? itemsData.map((menuItem) => (
        <li key={`HeaderMenu_${menuItem.title}`}>
          <Link to={menuItem.href} className="-m-3 py-1 flex items-start rounded-lg hover:bg-gray-50">
            <div className="ml-4">
              <p className="text-lg font-medium text-black">{menuItem.title}</p>
            </div>
          </Link>
        </li>
      ))
    : null

  return (
    <div
      id={`HeaderMenu_${title}`}
      className="relative"
      onClick={(event) => {
        onClickOutside(event, id)
      }}
      onMouseDown={(event) => {
        if (openMenu === id) {
          event.stopPropagation()
        }
      }}
    >
      {hasItems && (
        <button
          type="button"
          onClick={() => {
            onMenuClick(id)
          }}
          onKeyPress={(event) => {
            if (event.code.toLowerCase() !== 'escape') {
              event.stopPropagation()
              onMenuClick(id)
            }
          }}
          className="group p-1 bg-fv-charcoal rounded-md  inline-flex items-center text-lg font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fv-turquoise"
        >
          {useIcon(title, 'fill-current h-12 w-8')}
          <p className="ml-3 mr-2">{title}</p>
          {useIcon('ChevronDown', 'fill-current h-8')}
        </button>
      )}
      {hasItems === false && (
        <Link
          to={href}
          className="group p-1 bg-fv-charcoal rounded-md  inline-flex items-center text-lg font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fv-turquoise"
        >
          {useIcon(title, 'fill-current h-12 w-8')}
          <p className="ml-3 mr-2">{title}</p>
        </Link>
      )}
      {openMenu === id ? (
        <div className="absolute z-10 mt-3 w-48 transform px-2 sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <ul className="relative grid gap-6 bg-white px-2 py-6 sm:gap-8 sm:p-8">{menuItems}</ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// PROPTYPES
const { array, string, func } = PropTypes
NavBarPresentationMenu.propTypes = {
  title: string,
  href: string,
  itemsData: array,
  onMenuClick: func,
  id: string,
  openMenu: string,
  onClickOutside: func,
}
NavBarPresentationMenu.defaultProps = {
  onMenuClick: () => {},
  onClickOutside: () => {},
}

export default NavBarPresentationMenu
