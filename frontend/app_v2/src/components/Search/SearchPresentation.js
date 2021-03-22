import React from 'react'
import PropTypes from 'prop-types'

import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'
import SearchInput from 'components/SearchInput'

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
  siteTitle,
  error,
  filters,
  handleFilter,
  isLoading,
  items,
  searchTerm,
  actions,
}) {
  const wholeDomain = siteTitle === 'FirstVoices'

  const getFilterListItems = () => {
    return filters.map((filter) => {
      const filterIsActiveClass =
        currentFilter === filter.type ? 'border-l-4 border-fv-turquoise bg-fv-turquoise text-white' : 'text-fv-charcoal'
      return (
        <li
          key={filter.label}
          id={'SearchFilter' + filter.label}
          className={`inline-block md:block md:m-5 p-2 flex-grow rounded-xl ${filterIsActiveClass}`}
          onClick={() => {
            handleFilter(filter.type)
          }}
        >
          {filter.label} {filter.count ? `(${filter.count})` : null}
        </li>
      )
    })
  }

  return (
    <>
      <section className="bg-gradient-to-b to-fv-turquoise from-fv-blue-light p-5">
        <SearchInput.Container />
      </section>
      <div className="grid grid-cols-7 md:divide-x-2 divide-gray-300">
        <div className="hidden md:block min-h-220 col-start-2 col-span-6">
          <h1 className="text-3xl text-medium mx-6 my-4">
            <em>{searchTerm}</em> search results from {siteTitle}
          </h1>
        </div>
        <div className="col-span-7 md:col-span-1 mt-2">
          <h2 className="hidden md:block text-2xl ml-8">Filters</h2>
          <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4 ">{getFilterListItems()}</ul>
        </div>
        <div className="min-h-220 col-span-7 md:col-span-6">
          <DictionaryListPresentation
            items={items}
            actions={actions}
            isLoading={isLoading}
            error={error}
            wholeDomain={wholeDomain}
          />
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
  isLoading: bool,
  items: array,
  searchTerm: string,
  siteTitle: string,
}

export default SearchPresentation
