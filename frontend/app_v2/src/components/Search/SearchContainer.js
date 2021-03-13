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
        sitename,
        filters,
        handleFilter,
        handleSearchSubmit,
        handleTextFieldChange,
        hasItems,
        isSite,
        items,
        newSearchValue,
        searchTerm,
      }) => {
        return (
          <SearchPresentation
            currentFilter={currentFilter}
            sitename={sitename}
            filters={filters}
            handleFilter={handleFilter}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            hasItems={hasItems}
            isSite={isSite}
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
