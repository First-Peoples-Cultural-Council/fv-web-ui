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
      {({ computeEntities, entries, handleSearchSubmit, handleTextFieldChange, intl, searchTerm, newSearchValue }) => {
        return (
          <SearchDictionaryPresentation
            computeEntities={computeEntities}
            entries={entries}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            intl={intl}
            searchTerm={searchTerm}
            newSearchValue={newSearchValue}
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
