import React from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Paper from '@material-ui/core/Paper'

// FPCC
import FVButton from 'components/FVButton'
import PromiseWrapper from 'components/PromiseWrapper'
import SearchDictionaryListLargeScreen from 'components/SearchDictionary/SearchDictionaryListLargeScreen'
import withPagination from 'components/withPagination'

import '!style-loader!css-loader!./SearchDictionary.css'

/**
 * @summary SearchDictionaryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDictionaryPresentation({
  computeEntities,
  entries,
  handleSearchSubmit,
  handleTextFieldChange,
  intl,
  newSearchValue,
  searchTerm,
  // Props for withPagination
  fetcher,
  fetcherParams,
  metadata,
}) {
  const SearchDictionaryListLargeScreenWithPagination = withPagination(SearchDictionaryListLargeScreen, 10)
  return (
    <div className="SearchDictionary">
      <Paper className="container">
        <h1 className="title">
          <em>{searchTerm}</em> Search Results
        </h1>
        <div className="SearchDictionary__form">
          <div className="SearchDictionary__formPrimary">
            <input
              data-testid="SearchDictionary__formPrimaryInput"
              className="SearchDictionary__formPrimaryInput"
              type="text"
              onChange={handleTextFieldChange}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSearchSubmit(e)
                }
              }}
              value={newSearchValue}
            />
            <FVButton variant="contained" onClick={handleSearchSubmit} color="primary">
              {intl.trans('search', 'Search', 'first')}
            </FVButton>
          </div>
        </div>
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          {entries.length === 0 ? (
            <div className={'WordsList WordsList--noData'}>Sorry, no results were found for this search.</div>
          ) : (
            <SearchDictionaryListLargeScreenWithPagination
              entries={entries}
              intl={intl}
              // withPagination params
              fetcher={fetcher}
              fetcherParams={fetcherParams}
              metadata={metadata}
            />
          )}
        </PromiseWrapper>
      </Paper>
    </div>
  )
}
// PROPTYPES
const { array, func, object, string } = PropTypes
SearchDictionaryPresentation.propTypes = {
  computeEntities: object,
  entries: array,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  intl: object,
  newSearchValue: string,
  searchTerm: string,
  // Props for withPagination
  fetcher: func,
  fetcherParams: object,
  metadata: object,
}

export default SearchDictionaryPresentation
