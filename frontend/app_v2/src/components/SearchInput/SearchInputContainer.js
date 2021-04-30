import React from 'react'
import PropTypes from 'prop-types'

import SearchInputPresentation from 'components/SearchInput/SearchInputPresentation'
import SearchInputData from 'components/SearchInput/SearchInputData'

/**
 * @summary SearchInputContainer
 * @component
 *
 * @param {object} props
 * @param {string} docType optional, values: 'WORD' or 'PHRASE'
 *
 * @returns {node} jsx markup
 */
function SearchInputContainer({ docType }) {
  const {
    currentOption,
    handleSearchSubmit,
    handleTextFieldChange,
    isMenuOpen,
    menuRef,
    onSearchOptionsClick,
    onOptionClick,
    options,
    searchValue,
    siteTitle,
  } = SearchInputData({ docType })
  return (
    <SearchInputPresentation
      currentOption={currentOption}
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      isMenuOpen={isMenuOpen}
      menuRef={menuRef}
      onSearchOptionsClick={onSearchOptionsClick}
      onOptionClick={onOptionClick}
      options={options}
      searchValue={searchValue}
      siteTitle={siteTitle}
    />
  )
}

// PROPTYPES
const { string } = PropTypes
SearchInputContainer.propTypes = {
  docType: string,
}

export default SearchInputContainer
