import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary DialectHeaderMenu
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectHeaderMenu({ title, itemsData, href }) {
  const [isOpen, setIsOpen] = useState(false)
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

  const onMenuClick = () => {
    if (href) {
      window.location.href = href
    } else if (hasItems) {
      setIsOpen(!isOpen)
    }
  }

  // Logic to close menu on click away
  const dialectHeaderMenu = useRef()
  const handleClickOutside = (event) => {
    if (dialectHeaderMenu.current.contains(event.target)) {
      // inside click
      return
    }
    // outside click
    setIsOpen(false)
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Logic to close menu on location change
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <div id={`HeaderMenu_${title}`} ref={dialectHeaderMenu} className="relative">
      <button
        type="button"
        onClick={() => onMenuClick()}
        className="group p-2 bg-fv-charcoal rounded-md  inline-flex items-center text-lg font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fv-turquoise"
      >
        {useIcon(title, 'fill-current h-12 w-8')}
        <p className="ml-3 mr-2">{title}</p>
        {hasItems ? useIcon('ChevronDown', 'fill-current h-8') : null}
      </button>
      {isOpen && hasItems ? (
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
const { array, string } = PropTypes
DialectHeaderMenu.propTypes = {
  title: string,
  href: string,
  itemsData: array,
}

export default DialectHeaderMenu
