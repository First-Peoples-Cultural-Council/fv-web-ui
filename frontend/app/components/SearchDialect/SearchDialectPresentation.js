import React from 'react'
import PropTypes from 'prop-types'

import FVButton from 'components/FVButton'
import {
  SEARCH_DATA_TYPE_WORD,
  SEARCH_FILTERED_BY_CATEGORY,
  SEARCH_FILTERED_BY_CHARACTER,
  SEARCH_FILTERED_BY_PHRASE_BOOK,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
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
  browseMode,
  childrenSearchMessage,
  childrenUiSecondary,
  dialectClassName,
  formRefSearch,
  intl,
  onPressEnter,
  onReset,
  onSearch,
  searchDialectDataType,
  searchStyle,
  searchTerm,
}) {
  const getBrowseText = () => {
    switch (browseMode) {
      case SEARCH_FILTERED_BY_CHARACTER:
        return 'Stop browsing Alphabetically'
      case SEARCH_FILTERED_BY_CATEGORY:
        return 'Stop browsing by Category'
      case SEARCH_FILTERED_BY_PHRASE_BOOK:
        return 'Stop browsing by Phrase Book'
      default:
        return 'Stop browsing and clear filter'
    }
  }
  return (
    <div data-testid="SearchDialect" className="SearchDialect">
      {/* Search Message */}
      {childrenSearchMessage}
      {/* In Browse Mode */}
      {browseMode && (
        <div className="SearchDialectForm SearchDialectForm--filtering">
          <FVButton
            variant="contained"
            onClick={() => {
              onReset()
            }}
            color="primary"
          >
            {getBrowseText()}
          </FVButton>
        </div>
      )}
      {/* Not in Browse Mode */}
      {!browseMode && (
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
              {searchDialectDataType === SEARCH_DATA_TYPE_WORD
                ? intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
                : 'Search Phrases'}
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
const { func, node, number, object, string } = PropTypes
SearchDialectPresentation.propTypes = {
  browseMode: string,
  childrenSearchMessage: node,
  childrenUiSecondary: node,
  dialectClassName: string,
  formRefSearch: object,
  intl: object,
  onPressEnter: func,
  onReset: func,
  onSearch: func,
  searchDialectDataType: number,
  searchStyle: string,
  searchTerm: string,
}

export default SearchDialectPresentation
