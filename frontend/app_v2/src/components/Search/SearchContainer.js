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
  const {
    actions,
    currentFilter,
    filters,
    domain,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    isLoading,
    items,
    newSearchValue,
    searchTerm,
    sitename,
    siteTitle,
  } = SearchData()
  return (
    <SearchPresentation
      actions={actions}
      currentFilter={currentFilter}
      filters={filters}
      domain={domain}
      handleFilter={handleFilter}
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      isLoading={isLoading}
      items={items}
      newSearchValue={newSearchValue}
      searchTerm={searchTerm}
      sitename={sitename}
      siteTitle={siteTitle}
    />
  )
}

export default SearchContainer
