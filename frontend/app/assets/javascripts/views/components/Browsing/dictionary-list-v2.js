/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Libraries
import React, { Suspense } from 'react'
import PropTypes, { bool } from 'prop-types'
import selectn from 'selectn'
import { List, Map } from 'immutable'
import Media from 'react-media'

// Components
import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'
const SearchDialect = React.lazy(() => import('views/components/SearchDialect'))
const FlashcardList = React.lazy(() => import('views/components/Browsing/flashcard-list'))
const DictionaryListSmallScreen = React.lazy(() => import('views/components/Browsing/dictionary-list-small-screen'))
const DictionaryListLargeScreen = React.lazy(() => import('views/components/Browsing/dictionary-list-large-screen'))

/*
  FW-80
  =============================================================================
  - Search:
    Known issues:
    1) 1,2, & 3 char search doesn't work
    2) Url params is getting removed by ancestor

    UI:
      √ Field: Input
      √ Button: Search
      √ Button: reset/clear search
      Fields to search (related to columns?), eg: word, definitions, literal translations, parts of speech
      √ Feedback:
        "Showing words that contain the search term 'test' in the 'Word' and 'Definitions' columns"
        "Showing all words in the dictionary listed alphabetically"

    √ url = .../learn/words/[perPage]/[page]
    X  &q=[term] // query

    X  Section/Type related options (defined in columns prop array):
      &active=W,D,LT,POS&POS=adjective
      &W=1&D=1&LT=1&POS=1
      &w=[1,0] // word
      &d=[1,0] // definitions
      &lT=[1,0] // literal translations
      &pS=[option value] // parts of speech

    X url = .../learn/words/[perPage]/[page]?sB=dc:title&sO=asc&q=searchTermHere&w=1&d=1&lT=1&pS=adjective

  - Sorting:
    sB=[field] // sort by
    sO=[asc or desc] // sort order

  - Pagination:
    url = .../[perPage]/[page]

  - View Buttons:
    v=[0,1,2,...]

    0 = small screen
    1 = large screen
    2 = flash cards

  - Bulk operations:

  - Select a row:

  */
const DictionaryListV2 = (props) => {
  const intl = IntlService.instance
  const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

  const items = props.filteredItems || props.items
  const noResults =
    selectn('length', items) === 0 ? (
      <div className={`DictionaryList DictionaryList--noData  ${props.cssModifier}`}>
        {intl.translate({
          key: 'no_results_found',
          default: 'No Results Found',
          case: 'first',
          append: '.',
        })}
      </div>
    ) : null

  return (
    <>
      <h1>(DictionaryListV2)</h1>

      {props.hasSearch && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchDialect
            columns={props.columns}
            //   filterInfo={filterInfo}
            handleSearch={props.handleSearch}
            resetSearch={props.resetSearch}
            //   searchByAlphabet={searchByAlphabet}
            //   searchByDefinitions={searchByDefinitions}
            //   searchByMode={searchByMode}
            //   searchByTitle={searchByTitle}
            //   searchByTranslations={searchByTranslations}
            //   searchingDialectFilter={searchingDialectFilter}
            //   searchPartOfSpeech={searchPartOfSpeech}
            //   searchTerm={searchTerm}
            //   flashcardMode={state.flashcardMode}
          />
        </Suspense>
      )}

      <Media
        queries={{
          small: '(max-width: 850px)',
          medium: '(min-width: 851px)',
        }}
      >
        {(matches) => {
          //  All screens: no results
          if (noResults) {
            return noResults
          }
          let content = null
          //  All screens: flashcard
          if (props.hasFlashcard) {
            content = <FlashcardList {...props} />
            if (props.hasPagination) {
              const FlashcardsWithPagination = withPagination(FlashcardList, DefaultFetcherParams.pageSize)
              content = <FlashcardsWithPagination {...props} />
            }
            return content
          }

          // Small screen
          // -----------------------------------------
          if (matches.small) {
            //  Small screen: list view
            content = <DictionaryListSmallScreen {...props} />
            if (props.hasPagination) {
              const DictionaryListSmallScreenWithPagination = withPagination(
                DictionaryListSmallScreen,
                DefaultFetcherParams.pageSize
              )
              content = <DictionaryListSmallScreenWithPagination {...props} />
            }
            return content
          }
          // Large screen
          // -----------------------------------------
          //  Large screen: no results
          if (matches.medium) {
            //  Large screen: list view
            content = <DictionaryListLargeScreen {...props} />
            if (props.hasPagination) {
              const DictionaryListLargeScreenWithPagination = withPagination(
                DictionaryListLargeScreen,
                DefaultFetcherParams.pageSize
              )
              content = <DictionaryListLargeScreenWithPagination {...props} />
            }
          }
          return content
        }}
      </Media>
    </>
  )
}

const { array, func, instanceOf, number, object, oneOfType, string } = PropTypes
DictionaryListV2.propTypes = {
  // dictionary-list
  action: func,
  cellHeight: number,
  cols: number,
  columns: array.isRequired,
  cssModifier: string,
  fields: instanceOf(Map),
  filteredItems: oneOfType([array, instanceOf(List)]),
  items: oneOfType([array, instanceOf(List)]),
  style: object,
  type: string,
  wrapperStyle: object,
  // Search
  hasSearch: bool,
  handleSearch: func,
  resetSearch: func,
}

DictionaryListV2.defaultProps = {
  // dictionary-list
  cellHeight: 210,
  cols: 3,
  columns: [],
  cssModifier: '',
  style: null,
  wrapperStyle: null,
  // search
  hasSearch: false,
  handleSearch: () => {},
  resetSearch: () => {},
}
export default DictionaryListV2
