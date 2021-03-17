import React from 'react'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'
import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'

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
  error,
  filters,
  handleFilter,
  handleSearchSubmit,
  handleTextFieldChange,
  isLoading,
  items,
  newSearchValue,
  searchTerm,
  actions,
}) {
  const filterListItems = filters.map((filter) => {
    const filterIsActiveClass =
      currentFilter === filter.type ? 'border-l-4 border-fv-turquoise bg-fv-turquoise text-white' : 'text-fv-charcoal'
    return (
      <li
        key={filter.label}
        id={'SearchFilter' + filter.label}
        className={`inline-block md:block m-1 md:m-5 p-2  flex-grow rounded-xl ${filterIsActiveClass}`}
        onClick={() => {
          handleFilter(filter.type)
        }}
      >
        {filter.label}
      </li>
    )
  })
  return (
    <>
      <section className="bg-gradient-to-b to-fv-turquoise from-fv-blue-light p-5">
        <div className="bg-white flex rounded-2xl w-3/5 text-fv-charcoal-light p-2 divide-x-2 divide-gray-300 mx-auto">
          <input
            data-testid="SearchInput"
            className="w-full focus text-2xl px-4 py-2 "
            type="text"
            placeholder={`Search ${sitename}`}
            onChange={handleTextFieldChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(e)
              }
            }}
            value={newSearchValue}
          />
          <button type="button " onClick={handleSearchSubmit} className="p-2">
            {useIcon('Search', 'fill-current h-8 w-8 ')}
          </button>
        </div>
      </section>
      <div className="grid grid-cols-7 md:divide-x-2 divide-gray-300">
        <div className="min-h-220 col-span-7 md:col-start-2 md:col-span-6">
          <h1 className="text-2xl md:text-3xl text-medium ml-8 my-2 md:m-5">
            <em>{searchTerm}</em> search results from {sitename}
          </h1>
        </div>
        <div className="col-span-7 md:col-span-1 mt-2">
          <h2 className="hidden md:block text-2xl ml-8">Filters</h2>
          <ul className="inline-block md:block list-none mx-5 mb-2 md:m-0 md:space-y-4 ">{filterListItems}</ul>
        </div>
        <div className="min-h-220 col-span-7 md:col-span-6">
          <DictionaryListPresentation items={items} actions={actions} isLoading={isLoading} error={error} />
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
SearchPresentation.propTypes = {
  actions: array,
  currentFilter: string,
  error: object,
  filters: array,
  handleFilter: func,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  isLoading: bool,
  items: array,
  newSearchValue: string,
  searchTerm: string,
  sitename: string,
}

export default SearchPresentation
