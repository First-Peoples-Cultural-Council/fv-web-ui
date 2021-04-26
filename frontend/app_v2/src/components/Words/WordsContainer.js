import React from 'react'
import WordsPresentation from 'components/Words/WordsPresentation'
import WordsData from 'components/Words/WordsData'

/**
 * @summary WordsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsContainer() {
  const {
    actions,
    currentFilter,
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    isLoading,
    items,
    newSearchValue,
    searchTerm,
    siteShortUrl,
    siteTitle,
    infiniteScroll,
  } = WordsData()
  return (
    <WordsPresentation
      actions={actions}
      currentFilter={currentFilter}
      filters={filters}
      handleFilter={handleFilter}
      handleSearchSubmit={handleSearchSubmit}
      handleTextFieldChange={handleTextFieldChange}
      isLoading={isLoading}
      items={items}
      newSearchValue={newSearchValue}
      searchTerm={searchTerm}
      siteShortUrl={siteShortUrl}
      siteTitle={siteTitle}
      infiniteScroll={infiniteScroll}
    />
  )
}

export default WordsContainer
