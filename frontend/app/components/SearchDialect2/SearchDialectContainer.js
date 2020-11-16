import React from 'react'
// import PropTypes from 'prop-types'
import SearchDialectPresentation from 'components/SearchDialect2/SearchDialectPresentation'
import SearchDialectData from 'components/SearchDialect2/SearchDialectData'

/**
 * @summary SearchDialectContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDialectContainer({
  handleSearch: externalHandleSearch,
  resetSearch: externalResetSearch,
  searchDialectDataType: externalSearchDialectDataType,
  searchUi: externalSearchUi,
}) {
  return (
    <SearchDialectData
      handleSearch={externalHandleSearch}
      resetSearch={externalResetSearch}
      searchDialectDataType={externalSearchDialectDataType}
      searchUi={externalSearchUi}
    >
      {({
        dialectClassName,
        handleChangeSearchBySettings,
        handleEnterSearch,
        handleSearch,
        intl,
        partsOfSpeechOptions,
        resetSearch,
        searchByMode,
        searchBySettings,
        searchDialectDataType,
        searchDialectUpdate,
        searchMessage,
        searchNxqlQuery,
        searchTerm,
        searchType,
        searchUi,
      }) => {
        return (
          <SearchDialectPresentation
            dialectClassName={dialectClassName}
            handleChangeSearchBySettings={handleChangeSearchBySettings}
            handleEnterSearch={handleEnterSearch}
            handleSearch={handleSearch}
            intl={intl}
            partsOfSpeechOptions={partsOfSpeechOptions}
            resetSearch={resetSearch}
            searchByMode={searchByMode}
            searchBySettings={searchBySettings}
            searchDialectDataType={searchDialectDataType}
            searchDialectUpdate={searchDialectUpdate}
            searchMessage={searchMessage}
            searchNxqlQuery={searchNxqlQuery}
            searchTerm={searchTerm}
            searchType={searchType}
            searchUi={searchUi}
          />
        )
      }}
    </SearchDialectData>
  )
}
// PROPTYPES
// const { string } = PropTypes
SearchDialectContainer.propTypes = {
  //   something: string,
}

export default SearchDialectContainer
