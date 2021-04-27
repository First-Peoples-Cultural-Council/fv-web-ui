import React from 'react'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary SearchPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchInputPresentation({
  currentOption,
  handleSearchSubmit,
  handleTextFieldChange,
  isMenuOpen,
  menuRef,
  onSearchOptionsClick,
  onOptionClick,
  options,
  searchValue,
  siteTitle,
}) {
  const getFilterListItems = () => {
    return options.map((option, index) => {
      return (
        <li
          className={`${
            currentOption.id === option.id ? 'font-semibold' : ''
          }font-normal block truncate text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:text-white hover:bg-fv-blue`}
          key={`filterlist-key-${index}`}
          id={`filterlist-option-${option.id}`}
          role="option"
          onClick={() => onOptionClick(option)}
        >
          {option.label}
          {currentOption.id === option.id ? (
            <span className=" absolute inset-y-0 right-0 flex items-center pr-4">
              {useIcon('Checkmark', 'h-5 w-5 fill-current ')}
            </span>
          ) : null}
        </li>
      )
    })
  }

  return (
    <>
      <div className="mt-1 flex rounded-md">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <input
            data-testid="SearchInput"
            className="block w-full focus text-2xl text-fv-charcoal-light rounded-none rounded-l-md pl-5"
            type="text"
            placeholder={`Search ${siteTitle}`}
            onChange={handleTextFieldChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(e)
              }
            }}
            value={searchValue}
          />
        </div>
        <div className="-ml-px relative inline-flex items-center px-2 py-2 border-l-2 text-fv-charcoal-light border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 hover:bg-gray-100">
          <label htmlFor="search-options" className="sr-only">
            Search options
          </label>
          <button
            type="button"
            onClick={onSearchOptionsClick}
            className="relative rounded-md pl-3 pr-16 py-2 mr-1 border-fv-blue text-left cursor-default sm:text-sm"
            aria-haspopup="listbox"
          >
            {currentOption.label}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {useIcon('UnfoldMore', 'h-5 w-5')}
            </span>
          </button>
          {isMenuOpen ? (
            <ul
              className="transition-opacity ease-in duration-100 absolute mt-1.5 py-1 w-full bg-white shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              tabIndex={-1}
              role="listbox"
              ref={menuRef}
            >
              {getFilterListItems()}
            </ul>
          ) : null}

          <button type="button" onClick={handleSearchSubmit}>
            {useIcon('Search', 'fill-current h-8 w-8 ')}
          </button>
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
SearchInputPresentation.propTypes = {
  currentOption: object,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  isMenuOpen: bool,
  menuRef: object,
  onSearchOptionsClick: func,
  onOptionClick: func,
  options: array,
  searchValue: string,
  siteTitle: string,
}

export default SearchInputPresentation
