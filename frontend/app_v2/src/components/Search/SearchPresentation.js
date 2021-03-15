import React from 'react'
import PropTypes from 'prop-types'

import DictionaryListPresentation from 'components/Search/DictionaryListPresentation'

/**
 * @summary SearchPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchPresentation({
  currentFilter,
  sitename,
  filters,
  handleFilter,
  handleSearchSubmit,
  handleTextFieldChange,
  hasItems,
  isSite,
  items,
  newSearchValue,
  searchTerm,
  tools,
}) {
  const filterListItems = filters.map((filter) => {
    const filterIsActiveClass =
      currentFilter == filter.type ? 'border-l-4 border-fv-turquoise bg-green-100 text-fv-turquoise' : ''
    return (
      <li
        key={filter.type}
        id={'SearchFilter' + filter.label}
        className={`p-5 flex-grow ${filterIsActiveClass}`}
        onClick={() => {
          handleFilter(filter.type)
        }}
      >
        {filter.label}
      </li>
    )
  })
  return (
    <div className="mx-10 my-5 grid grid-cols-6">
      <div className="col-span-6 sm:col-span-1">
        <h2 className="text-2xl">Filters</h2>
        <ul className="text-lg list-none">{filterListItems}</ul>
      </div>

      <div className="min-h-220 col-span-6 sm:col-span-5 ml-5">
        <h1 className="text-3xl text-medium">
          <em>{searchTerm}</em> search results from {isSite ? sitename : 'FirstVoices'}
        </h1>
        <div className="mb-5">
          <div className="flex mb-5">
            <input
              data-testid="SearchInput"
              className="m-2 border-gray-500 min-w-230 p-2"
              type="text"
              onChange={handleTextFieldChange}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSearchSubmit(e)
                }
              }}
              value={newSearchValue}
            />
            <button
              variant="contained"
              onClick={handleSearchSubmit}
              className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 border border-transparent rounded-3xl  shadow-sm text-base font-medium text-white bg-fv-turquoise hover:bg-fv-turquoise-dark"
            >
              Search
            </button>
          </div>
        </div>
        {hasItems === true && <DictionaryListPresentation items={items} tools={tools} />}
        {hasItems === false && <div className="m-10">Sorry, no results were found for this search.</div>}
      </div>
    </div>
  )
}
// PROPTYPES
const { array, bool, func, string } = PropTypes
SearchPresentation.propTypes = {
  currentFilter: string,
  sitename: string,
  filters: array,
  handleFilter: func,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  hasItems: bool,
  isSite: bool,
  items: array,
  newSearchValue: string,
  searchTerm: string,
  tools: array,
}

export default SearchPresentation
