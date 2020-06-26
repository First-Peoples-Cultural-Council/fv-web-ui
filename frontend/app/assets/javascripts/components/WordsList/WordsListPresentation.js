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
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
import { getSearchObject } from 'common/NavigationHelpers'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
const SearchDialect = React.lazy(() => import('views/components/SearchDialect'))
const FlashcardList = React.lazy(() => import('views/components/Browsing/flashcard-list'))
const DictionaryListSmallScreen = React.lazy(() => import('views/components/Browsing/DictionaryListSmallScreen'))
const DictionaryListLargeScreen = React.lazy(() => import('views/components/Browsing/DictionaryListLargeScreen'))
const ExportDialect = React.lazy(() => import('views/components/ExportDialect'))
import '!style-loader!css-loader!./WordsList.css'

// ===============================================================
// WordList
// ===============================================================
const VIEWMODE_DEFAULT = 0
const VIEWMODE_FLASHCARD = 1
const VIEWMODE_SMALL_SCREEN = 2
const VIEWMODE_LARGE_SCREEN = 3

/**
 * @summary WordsListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */

const WordsListPresentation = (props) => {
  const intl = IntlService.instance
  const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }
  let columnsEnhanced = [...props.columns]

  // ============= SORT
  if (props.hasSorting) {
    // If window.location.search has sortOrder & sortBy,
    // Ensure the same values are in redux
    // before generating the sort markup
    const windowLocationSearch = getSearchObject()
    const windowLocationSearchSortOrder = windowLocationSearch.sortOrder
    const windowLocationSearchSortBy = windowLocationSearch.sortBy
    if (
      windowLocationSearchSortOrder &&
      windowLocationSearchSortBy &&
      (props.navigationRouteSearch.sortOrder !== windowLocationSearchSortOrder ||
        props.navigationRouteSearch.sortBy !== windowLocationSearchSortBy)
    ) {
      props.setRouteParams({
        search: {
          page: props.routeParams.page,
          pageSize: props.routeParams.pageSize,
          sortOrder: windowLocationSearchSortOrder,
          sortBy: windowLocationSearchSortBy,
        },
      })
    }

    columnsEnhanced = generateSortTitleLargeSmall({
      columns: columnsEnhanced,
      pageSize: props.routeParams.pageSize,
      sortOrder: props.navigationRouteSearch.sortOrder,
      sortBy: props.navigationRouteSearch.sortBy,
      navigationFunc: props.pushWindowPath,
      sortHandler: props.sortHandler,
    })
  }
  // ============= SORT

  // ============= ROWCLICK
  if (props.rowClickHandler) {
    columnsEnhanced = generateRowClick({
      rowClickHandler: props.rowClickHandler,
      columns: columnsEnhanced,
    })
  }
  // ============= ROWCLICK

  // ============= BATCH
  if (props.batchConfirmationAction) {
    columnsEnhanced = generateBatchColumn({
      batchConfirmationAction: props.batchConfirmationAction,
      columns: columnsEnhanced,
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

  const items = props.filteredItems || props.items

  const noResults =
    selectn('length', items) === 0 ? (
      <div
        className={`WordsList WordsList--noData  ${props.cssModifier}`}
        dangerouslySetInnerHTML={{
          __html: intl.translate({
            key: 'no_results_found_dictionary',
            default: 'No Results Found',
            case: 'title',
          }),
        }}
      />
    ) : null

  const getListSmallScreenArg = {
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
      columns: columnsEnhanced,
      dictionaryListSmallScreenTemplate: props.dictionaryListSmallScreenTemplate,
    },
    hasPagination: props.hasPagination,
    pageSize: DefaultFetcherParams.pageSize,
  }
  const getListLargeScreenArg = {
    dictionaryListLargeScreenProps: {
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
      columns: columnsEnhanced,
      cssModifier: props.cssModifier,
      filteredItems: props.filteredItems,
      items: props.items,
    },

    hasPagination: props.hasPagination,
    pageSize: DefaultFetcherParams.pageSize,
  }

  return (
    <>
      <h1 className="DialectPageTitle">{props.pageTitle}</h1>
      <div className={props.dialectClassName}>
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

        {generateListButtons({
          // Export
          dialect: props.dialect,
          exportDialectColumns: props.exportDialectColumns,
          exportDialectExportElement: props.exportDialectExportElement,
          exportDialectLabel: props.exportDialectLabel,
          exportDialectQuery: props.exportDialectQuery,
          /*
        // Commented out until export is fixed
        hasExportDialect: props.hasExportDialect,
         */
          // View mode
          clickHandlerViewMode: props.dictionaryListClickHandlerViewMode,
          dictionaryListViewMode: props.dictionaryListViewMode,
          hasViewModeButtons: props.hasViewModeButtons,
        })}

        <Media
          queries={{
            small: '(max-width: 850px)',
            medium: '(min-width: 851px)',
            print: 'print',
          }}
        >
          {(matches) => {
            // =========================================
            //  All screens: no results
            // =========================================
            if (noResults) {
              return noResults
            }

            // =========================================
            // User specified view states
            // =========================================

            //  Flashcard Specified: by view mode button or prop
            // -----------------------------------------
            if (props.dictionaryListViewMode === VIEWMODE_FLASHCARD) {
              // TODO: SPECIFY FlashcardList PROPS
              let flashCards = <FlashcardList {...props} />
              if (props.hasPagination) {
                const FlashcardsWithPagination = withPagination(FlashcardList, DefaultFetcherParams.pageSize)
                flashCards = <FlashcardsWithPagination {...props} />
              }
              return flashCards
            }

            //  Small Screen Specified: by view mode button or prop
            // -----------------------------------------
            if (props.dictionaryListViewMode === VIEWMODE_SMALL_SCREEN) {
              return getListSmallScreen(getListSmallScreenArg)
            }

            //  Large Screen Specified: by prop
            // -----------------------------------------
            if (props.dictionaryListViewMode === VIEWMODE_LARGE_SCREEN) {
              return getListLargeScreen(getListLargeScreenArg)
            }

            // =========================================
            // Responsive states
            // =========================================
            // Print: list view (uses large screen)
            // -----------------------------------------
            // NOTE: Chrome prints small screen on both small AND large views (not preferred)
            // NOTE: `matches.print` forces Chrome to print the large view for both small & large views (slightly better)
            // NOTE: But, with `matches.print` in place the only way to print the small view on Chrome is to click "Compact view"
            // NOTE: ie: small view doesn't print if it's dynamically displayed via a small screen

            // NOTE: Firefox behaves a bit better in that it dynamically chooses the view depending on the screen size
            // NOTE: Firefox ignores `matches.print`
            if (matches.print) {
              return getListLargeScreen(getListLargeScreenArg)
            }

            // Small screen: list view
            // -----------------------------------------
            if (matches.small) {
              return getListSmallScreen(getListSmallScreenArg)
            }

            // Large screen: list view
            // -----------------------------------------
            if (matches.medium) {
              return getListLargeScreen(getListLargeScreenArg)
            }

            return null
          }}
        </Media>
      </div>
    </>
  )
}

// generateListButtons
// ------------------------------------
function generateListButtons({
  // Export
  dialect,
  exportDialectColumns,
  exportDialectExportElement,
  exportDialectLabel,
  exportDialectQuery,
  hasExportDialect,
  // View mode
  clickHandlerViewMode = () => {},
  dictionaryListViewMode,
  hasViewModeButtons,
}) {
  let buttonFlashcard = null
  let exportDialect = null

  if (hasViewModeButtons) {
    buttonFlashcard =
      dictionaryListViewMode === VIEWMODE_FLASHCARD ? (
        <FVButton
          variant="contained"
          color="primary"
          className="WordsList__viewModeButton"
          onClick={() => {
            clickHandlerViewMode(VIEWMODE_DEFAULT)
          }}
        >
          Cancel flashcard view
        </FVButton>
      ) : (
        <FVButton
          variant="contained"
          className="WordsList__viewModeButton"
          onClick={() => {
            clickHandlerViewMode(VIEWMODE_FLASHCARD)
          }}
        >
          Flashcard view
        </FVButton>
      )
  }
  if (hasExportDialect) {
    exportDialect = (
      <AuthorizationFilter filter={{ permission: 'Write', entity: dialect }}>
        <Suspense fallback={<div>Loading...</div>}>
          <ExportDialect
            exportDialectColumns={exportDialectColumns}
            exportDialectExportElement={exportDialectExportElement}
            exportDialectLabel={exportDialectLabel}
            exportDialectQuery={exportDialectQuery}
          />
        </Suspense>
      </AuthorizationFilter>
    )
  }

  return (
    <div className="WordsList__ListButtonsGroup">
      {buttonFlashcard}
      {exportDialect}
    </div>
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
              className="WordsList__colSort"
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
  columns,
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
      columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
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
          colSpan: columns.length + 1,
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
    ...columns,
  ]
}

// generateRowClick
// ------------------------------------
function generateRowClick({ rowClickHandler, columns }) {
  return [
    {
      name: 'rowClick',
      columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
      title: '',
      render: (cellValue, item) => {
        return (
          <FVButton
            type="button"
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              rowClickHandler(item)
            }}
          >
            Select
          </FVButton>
        )
      },
    },
    ...columns,
  ]
}

// getListSmallScreen
// Passing in arg (instead of defining them in the function) because
// getListSmallScreen is being exported and can be called from other
// components
// ------------------------------------
export function getListSmallScreen({ dictionaryListSmallScreenProps = {}, hasPagination = false, pageSize = 10 }) {
  let content = <DictionaryListSmallScreen {...dictionaryListSmallScreenProps} />
  if (hasPagination) {
    const DictionaryListSmallScreenWithPagination = withPagination(DictionaryListSmallScreen, pageSize)
    content = <DictionaryListSmallScreenWithPagination {...dictionaryListSmallScreenProps} />
  }
  return content
}

// getListLargeScreen
// ------------------------------------
function getListLargeScreen({ dictionaryListLargeScreenProps = {}, hasPagination = false, pageSize = 10 }) {
  let content = <DictionaryListLargeScreen {...dictionaryListLargeScreenProps} />
  if (hasPagination) {
    const DictionaryListLargeScreenWithPagination = withPagination(DictionaryListLargeScreen, pageSize)
    content = <DictionaryListLargeScreenWithPagination {...dictionaryListLargeScreenProps} />
  }
  return content
}

// ===============================================================

const { array, bool, func, instanceOf, number, object, oneOfType, string } = PropTypes
WordsListPresentation.propTypes = {
  // Pagination
  appendControls: array, // NOTE: array of elements to append just after the paging controls
  disablePageSize: bool, // NOTE: removes the "Page #/# Per page: <select> Results #" part of pagination
  fetcher: func, // TODO
  fetcherParams: object, // NOTE: object of paging data: currentPageIndex, pageSize, filters
  hasPagination: bool,
  metadata: object, // TODO
  // Export
  hasExportDialect: bool,
  exportDialectExportElement: string,
  exportDialectColumns: string,
  exportDialectLabel: string,
  exportDialectQuery: string,
  dialect: object, // NOTE: used to determine permissions with export dialect
  // Batch
  batchConfirmationAction: func,
  batchFooterBtnConfirm: string,
  batchFooterBtnDeny: string,
  batchFooterBtnInitiate: string,
  batchFooterIsConfirmOrDenyTitle: string,
  batchTitleDeselect: string,
  batchTitleSelect: string,
  // Misc WordsList
  columns: array.isRequired, // NOTE: Important prop. Defines table headers and how cells are rendered.
  computedData: object, // TODO: Define how this is used
  cssModifier: string, // TODO: DROP?
  dictionaryListSmallScreenTemplate: func, // NOTE: Overides generic template/layout used by DictionaryListSmallScreen
  dictionaryListClickHandlerViewMode: func, // NOTE: event handler for clicks on view mode buttons (eg: Flashcard)
  dictionaryListViewMode: number, // NOTE: can force a specific view mode with this prop (eg: always in VIEWMODE_LARGE_SCREEN)
  fields: instanceOf(Map), // TODO: DROP?
  filteredItems: oneOfType([array, instanceOf(List)]), // TODO: Confusing, DROP?. Alternate source of data for list.
  hasSorting: bool, // NOTE: can explicitly disable sorting if needed. EG: since we are reusing components, sometimes the `columns` prop will have a sort property within the data but where you are reusing the component it doesn't make sense to sort, `hasSorting={false}` would help you.
  hasViewModeButtons: bool, // NOTE: Toggles all of the view mode buttons (currently there is only Flashcard but there used to be more options)
  items: oneOfType([array, instanceOf(List)]), // NOTE: Important prop. Primary source of data (filteredItems is also used!)
  rowClickHandler: func, // NOTE: this list view is used in the browse mode where you can select items to add to other documents (eg: add a contributor to a word). This is the event handler for that action
  sortHandler: func, // NOTE: event handler for sort actions. If not defined, the url will be updated instead.
  style: object, // TODO: DROP?
  type: string, // TODO: DROP?
  wrapperStyle: object, // TODO: DROP?
  // <SearchDialect />
  handleSearch: func, // NOTE: After <SearchDialect /> updates search data in redux, this callback is called. TODO: could drop if all components are subscribed to Redux > Search updates.
  hasSearch: bool, // NOTE: Toggles the <SearchDialect /> component
  searchDialectDataType: number, // NOTE: tells SearchDialect what it's working with (eg: SEARCH_DATA_TYPE_WORD, SEARCH_DATA_TYPE_PHRASE). Used in preparing appropriate UI messages & form markup
  resetSearch: func, // NOTE: SearchDialect handles resetting (setting form back to initial state & updating redux), this is a followup callback after that happens
  searchUi: array, // NOTE: array of objects used to generate the search form elements (eg: inputs, selects, if they are checked, etc), this prop is used to reset to the initial state when 'Reset' search is pressed
  // REDUX: reducers/state
  routeParams: object, // NOTE: redux saved route params, using page & pageSize
  navigationRouteSearch: object, // NOTE: redux saved search settings, using sortOrder & sortBy. TODO: is this a logical spot for sort?
  pushWindowPath: func,
  setRouteParams: func,
}

WordsListPresentation.defaultProps = {
  // Export
  hasExportDialect: false,
  // Batch
  batchFooterBtnConfirm: 'Yes, delete the selected items',
  batchFooterBtnDeny: 'No, do not delete the selected items',
  batchFooterBtnInitiate: 'Delete',
  batchFooterIsConfirmOrDenyTitle: 'Delete selected?',
  batchTitleDeselect: 'Select all',
  batchTitleSelect: 'Deselect all',
  // WordsList
  columns: [],
  cssModifier: '',
  dictionaryListClickHandlerViewMode: () => {},
  // sortHandler: () => {},
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
  setRouteParams: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { listView } = state
  return {
    listView,
  }
}

export default connect(mapStateToProps)(WordsListPresentation)
