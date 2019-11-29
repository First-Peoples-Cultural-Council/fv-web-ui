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
import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import { List, Map } from 'immutable'
import Media from 'react-media'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

// Components
import {
  batchTitle,
  batchFooter,
  batchRender,
  deleteSelected,
  getIcon,
  sortCol,
  getUidsFromComputedData,
  getUidsThatAreNotDeleted,
  // useDeleteItem,
  // useGetData,
  // usePaginationRequest,
} from 'common/ListView'
import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'
import FVButton from 'views/components/FVButton'
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

  √ - Sorting:
    sB=[field] // sort by
    sO=[asc or desc] // sort order

  √ - Pagination:
    url = .../[perPage]/[page]

  √ - View Buttons:
    v=[0,1,2,...]

    0 = small screen
    1 = large screen
    2 = flash cards

  √ - Bulk operations:

  - Select a row:

  */

/*
PROPS:
  withPagination
  --------------------
  appendControls
  disablePageSize
  fetcher
  fetcherParams
  metadata
  (also withPagination `...props`)

  Flashcards
  --------------------
  columns
  filteredItems
  flashcardTitle
  items

  List: large screen
  --------------------
  columns
  cssModifier
  filteredItems
  items

  List: small screen
  --------------------
  items
  */
const DictionaryListV2 = (props) => {
  const intl = IntlService.instance
  const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

  let propsColumns = props.columns
  // ============= SORT
  const { routeParams, search } = props
  const { pageSize } = routeParams
  const { sortOrder, sortBy } = search

  // Add in sorting if needed:
  propsColumns = props.columns.map((column) => {
    if (column.sortBy) {
      return Object.assign({}, column, {
        title: () => {
          return (
            <button
              type="button"
              className="Contributors__colSort" // TODO: change class name
              onClick={() => {
                sortCol({
                  newSortBy: column.sortBy,
                  pageSize,
                  pushWindowPath: props.pushWindowPath,
                  sortOrder,
                  sortHandler: props.sortHandler,
                })
              }}
            >
              {getIcon({ field: column.sortBy, sortOrder, sortBy })}
              {column.title}
            </button>
          )
        },
      })
    }
    return column
  })
  // ============= SORT

  // ============= BATCH
  const [batchSelected, setBatchSelected] = useState([])
  const [batchDeletedUids, setBatchDeletedUids] = useState([])

  if (props.batchConfirmationAction) {
    const uids = getUidsFromComputedData({ computedData: props.computedData })
    const uidsNotDeleted = getUidsThatAreNotDeleted({ computedDataUids: uids, deletedUids: batchDeletedUids })
    propsColumns = [
      {
        name: 'batch',
        title: () => {
          return batchTitle({
            uidsNotDeleted,
            selected: batchSelected,
            setSelected: setBatchSelected,
            copyDeselect: props.batchTitleSelect,
            copySelect: props.batchTitleDeselect,
          })
        },
        footer: () => {
          return batchFooter({
            colSpan: propsColumns.length,
            // confirmationAction: props.batchConfirmationAction,
            confirmationAction: () => {
              deleteSelected({
                batchConfirmationAction: props.batchConfirmationAction,
                deletedUids: batchDeletedUids,
                selected: batchSelected,
                setDeletedUids: setBatchDeletedUids,
                setSelected: setBatchSelected,
              })
            },
            selected: batchSelected,
            copyIsConfirmOrDenyTitle: props.batchFooterIsConfirmOrDenyTitle,
            copyBtnInitiate: props.batchFooterBtnInitiate,
            copyBtnDeny: props.batchFooterBtnDeny,
            copyBtnConfirm: props.batchFooterBtnConfirm,
          })
        },
        render: (value, cellData) => {
          return batchRender({
            dataUid: cellData.uid,
            selected: batchSelected,
            setSelected: setBatchSelected,
          })
        },
      },
      ...propsColumns,
    ]
  }
  // ============= BATCH

  // ============= VIEW
  const viewModeDecoder = {
    default: 0,
    flashcard: 1,
    compact: 2,
    print: 3,
  }
  const [viewMode, setViewMode] = useState(viewModeDecoder.default)
  // ============= VIEW

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
  // viewMode === viewModeDecoder.flashcard
  const getViewButtons = () => {
    return (
      <>
        {/* {viewMode === viewModeDecoder.default ? (
          <FVButton variant="contained" color="primary">
            Responsive mode
          </FVButton>
        ) : (
          <FVButton
            variant="contained"
            onClick={() => {
              setViewMode(viewModeDecoder.default)
            }}
          >
            Responsive mode
          </FVButton>
        )} */}

        {viewMode === viewModeDecoder.compact ? (
          <FVButton
            variant="contained"
            color="primary"
            onClick={() => {
              setViewMode(viewModeDecoder.default)
            }}
          >
            Cancel compact view
          </FVButton>
        ) : (
          <FVButton
            variant="contained"
            onClick={() => {
              setViewMode(viewModeDecoder.compact)
            }}
          >
            Compact view
          </FVButton>
        )}

        {viewMode === viewModeDecoder.flashcard ? (
          <FVButton
            variant="contained"
            color="primary"
            onClick={() => {
              setViewMode(viewModeDecoder.default)
            }}
          >
            Cancel flashcard view
          </FVButton>
        ) : (
          <FVButton
            variant="contained"
            onClick={() => {
              setViewMode(viewModeDecoder.flashcard)
            }}
          >
            Flashcard view
          </FVButton>
        )}

        {/* {viewMode === viewModeDecoder.print ? (
          <FVButton
            variant="contained"
            color="primary"
            onClick={() => {
              setViewMode(viewModeDecoder.default)
            }}
          >
            Cancel print view
          </FVButton>
        ) : (
          <FVButton
            variant="contained"
            onClick={() => {
              setViewMode(viewModeDecoder.print)
            }}
          >
            Print view
          </FVButton>
        )} */}
      </>
    )
  }
  const getCompactList = () => {
    let content = null
    const DictionaryListSmallScreenProps = {
      rowClickHandler: props.rowClickHandler,
      // withPagination
      // --------------------
      appendControls: props.appendControls,
      disablePageSize: props.disablePageSize,
      fetcher: props.fetcher,
      fetcherParams: props.fetcherParams,
      metadata: props.metadata,
      // List: small screen
      // --------------------
      items: props.items,
    }

    content = <DictionaryListSmallScreen {...DictionaryListSmallScreenProps} />

    if (props.hasPagination) {
      const DictionaryListSmallScreenWithPagination = withPagination(
        DictionaryListSmallScreen,
        DefaultFetcherParams.pageSize
      )
      content = <DictionaryListSmallScreenWithPagination {...DictionaryListSmallScreenProps} />
    }
    return content
  }
  return (
    <>
      <h1>(DictionaryListV2)</h1>

      {getViewButtons()}

      {props.hasSearch && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchDialect
            //   filterInfo={filterInfo}
            //   searchByAlphabet={searchByAlphabet}
            //   searchByDefinitions={searchByDefinitions}
            //   searchByMode={searchByMode}
            //   searchByTitle={searchByTitle}
            //   searchByTranslations={searchByTranslations}
            //   searchingDialectFilter={searchingDialectFilter}
            //   searchPartOfSpeech={searchPartOfSpeech}
            //   searchTerm={searchTerm}
            // columns={props.columns}
            handleSearch={props.handleSearch}
            resetSearch={props.resetSearch}
            searchUi={props.searchUi}
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
          // =========================================
          //  All screens: no results
          // =========================================
          if (noResults) {
            return noResults
          }

          let content = null

          // =========================================
          // User specified view states
          // =========================================
          //  Flashcard mode
          // -----------------------------------------
          if (viewMode === viewModeDecoder.flashcard) {
            content = <FlashcardList {...props} />
            if (props.hasPagination) {
              const FlashcardsWithPagination = withPagination(FlashcardList, DefaultFetcherParams.pageSize)
              content = <FlashcardsWithPagination {...props} />
            }
            return content
          }

          //  Compact mode
          // -----------------------------------------
          if (viewMode === viewModeDecoder.compact) {
            return getCompactList()
          }

          // =========================================
          // Responsive states
          // =========================================

          // Small screen: list view
          // -----------------------------------------
          if (matches.small) {
            return getCompactList()
          }
          // Large screen: list view
          // -----------------------------------------
          if (matches.medium) {
            const DictionaryListLargeScreenProps = {
              rowClickHandler: props.rowClickHandler,
              // withPagination
              // --------------------
              appendControls: props.appendControls,
              disablePageSize: props.disablePageSize,
              fetcher: props.fetcher,
              fetcherParams: props.fetcherParams,
              metadata: props.metadata,
              // List: large screen
              // --------------------
              // columns: props.columns,
              columns: propsColumns, // TODO
              cssModifier: props.cssModifier,
              filteredItems: props.filteredItems,
              items: props.items,
            }

            content = <DictionaryListLargeScreen {...DictionaryListLargeScreenProps} />

            if (props.hasPagination) {
              const DictionaryListLargeScreenWithPagination = withPagination(
                DictionaryListLargeScreen,
                DefaultFetcherParams.pageSize
              )
              content = <DictionaryListLargeScreenWithPagination {...DictionaryListLargeScreenProps} />
            }
          }
          return content
        }}
      </Media>
    </>
  )
}

const { array, bool, func, instanceOf, number, object, oneOfType, string } = PropTypes
DictionaryListV2.propTypes = {
  // dictionary-list
  action: func,
  cellHeight: number,
  cols: number,
  computedData: object,
  columns: array.isRequired,
  cssModifier: string,
  fields: instanceOf(Map),
  filteredItems: oneOfType([array, instanceOf(List)]),
  items: oneOfType([array, instanceOf(List)]),
  style: object,
  type: string,
  wrapperStyle: object,
  rowClickHandler: func,
  // Search
  hasSearch: bool,
  handleSearch: func,
  resetSearch: func,
  // REDUX: reducers/state
  routeParams: object.isRequired,
  search: object.isRequired,
  // REDUX: actions/dispatch/func
  pushWindowPath: func.isRequired,
}

DictionaryListV2.defaultProps = {
  // dictionary-list
  batchTitleSelect: 'Deselect all',
  batchTitleDeselect: 'Select all',
  batchFooterIsConfirmOrDenyTitle: 'Delete selected?',
  batchFooterBtnInitiate: 'Delete',
  batchFooterBtnDeny: 'No, do not delete the selected items',
  batchFooterBtnConfirm: 'Yes, delete the selected items',
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
  // REDUX: actions/dispatch/func
  pushWindowPath: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
    search: route.search,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DictionaryListV2)
