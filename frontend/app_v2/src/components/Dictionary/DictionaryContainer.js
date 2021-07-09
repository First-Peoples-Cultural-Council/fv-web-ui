import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import DictionaryPresentation from 'components/Dictionary/DictionaryPresentation'
import DictionaryData from 'components/Dictionary/DictionaryData'
import Loading from 'components/Loading'

/**
 * @summary DictionaryContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryContainer({ docType }) {
  const {
    actions,
    currentOption,
    handleSearchSubmit,
    handleTextFieldChange,
    infiniteScroll,
    isLoading,
    isLoadingEntries,
    items,
    moreActions,
    onOptionClick,
    onSortByClick,
    options,
    resetSearch,
    searchValue,
    sitename,
    siteTitle,
    sorting,
    typePlural,
  } = DictionaryData({ docType })
  return (
    <Loading.Container isLoading={isLoading}>
      <DictionaryPresentation
        actions={actions}
        currentOption={currentOption}
        docType={docType}
        handleSearchSubmit={handleSearchSubmit}
        handleTextFieldChange={handleTextFieldChange}
        infiniteScroll={infiniteScroll}
        isLoadingEntries={isLoadingEntries}
        items={items}
        moreActions={moreActions}
        onOptionClick={onOptionClick}
        onSortByClick={onSortByClick}
        options={options}
        resetSearch={resetSearch}
        searchValue={searchValue}
        sitename={sitename}
        siteTitle={siteTitle}
        sorting={sorting}
        typePlural={typePlural}
      />
    </Loading.Container>
  )
}

// PROPTYPES
const { string } = PropTypes
DictionaryContainer.propTypes = {
  docType: string.isRequired,
}

export default DictionaryContainer
