import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary DialectHeaderMobile
 * @component
 *
 * @param {object} props
 * @param {array} menu an array header objects and sub menu content { title: '', itemsData: [], href: ''}
 *
 * @returns {node} jsx markup
 */
function DialectHeaderMobile({ menuData }) {
  const [selectedMenu, setSelectedMenu] = useState(null)

  const onMenuClick = (menuObject) => {
    if (menuObject.href) {
      window.location.href = menuObject.href
    } else if (Array.isArray(menuObject.itemsData) || menuObject.itemsData.length) {
      setSelectedMenu(menuObject)
    }
  }

  function getMenuItems(items) {
    return items.map((item) => (
      <li key={`${item.title}_id`}>
        <button
          type="button"
          onClick={() => onMenuClick(item)}
          className="w-full m-3 p-1 text-fv-blue flex items-center hover:bg-gray-50 focus:outline-none focus:ring-0"
        >
          {useIcon(item.title, 'fill-current h-12 w-8')}
          <p className="ml-3 text-fv-blue font-medium hover:text-fv-blue-dark">{item.title}</p>
          {!Array.isArray(item.itemsData) || !item.itemsData.length
            ? null
            : useIcon('ChevronRight', 'absolute right-3 fill-current w-10')}
        </button>
      </li>
    ))
  }

  return (
    <nav className="inset-x-0 transition transform origin-top-right md:hidden ">
      <div className="shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-200">
        {selectedMenu === null ? (
          <ul className="grid grid-rows-3 divide-y-2 divide-gray-200">
            {getMenuItems(menuData)}
            <li key="SignIn_id">
              <button
                href="/nuxeo/logout?requestedUrl=login.jsp"
                type="button"
                className="w-full m-3 p-1 text-fv-blue flex items-center hover:bg-gray-50 focus:outline-none"
              >
                {useIcon('Login', 'fill-current h-12 w-8')}
                <p className="ml-3 text-fv-blue font-medium hover:text-fv-blue-dark">Sign in</p>
              </button>
            </li>
            <li key="Register_id" className="py-5 px-5 space-y-6 w-full flex items-center">
              <a
                href="/register?requestedUrl=/register"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-3xl  shadow-sm text-base font-medium text-white bg-fv-orange hover:bg-fv-orange-dark"
              >
                Register
              </a>
            </li>
          </ul>
        ) : (
          <ul className="grid grid-rows-3 divide-y-2 divide-gray-200">
            {getMenuItems(selectedMenu.itemsData)}
            <li key="BackButton_id">
              <button
                type="button"
                onClick={() => setSelectedMenu(null)}
                className="w-full m-3 p-1 text-fv-blue flex items-center hover:bg-gray-50 focus:outline-none"
              >
                {useIcon('ChevronLeft', 'fill-current h-12 w-8')}
                <p className="ml-3 text-fv-blue font-medium hover:text-fv-blue-dark">Back</p>
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
// PROPTYPES
const { array } = PropTypes
DialectHeaderMobile.propTypes = {
  menuData: array,
}

export default DialectHeaderMobile
