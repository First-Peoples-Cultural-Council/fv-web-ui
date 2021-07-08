import React from 'react'
import PropTypes from 'prop-types'

import DictionarySearchInputPresentation from 'components/DictionarySearchInput/DictionarySearchInputPresentation'
import DictionarySearchInputData from 'components/DictionarySearchInput/DictionarySearchInputData'

/**
 * @summary DictionarySearchInputContainer
 * @component
 *
 * @param {object} props
 * @param {string} docType optional, values: 'WORD' or 'PHRASE'
 *
 * @returns {node} jsx markup
 */
function DictionarySearchInputContainer({ docType }) {
  const {
    currentOption,
    handleSearchSubmit,
    handleTextFieldChange,
    isMenuOpen,
    menuRef,
    onSearchOptionsClick,
    onOptionClick,
    options,
    resetSearch,
    searchValue,
    siteTitle,
    typePlural,
  } = DictionarySearchInputData({ docType })
  return (
    <DictionarySearchInputPresentation
      currentOption={currentOption}
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      isMenuOpen={isMenuOpen}
      menuRef={menuRef}
      onSearchOptionsClick={onSearchOptionsClick}
      onOptionClick={onOptionClick}
      options={options}
      resetSearch={resetSearch}
      searchValue={searchValue}
      siteTitle={siteTitle}
      typePlural={typePlural}
    />
  )
}

// PROPTYPES
const { string } = PropTypes
DictionarySearchInputContainer.propTypes = {
  docType: string.isRequired,
}

export default DictionarySearchInputContainer
