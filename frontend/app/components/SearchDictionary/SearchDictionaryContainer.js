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
        computeEntities,
        entries,
        fetcher,
        fetcherParams,
        handleSearchSubmit,
        handleTextFieldChange,
        intl,
        metadata,
        newSearchValue,
        searchTerm,
      }) => {
        return (
          <SearchDictionaryPresentation
            computeEntities={computeEntities}
            entries={entries}
            fetcher={fetcher}
            fetcherParams={fetcherParams}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            intl={intl}
            metadata={metadata}
            newSearchValue={newSearchValue}
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
