import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./SearchDialect.css'

import FVButton from 'components/FVButton'
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  // SEARCH_BY_CUSTOM,
  SEARCH_BY_PHRASE_BOOK,
  // SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

/**
 * @summary SearchDialectPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDialectPresentation({
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
}) {
  // Generate UI text
  // ------------------------------------------------------------
  let textBrowseResetButton = ''
  switch (searchByMode) {
    case SEARCH_BY_ALPHABET:
      textBrowseResetButton = 'Stop browsing Alphabetically'
      break
    case SEARCH_BY_CATEGORY:
      textBrowseResetButton = 'Stop browsing by Category'
      break
    case SEARCH_BY_PHRASE_BOOK:
      textBrowseResetButton = 'Stop browsing by Phrase Book'
      break
    default:
      textBrowseResetButton = 'Stop browsing and clear filter'
  }

  const textSearchButton =
    searchDialectDataType === SEARCH_DATA_TYPE_WORD
      ? intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
      : 'Search Phrases'

  // Generates the checkboxes/selects under the search input
  // ------------------------------------------------------------
  const getSearchUi = () => {
    const classesDefault = {
      SearchDialectFormSecondaryGroup: 'SearchDialectFormSecondaryGroup',
      SearchDialectOption: 'SearchDialectOption',
      SearchDialectLabel: 'SearchDialectLabel',
    }

    return searchUi.map((searchUiData, key1) => {
      const { type, idName, labelText, classes = {} } = searchUiData
      const _classes = Object.assign({}, classesDefault, classes)
      let element = null
      if (type === 'select') {
        const { options = [] } = searchUiData

        const optionItems =
          options.length > 0
            ? options.map((option, key2) => {
                return (
                  <option key={key2} value={option.value}>
                    {option.text}
                  </option>
                )
              })
            : partsOfSpeechOptions
        element = (
          <span key={key1} className={_classes.SearchDialectFormSecondaryGroup}>
            <label className={_classes.SearchDialectLabel} htmlFor={idName}>
              {labelText}
            </label>
            <select
              className={_classes.SearchDialectOption}
              id={idName}
              name={idName}
              onChange={handleChangeSearchBySettings}
              value={searchBySettings[idName]}
            >
              <option key="SEARCH_PART_OF_SPEECH_ANY" value={SEARCH_PART_OF_SPEECH_ANY}>
                Any
              </option>

              {optionItems}
            </select>
          </span>
        )
      } else {
        element = (
          <span key={key1} className={_classes.SearchDialectFormSecondaryGroup}>
            <input
              checked={searchBySettings[idName] || false}
              className={_classes.SearchDialectOption}
              id={idName}
              name={idName}
              onChange={handleChangeSearchBySettings}
              type="checkbox"
            />
            <label className={_classes.SearchDialectLabel} htmlFor={idName}>
              {labelText}
            </label>
          </span>
        )
      }
      return element
    })
  }

  const isBrowsing =
    searchByMode === SEARCH_BY_ALPHABET || searchByMode === SEARCH_BY_CATEGORY || searchByMode === SEARCH_BY_PHRASE_BOOK

  return (
    <div data-testid="SearchDialect" className="SearchDialect">
      {searchMessage}
      {isBrowsing ? (
        <div className="SearchDialectForm SearchDialectForm--filtering">
          <FVButton
            variant="contained"
            onClick={() => {
              resetSearch()
            }}
            color="primary"
          >
            {textBrowseResetButton}
          </FVButton>
        </div>
      ) : (
        <div className="SearchDialectForm">
          <div className="SearchDialectFormPrimary">
            <input
              data-testid="SearchDialectFormPrimaryInput"
              className={`SearchDialectFormPrimaryInput ${dialectClassName}`}
              type="text"
              onChange={(evt) => {
                searchDialectUpdate({ searchTerm: evt.target.value })
              }}
              onKeyPress={handleEnterSearch}
              value={searchTerm || ''}
            />

            <select
              defaultValue={searchType || SEARCH_TYPE_DEFAULT_SEARCH}
              onChange={(evt) => {
                searchDialectUpdate({ searchType: evt.target.value })
              }}
              data-testid="SearchDialectFormSelectSearchType"
              className={`SearchDialectFormSelectSearchType ${dialectClassName}`}
            >
              <option value={SEARCH_TYPE_DEFAULT_SEARCH}>Default</option>
              <option value={SEARCH_TYPE_APPROXIMATE_SEARCH}>Approximate</option>
              <option value={SEARCH_TYPE_EXACT_SEARCH}>Exact</option>
              <option value={SEARCH_TYPE_CONTAINS_SEARCH}>Contains</option>
              <option value={SEARCH_TYPE_STARTS_WITH_SEARCH}>Starts with</option>
              <option value={SEARCH_TYPE_ENDS_WITH_SEARCH}>Ends with</option>
              <option value={SEARCH_TYPE_WILDCARD_SEARCH}>Wildcard</option>
            </select>

            <FVButton variant="contained" onClick={handleSearch} color="primary">
              {textSearchButton}
            </FVButton>

            {searchNxqlQuery && (
              <FVButton variant="contained" onClick={resetSearch} style={{ marginLeft: '20px' }}>
                Reset search
              </FVButton>
            )}
          </div>

          <div className="SearchDialectFormSecondary">{getSearchUi()}</div>
        </div>
      )}
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
SearchDialectPresentation.propTypes = {
  textSearchButton: string,
}

export default SearchDialectPresentation
