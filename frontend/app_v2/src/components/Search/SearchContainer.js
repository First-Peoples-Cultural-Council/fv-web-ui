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
    error,
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    isLoading,
    items,
    newSearchValue,
    searchTerm,
    siteTitle,
  } = SearchData()
  return (
    <SearchPresentation
      actions={actions}
      currentFilter={currentFilter}
      error={error}
      filters={filters}
      handleFilter={handleFilter}
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      isLoading={isLoading}
      items={items}
      newSearchValue={newSearchValue}
      searchTerm={searchTerm}
      siteTitle={siteTitle}
    />
  )
}

export default SearchContainer
