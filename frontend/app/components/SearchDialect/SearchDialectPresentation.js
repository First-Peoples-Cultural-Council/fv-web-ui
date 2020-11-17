import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./SearchDialect.css'

import FVButton from 'components/FVButton'
import {
  // SEARCH_PART_OF_SPEECH_ANY,
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
  childrenUiSecondary,
  dialectClassName,
  formRefSearch,
  intl,
  onPressEnter,
  onReset,
  onSearch,
  searchByMode,
  // searchBySettings,
  searchDialectDataType,
  // searchDialectUpdate,
  searchMessage,
  // searchNxqlQuery,
  searchTerm,
  searchStyle,
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

  const isBrowsing =
    searchByMode === SEARCH_BY_ALPHABET || searchByMode === SEARCH_BY_CATEGORY || searchByMode === SEARCH_BY_PHRASE_BOOK

  return (
    <div data-testid="SearchDialect" className="SearchDialect">
      {searchMessage}
      {/* {childrenSearchMessage} */}
      {isBrowsing ? (
        <div className="SearchDialectForm SearchDialectForm--filtering">
          <FVButton
            variant="contained"
            onClick={() => {
              onReset()
            }}
            color="primary"
          >
            {textBrowseResetButton}
          </FVButton>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSearch()
          }}
          ref={formRefSearch}
          className="SearchDialectForm"
        >
          <div className="SearchDialectFormPrimary">
            <input
              name="searchTerm"
              data-testid="SearchDialectFormPrimaryInput"
              className={`SearchDialectFormPrimaryInput ${dialectClassName}`}
              type="text"
              onKeyPress={onPressEnter}
              defaultValue={searchTerm}
            />

            <select
              name="searchStyle"
              defaultValue={searchStyle}
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

            <FVButton variant="contained" type="submit" color="primary">
              {textSearchButton}
            </FVButton>
            <FVButton variant="contained" onClick={onReset} style={{ marginLeft: '20px' }}>
              Reset search
            </FVButton>
          </div>

          {childrenUiSecondary && <div className="SearchDialectFormSecondary">{childrenUiSecondary}</div>}
        </form>
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
