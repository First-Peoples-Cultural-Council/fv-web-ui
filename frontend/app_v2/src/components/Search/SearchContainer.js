import React from 'react'
import SearchPresentation from 'components/Search/SearchPresentation'
import SearchData from 'components/Search/SearchData'

/**
 * @summary SearchContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchContainer() {
  return (
    <SearchData>
      {({
        currentFilter,
        dialectName,
        filters,
        handleFilter,
        handleSearchSubmit,
        handleTextFieldChange,
        hasItems,
        isDialect,
        items,
        newSearchValue,
        searchTerm,
      }) => {
        return (
          <SearchPresentation
            currentFilter={currentFilter}
            dialectName={dialectName}
            filters={filters}
            handleFilter={handleFilter}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            hasItems={hasItems}
            isDialect={isDialect}
            items={items}
            newSearchValue={newSearchValue}
            searchTerm={searchTerm}
          />
        )
      }}
    </SearchData>
  )
}

export default SearchContainer
