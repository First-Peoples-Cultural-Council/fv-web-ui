import React from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Paper from '@material-ui/core/Paper'

// FPCC
import FVButton from 'components/FVButton'
import PromiseWrapper from 'components/PromiseWrapper'
import SearchDictionaryListLargeScreen from 'components/SearchDictionary/SearchDictionaryListLargeScreen'
import Pagination from 'components/Pagination'

import './SearchDictionary.css'

/**
 * @summary SearchDictionaryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryPresentation({
  computeEntities,
  currentFilter,
  dialectName,
  filters,
  handleFilter,
  handleSearchSubmit,
  handleTextFieldChange,
  hasItems,
  intl,
  isDialect,
  items,
  newSearchValue,
  searchTerm,
  // Props for Pagination
  changePagination,
  page,
  pageSize,
  resultsCount,
}) {
  const filterListItems = filters.map((filter) => {
    const filterIsActiveClass = currentFilter == filter.type ? 'SearchDictionary__filterListItem--active' : ''
    return (
      <li
        key={filter.type}
        id={'SearchDictionary__filterListItem' + filter.label}
        className={`SearchDictionary__filterListItem ${filterIsActiveClass}`}
        onClick={() => {
          handleFilter(filter.type)
        }}
      >
        {filter.label}
      </li>
    )
  })
  const heading = isDialect ? (
    <h1 className="title">
      <em>{searchTerm}</em> search results from {dialectName}
    </h1>
  ) : (
    <h1 className="title">
      <em>{searchTerm}</em> search results from FirstVoices
    </h1>
  )
  return (
    <div className="SearchDictionary">
      <div className="SearchDictionary__filters col-xs-12 col-md-2">
        <h2>{intl.trans('filters', 'Filters', 'first')}</h2>
        <ul className="SearchDictionary__filterList">{filterListItems}</ul>
      </div>

      <Paper className="SearchDictionary__container col-xs-12 col-md-10">
        {heading}
        <div className="SearchDictionary__form">
          <div className="SearchDictionary__formPrimary">
            <input
              data-testid="SearchDictionary__formPrimaryInput"
              className="SearchDictionary__formPrimaryInput"
              type="text"
              onChange={handleTextFieldChange}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSearchSubmit(e)
                }
              }}
              value={newSearchValue}
            />
            <FVButton variant="contained" onClick={handleSearchSubmit} color="primary">
              {intl.trans('search', 'Search', 'first')}
            </FVButton>
          </div>
        </div>

        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          {hasItems === true && (
            <Pagination.Container
              pageSize={pageSize}
              page={page}
              resultsCount={resultsCount}
              onPaginationUpdate={(pagePageSize) => {
                changePagination(pagePageSize)
              }}
            >
              <SearchDictionaryListLargeScreen intl={intl} isDialect={isDialect} items={items} />
            </Pagination.Container>
          )}
          {hasItems === false && (
            <div className={'SearchDictionary SearchDictionary--noData'}>
              Sorry, no results were found for this search.
            </div>
          )}
        </PromiseWrapper>
      </Paper>
    </div>
  )
}
// PROPTYPES
const { array, bool, func, number, object, string } = PropTypes
SearchDictionaryPresentation.propTypes = {
  computeEntities: object,
  currentFilter: string,
  dialectName: string,
  filters: array,
  handleFilter: func,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  hasItems: bool,
  intl: object,
  isDialect: bool,
  items: array,
  newSearchValue: string,
  searchTerm: string,
  // Props for Pagination
  changePagination: func,
  page: number,
  pageSize: number,
  resultsCount: number,
}

export default SearchDictionaryPresentation
