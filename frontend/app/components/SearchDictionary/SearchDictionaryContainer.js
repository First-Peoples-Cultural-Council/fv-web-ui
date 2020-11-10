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
      {({ computeEntities, entries, intl, searchTerm }) => {
        return (
          <SearchDictionaryPresentation
            computeEntities={computeEntities}
            entries={entries}
            intl={intl}
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
