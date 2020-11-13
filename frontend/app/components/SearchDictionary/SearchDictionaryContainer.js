import React from 'react'
// import PropTypes from 'prop-types'
import SearchDictionaryPresentation from 'components/SearchDictionary/SearchDictionaryPresentation'
import SearchDictionaryData from 'components/SearchDictionary/SearchDictionaryData'

/**
 * @summary SearchDictionaryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryContainer() {
  return (
    <SearchDictionaryData>
      {({
        changePagination,
        computeEntities,
        currentFilter,
        filters,
        handleFilter,
        handleSearchSubmit,
        handleTextFieldChange,
        hasItems,
        intl,
        items,
        newSearchValue,
        page,
        pageSize,
        resultsCount,
        searchTerm,
      }) => {
        return (
          <SearchDictionaryPresentation
            changePagination={changePagination}
            computeEntities={computeEntities}
            currentFilter={currentFilter}
            filters={filters}
            handleFilter={handleFilter}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            hasItems={hasItems}
            intl={intl}
            items={items}
            newSearchValue={newSearchValue}
            page={page}
            pageSize={pageSize}
            resultsCount={resultsCount}
            searchTerm={searchTerm}
          />
        )
      }}
    </SearchDictionaryData>
  )
}
// PROPTYPES
// const { string } = PropTypes
SearchDictionaryContainer.propTypes = {
  //   something: string,
}

export default SearchDictionaryContainer
