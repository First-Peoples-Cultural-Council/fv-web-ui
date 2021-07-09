import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Transition } from '@headlessui/react'

//FPCC
import useIcon from 'common/useIcon'

/**
 * @summary DictionarySearchInputPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionarySearchInputPresentation({
  currentOption,
  handleSearchSubmit,
  handleTextFieldChange,
  onOptionClick,
  options,
  resetSearch,
  searchValue,
  siteTitle,
  typePlural,
}) {
  const getFilterListItems = () => {
    return options.map((option, index) => {
      return (
        <Menu.Item key={`filterlist-key-${index}`}>
          {({ active }) => (
            <button
              onClick={() => onOptionClick(option)}
              className={`${
                active ? 'bg-primary text-white' : 'text-fv-charcoal'
              } font-medium group flex rounded-md items-center w-full px-2 py-2 text-sm`}
            >
              {option.label}
              {currentOption.id === option.id ? useIcon('Checkmark', 'h-5 w-5 fill-current ml-2') : ''}
            </button>
          )}
        </Menu.Item>
      )
    })
  }

  return (
    <>
      <div className="flex rounded-lg">
        <form onSubmit={handleSearchSubmit} className="flex items-stretch flex-grow">
          <input
            data-testid="DictionarySearchInput"
            className="block w-full focus text-2xl text-fv-charcoal-light rounded-none rounded-l-md pl-4"
            type="text"
            placeholder={`Search ${typePlural} in ${siteTitle}`}
            onChange={handleTextFieldChange}
            value={searchValue}
          />
        </form>
        <div className="relative inline-flex items-center px-2 py-1.5 text-fv-charcoal-light border-l-2 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100">
          <label htmlFor="search-options" className="sr-only">
            Search options
          </label>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {currentOption.label}
                {useIcon('ChevronDown', 'w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100')}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">{getFilterListItems()}</div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button type="button" onClick={handleSearchSubmit}>
            {useIcon('Search', 'fill-current h-7 w-7 ')}
          </button>
        </div>
        {searchValue && (
          <button
            type="button"
            className="inline-flex items-center ml-4 my-1 px-2 text-fv-charcoal-light border-gray-300 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={(event) => resetSearch(event)}
          >
            Reset Search
          </button>
        )}
      </div>
    </>
  )
}
// PROPTYPES
const { array, func, object, string } = PropTypes
DictionarySearchInputPresentation.propTypes = {
  currentOption: object,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  onOptionClick: func,
  options: array,
  searchValue: string,
  siteTitle: string,
}

export default DictionarySearchInputPresentation
