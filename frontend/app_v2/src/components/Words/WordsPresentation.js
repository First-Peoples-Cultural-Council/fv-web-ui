import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, Link } from 'react-router-dom'

import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'
import SearchInput from 'components/SearchInput'
import useIcon from 'common/useIcon'

/**
 * @summary WordsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsPresentation({
  currentFilter,
  siteTitle,
  filters,
  handleFilter,
  isLoading,
  items,
  actions,
  moreActions,
  sitename,
  searchTerm,
  infiniteScroll,
}) {
  const wholeDomain = siteTitle === 'FirstVoices'
  const location = useLocation()

  const getFilterListItems = () => {
    return filters.map((filter) => {
      const filterIsActiveClass =
        currentFilter === filter.type ? 'border-l-4 border-primary bg-primary text-white' : 'text-fv-charcoal'
      return (
        <li
          key={filter.label}
          id={'WordsFilter' + filter.label}
          className="inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow"
        >
          <Link
            className={`inline-block transition duration-500 ease-in-out md:block p-3 flex-grow rounded-lg capitalize cursor-pointer ${filterIsActiveClass}`}
            to={`${location.pathname}?q=${searchTerm}&docType=${filter.type}`}
            onClick={() => {
              handleFilter(filter.type)
            }}
          >
            {currentFilter !== 'ALL' && filter.type === 'ALL' ? (
              <>{useIcon('BackArrow', 'inline-flex pb-2 h-7 text-primary fill-current')} Back to all results</>
            ) : (
              <>{filter.label}</>
            )}
          </Link>
        </li>
      )
    })
  }

  return (
    <>
      <section className="bg-gradient-to-b from-word to-word-dark p-5">
        <div className="mx-auto lg:w-3/5">
          <SearchInput.Container docType={'WORD'} />
        </div>
      </section>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-2">
          <h2 className="hidden md:block text-2xl ml-8">Filters</h2>
          <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4 ">{getFilterListItems()}</ul>
        </div>
        <div className="min-h-220 col-span-11 md:col-span-9">
          <DictionaryListPresentation
            items={items}
            actions={actions}
            isLoading={isLoading}
            moreActions={moreActions}
            sitename={sitename}
            wholeDomain={wholeDomain}
            infiniteScroll={infiniteScroll}
          />
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
WordsPresentation.propTypes = {
  actions: array,
  moreActions: array,
  currentFilter: string,
  filters: array,
  handleFilter: func,
  isLoading: bool,
  items: object,
  searchTerm: string,
  sitename: string,
  siteTitle: string,
  infiniteScroll: object,
}

export default WordsPresentation
