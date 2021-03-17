import React from 'react'
import SearchInputPresentation from 'components/SearchInput/SearchInputPresentation'
import SearchInputData from 'components/SearchInput/SearchInputData'

/**
 * @summary SearchInputContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchInputContainer() {
  const { handleSearchSubmit, handleTextFieldChange, searchValue, sitename } = SearchInputData()
  return (
    <SearchInputPresentation
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      searchValue={searchValue}
      sitename={sitename}
    />
  )
}

export default SearchInputContainer
