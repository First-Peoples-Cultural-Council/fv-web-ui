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

/*
=============================================================================
Search
=============================================================================

`handleSearch` func
------------------------------------
  Callback called after search is initiated in <SearchDialect /> via:
    // In SearchDialect
    const handleSearch = async () => {
      // ...
      // Save to redux
      await props.searchDialectUpdate(searchData)

      // Notify ancestors
      props.handleSearch()
    }

    TODO: Since SearchDialect is setting search data in Redux, we may be
    TODO: able to drop this prop if the relevant ancestors are also using
    TODO: redux to monitor changes to searchDialect.computeSearchDialect


`hasSearch` bool
------------------------------------
  Toggles the <SearchDialect /> component


`resetSearch` func
------------------------------------
  Callback called after search is reset in <SearchDialect /> via:
    // In SearchDialect
    const resetSearch = async () => {
      // ...

      // Save to redux
      await props.searchDialectUpdate(searchData)

      // Notify ancestors
      props.resetSearch()
    }

    TODO: Since SearchDialect is setting search data in Redux, we may be
    TODO: able to drop this prop if the relevant ancestors are also using
    TODO: redux to monitor changes to searchDialect.computeSearchDialect


`searchUi` array of objects
------------------------------------
  Generates the UI under the search field, eg: checkboxes & selects

  searchUi={[
    { // For a checkbox:
      defaultChecked: true, // [Optional] boolean to select/deselect the checkbox
      idName: 'searchByTitle', // Used for id & name attributes
      labelText: 'Phrase', // Text used in <label>
    },
    { // For a select:
      type: 'select',
      value: 'test', // [Optional] to set the selected option
      idName: 'searchPartOfSpeech', // Used for id & name attributes
      labelText: 'Parts of speech:', // Text used in <label>
      options: [ // Array of objs to generate <option>s
        {
          value: 'test',
          text: 'Test',
        },
      ],
    },
  ]}


Known issues
-----------------------------------------------------------------------------
- 1,2, & 3 char searches don't work with title
- Url params is getting removed by ancestor


=============================================================================
Sorting
=============================================================================
Sorting updates the url and will call `sortHandler` (if defined)

`columns[#].sortBy` array of obj
------------------------------------
Sorting is enabled when the props.columns data contains a `sortBy` property,
eg: sortBy: 'dc:title'


`hasSorting` bool [DEFAULT = TRUE]
------------------------------------
Sometimes the `columns` data will have a `sortBy` prop defined but you may
need to disable sorting (eg: when displayed in a modal)

hasSorting={false} lets you do that


`sortHandler` func
------------------------------------
Called after the url was updated due to sort click:
  sortHandler({
    page,
    pageSize,
    sortOrder,
    sortBy,
  })

You would use `sortHandler` if the ancestor component needs to
update some state/var and/or fire off an api request


=============================================================================
Pagination
=============================================================================

`hasPagination` bool
------------------------------------
Will paginate if `props.hasPagination === true`

If paginating, you also need to pass in any additional & relevant `withPagination` props, eg:
  - `appendControls`
  - `disablePageSize`
  - `fetcher`
  - `fetcherParams`
  - `metadata`


=============================================================================
View modes
=============================================================================

`hasViewModeButtons` bool [DEFAULT = TRUE]
------------------------------------
Toggles the view mode buttons (eg: Compact, Flashcard)


=============================================================================
Bulk operations
=============================================================================
If `props.batchConfirmationAction` is defined, the `props.columns` array will
be updated to insert a batch column at the start of the array/table and a footer
will be generated.

NOTE: Currently only supports deleting selected items. New code would be needed
to support different types of actions.

`batchConfirmationAction` func
------------------------------------
Called after elements in the list are 'visually deleted',
use this prop to make the api call required.

`batchFooterBtnConfirm` string
`batchFooterBtnDeny` string
`batchFooterBtnInitiate` string
`batchFooterIsConfirmOrDenyTitle` string
`batchTitleDeselect` string
`batchTitleSelect` string
------------------------------------
UI text


=============================================================================
Select a row
=============================================================================

`rowClickHandler` func
------------------------------------
callback for when a row is clicked
passes out the clicked item's data


=============================================================================
Miscellaneous
=============================================================================

`dictionaryListSmallScreenTemplate` number
------------------------------------
Specifies which template to use with the small screen view.
If omitted DictionaryListSmallScreen.js uses the Word template.


Pass through props
------------------------------------
The following props are passed out to other components but not exclusively,
the props may be referenced in this file as well.

List views: DictionaryListSmallScreen, DictionaryListLargeScreen
--------------------
- `columns`
- `cssModifier`
- `filteredItems`
- `items`

Flashcard
--------------------
- `columns`
- `filteredItems`
- `flashcardTitle`
- `items`

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
import { setListViewMode } from 'providers/redux/reducers/listView'

// Components
import {
  batchTitle,
  batchFooter,
  batchRender,
  deleteSelected,
  getIcon,
  getSortState,
  sortCol,
  getUidsFromComputedData,
  getUidsThatAreNotDeleted,
} from 'common/ListView'
import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'
import FVButton from 'views/components/FVButton'
const SearchDialect = React.lazy(() => import('views/components/SearchDialect'))
const FlashcardList = React.lazy(() => import('views/components/Browsing/flashcard-list'))
const DictionaryListSmallScreen = React.lazy(() => import('views/components/Browsing/DictionaryListSmallScreen'))
const DictionaryListLargeScreen = React.lazy(() => import('views/components/Browsing/DictionaryListLargeScreen'))

import '!style-loader!css-loader!./DictionaryList.css'

// ===============================================================
// DictionaryList
// ===============================================================
const DictionaryList = (props) => {
  const intl = IntlService.instance
  const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

  let columnsEnhancedWithSortBatch = props.columns

  // ============= MQ
  const [mediaQuery, setMediaQuery] = useState({})

  // ============= SORT
  if (props.hasSorting) {
    columnsEnhancedWithSortBatch = generateSortTitleLargeSmall({
      columns: props.columns,
      pageSize: props.routeParams.pageSize,
      sortOrder: props.search.sortOrder,
      sortBy: props.search.sortBy,
      navigationFunc: props.pushWindowPath,
      sortHandler: props.sortHandler,
    })
  }
  // ============= SORT

  // ============= BATCH
  if (props.batchConfirmationAction) {
    columnsEnhancedWithSortBatch = generateBatchColumn({
      batchConfirmationAction: props.batchConfirmationAction,
      columnsEnhancedWithSortBatch,
      computedData: props.computedData,
      copyBtnConfirm: props.batchFooterBtnConfirm,
      copyBtnDeny: props.batchFooterBtnDeny,
      copyBtnInitiate: props.batchFooterBtnInitiate,
      copyDeselect: props.batchTitleSelect,
      copyIsConfirmOrDenyTitle: props.batchFooterIsConfirmOrDenyTitle,
      copySelect: props.batchTitleDeselect,
    })
  }
  // ============= BATCH

  const { listView } = props
  const { mode: viewMode, decoder: viewModeDecoder } = listView

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

  const getCompactListArg = {
    dictionaryListSmallScreenProps: {
      rowClickHandler: props.rowClickHandler,
      hasSorting: props.hasSorting,
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
      columns: columnsEnhancedWithSortBatch,
      dictionaryListSmallScreenTemplate: props.dictionaryListSmallScreenTemplate,
    },
    hasPagination: props.hasPagination,
    pageSize: DefaultFetcherParams.pageSize,
  }

  return (
    <>
      {props.hasViewModeButtons &&
        getViewButtons({
          mediaQueryIsSmall: mediaQuery.small,
          viewMode,
          viewModeDecoder,
          clickHandler: props.setListViewMode,
        })}

      {props.hasSearch && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchDialect
            handleSearch={props.handleSearch}
            resetSearch={props.resetSearch}
            searchUi={props.searchUi}
            searchDialectDataType={props.searchDialectDataType}
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
          // save MQ data
          setMediaQuery(matches)

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
            // TODO: SPECIFY FlashcardList PROPS
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
            return getCompactList(getCompactListArg)
          }

          // =========================================
          // Responsive states
          // =========================================

          // Small screen: list view
          // -----------------------------------------
          if (matches.small) {
            return getCompactList(getCompactListArg)
          }
          // Large screen: list view
          // -----------------------------------------
          if (matches.medium) {
            const DictionaryListLargeScreenProps = {
              rowClickHandler: props.rowClickHandler,
              hasSorting: props.hasSorting,
              // withPagination
              // --------------------
              appendControls: props.appendControls,
              disablePageSize: props.disablePageSize,
              fetcher: props.fetcher,
              fetcherParams: props.fetcherParams,
              metadata: props.metadata,
              // List: large screen
              // --------------------
              columns: columnsEnhancedWithSortBatch,
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

// generateSortTitleLargeSmall
// ------------------------------------
function generateSortTitleLargeSmall({ columns = [], pageSize, sortOrder, sortBy, navigationFunc, sortHandler }) {
  const _columns = [...columns]
  return _columns.map((column) => {
    if (column.sortBy) {
      return Object.assign({}, column, {
        titleLarge: () => {
          return (
            <button
              type="button"
              className="DictionaryList__colSort"
              onClick={() => {
                sortCol({
                  newSortBy: column.sortBy,
                  pageSize,
                  navigationFunc,
                  sortOrder,
                  sortHandler,
                })
              }}
            >
              {getIcon({ field: column.sortBy, sortOrder, sortBy })}
              {column.title}
            </button>
          )
        },
        titleSmall: () => {
          const sortState = getSortState({ field: column.sortBy, sortOrder, sortBy })
          const color = sortState ? 'primary' : undefined
          return (
            <FVButton
              type="button"
              variant="outlined"
              color={color}
              size="small"
              className={`DictionaryListSmallScreen__sortButton ${
                sortState ? `DictionaryListSmallScreen__sortButton--${sortState}` : ''
              }`}
              onClick={() => {
                sortCol({
                  newSortBy: column.sortBy,
                  pageSize,
                  navigationFunc,
                  sortOrder,
                  sortHandler,
                })
              }}
            >
              {getIcon({ field: column.sortBy, sortOrder, sortBy })}
              {column.title}
            </FVButton>
          )
        },
      })
    }
    return Object.assign({}, column, {
      titleLarge: column.title,
      titleSmall: column.title,
    })
  })
}

// generateBatchColumn
// ------------------------------------
function generateBatchColumn({
  batchConfirmationAction,
  columnsEnhancedWithSortBatch,
  computedData,
  copyBtnConfirm,
  copyBtnDeny,
  copyBtnInitiate,
  copyDeselect,
  copyIsConfirmOrDenyTitle,
  copySelect,
}) {
  const [batchSelected, setBatchSelected] = useState([])
  const [batchDeletedUids, setBatchDeletedUids] = useState([])
  const uids = getUidsFromComputedData({ computedData })
  const uidsNotDeleted = getUidsThatAreNotDeleted({ computedDataUids: uids, deletedUids: batchDeletedUids })
  return [
    {
      name: 'batch',
      title: () => {
        return batchTitle({
          uidsNotDeleted,
          selected: batchSelected,
          setSelected: setBatchSelected,
          copyDeselect,
          copySelect,
        })
      },
      footer: () => {
        return batchFooter({
          colSpan: columnsEnhancedWithSortBatch.length + 1,
          confirmationAction: () => {
            deleteSelected({
              batchConfirmationAction,
              deletedUids: batchDeletedUids,
              selected: batchSelected,
              setDeletedUids: setBatchDeletedUids,
              setSelected: setBatchSelected,
            })
          },
          selected: batchSelected,
          copyIsConfirmOrDenyTitle,
          copyBtnInitiate,
          copyBtnDeny,
          copyBtnConfirm,
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
    ...columnsEnhancedWithSortBatch,
  ]
}

// getCompactList
// ------------------------------------
function getCompactList({ dictionaryListSmallScreenProps = {}, hasPagination = false, pageSize = 10 }) {
  let content = null
  content = <DictionaryListSmallScreen {...dictionaryListSmallScreenProps} />

  if (hasPagination) {
    const DictionaryListSmallScreenWithPagination = withPagination(DictionaryListSmallScreen, pageSize)
    content = <DictionaryListSmallScreenWithPagination {...dictionaryListSmallScreenProps} />
  }
  return content
}

// getViewButtons
// ------------------------------------
function getViewButtons({ mediaQueryIsSmall, viewMode, viewModeDecoder, clickHandler }) {
  // NOTE: hiding view mode button when on small screens
  // NOTE: mediaQuery set in render
  let compactView = null
  if (mediaQueryIsSmall === false) {
    compactView =
      viewMode === viewModeDecoder.compact ? (
        <FVButton
          variant="contained"
          color="primary"
          onClick={() => {
            clickHandler(viewModeDecoder.default)
          }}
        >
          Cancel compact view
        </FVButton>
      ) : (
        <FVButton
          variant="contained"
          onClick={() => {
            clickHandler(viewModeDecoder.compact)
          }}
        >
          Compact view
        </FVButton>
      )
  }
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
            clickHandler(viewModeDecoder.default)
          }}
        >
          Responsive mode
        </FVButton>
      )} */}

      {compactView}

      {viewMode === viewModeDecoder.flashcard ? (
        <FVButton
          variant="contained"
          color="primary"
          onClick={() => {
            clickHandler(viewModeDecoder.default)
          }}
        >
          Cancel flashcard view
        </FVButton>
      ) : (
        <FVButton
          variant="contained"
          onClick={() => {
            clickHandler(viewModeDecoder.flashcard)
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
            clickHandler(viewModeDecoder.default)
          }}
        >
          Cancel print view
        </FVButton>
      ) : (
        <FVButton
          variant="contained"
          onClick={() => {
            clickHandler(viewModeDecoder.print)
          }}
        >
          Print view
        </FVButton>
      )} */}
    </>
  )
}
// ===============================================================

const { array, bool, func, instanceOf, number, object, oneOfType, string } = PropTypes
DictionaryList.propTypes = {
  // Batch
  batchConfirmationAction: func,
  batchFooterBtnConfirm: string,
  batchFooterBtnDeny: string,
  batchFooterBtnInitiate: string,
  batchFooterIsConfirmOrDenyTitle: string,
  batchTitleDeselect: string,
  batchTitleSelect: string,
  // Misc DictionaryList
  action: func,
  cellHeight: number,
  cols: number,
  columns: array.isRequired, // Col names for Data
  computedData: object,
  cssModifier: string,
  dictionaryListSmallScreenTemplate: number,
  fields: instanceOf(Map),
  filteredItems: oneOfType([array, instanceOf(List)]),
  hasSorting: bool,
  hasViewModeButtons: bool,
  items: oneOfType([array, instanceOf(List)]), // Data
  rowClickHandler: func,
  sortHandler: func,
  style: object,
  type: string,
  wrapperStyle: object,
  // Search
  handleSearch: func,
  hasSearch: bool,
  searchDialectDataType: number,
  resetSearch: func,
  searchUi: array,
  // REDUX: reducers/state
  routeParams: object.isRequired,
  search: object.isRequired,
  listView: object.isRequired,
  // REDUX: actions/dispatch/func
  pushWindowPath: func.isRequired,
}

DictionaryList.defaultProps = {
  // Batch
  batchFooterBtnConfirm: 'Yes, delete the selected items',
  batchFooterBtnDeny: 'No, do not delete the selected items',
  batchFooterBtnInitiate: 'Delete',
  batchFooterIsConfirmOrDenyTitle: 'Delete selected?',
  batchTitleDeselect: 'Select all',
  batchTitleSelect: 'Deselect all',
  // DictionaryList
  cellHeight: 210,
  cols: 3,
  columns: [],
  cssModifier: '',
  sortHandler: () => {},
  style: null,
  wrapperStyle: null,
  // General List
  hasSorting: true,
  hasViewModeButtons: true,
  // Search
  handleSearch: () => {},
  hasSearch: false,
  resetSearch: () => {},
  // REDUX: actions/dispatch/func
  pushWindowPath: () => {},
  setListViewMode: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, listView } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
    search: route.search,
    listView,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  setListViewMode,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DictionaryList)
