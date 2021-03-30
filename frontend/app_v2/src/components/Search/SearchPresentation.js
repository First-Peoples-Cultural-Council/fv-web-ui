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
function SearchPresentation({ currentFilter, siteTitle, error, filters, handleFilter, isLoading, items, actions }) {
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
        <div className="mx-auto lg:w-3/5">
          <SearchInput.Container />
        </div>
      </section>
      <div className="grid grid-cols-7 md:p-2">
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
