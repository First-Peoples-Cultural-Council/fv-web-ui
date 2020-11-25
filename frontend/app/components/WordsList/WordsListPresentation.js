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

import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import { List } from 'immutable'
import Media from 'react-media'

import useNavigationHelpers from 'common/useNavigationHelpers'
import { getIcon, getSortState, sortCol } from 'common/ListView'
import withPagination from 'components/withPagination'
import IntlService from 'common/services/IntlService'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenTemplateWords,
} from 'components/DictionaryList/DictionaryListSmallScreen'
import AuthorizationFilter from 'components/AuthorizationFilter'
import Link from 'components/Link'

import '!style-loader!css-loader!./WordsList.css'

const DictionaryListLargeScreen = React.lazy(() => import('components/DictionaryList/DictionaryListLargeScreen'))
const DictionaryListSmallScreen = React.lazy(() => import('components/DictionaryList/DictionaryListSmallScreen'))
const ExportDialect = React.lazy(() => import('components/ExportDialect'))
const FlashcardList = React.lazy(() => import('components/FlashcardList'))

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
 *
 */

function WordsListPresentation(props) {
  const {
    // hasExportDialect,
    childrenSearch,
    columns,
    dialect,
    dialectClassName,
    dictionaryListViewMode,
    exportDialectColumns,
    exportDialectExportElement,
    exportDialectLabel,
    exportDialectQuery,
    fetcher,
    fetcherParams,
    filter,
    hasPagination,
    hasSorting,
    hasViewModeButtons,
    hrefCreate,
    items,
    metadata,
    navigationRouteSearch,
    pageTitle,
    pushWindowPath,
    routeParams,
    rowClickHandler,
    setRouteParams,
    sortHandler,
    wordsListClickHandlerViewMode,
  } = props
  const { getSearchAsObject } = useNavigationHelpers()
  const intl = IntlService.instance
  const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }
  let columnsEnhanced = [...columns]

  // ============= SORT
  if (hasSorting) {
    // If window.location.search has sortOrder & sortBy,
    // Ensure the same values are in redux
    // before generating the sort markup
    const windowLocationSearch = getSearchAsObject()
    const windowLocationSearchSortOrder = windowLocationSearch.sortOrder
    const windowLocationSearchSortBy = windowLocationSearch.sortBy
    if (
      windowLocationSearchSortOrder &&
      windowLocationSearchSortBy &&
      (navigationRouteSearch.sortOrder !== windowLocationSearchSortOrder ||
        navigationRouteSearch.sortBy !== windowLocationSearchSortBy)
    ) {
      setRouteParams({
        search: {
          page: routeParams.page,
          pageSize: routeParams.pageSize,
          sortOrder: windowLocationSearchSortOrder,
          sortBy: windowLocationSearchSortBy,
        },
      })
    }

    columnsEnhanced = generateSortTitleLargeSmall({
      columns: columnsEnhanced,
      pageSize: routeParams.pageSize,
      sortOrder: navigationRouteSearch.sortOrder,
      sortBy: navigationRouteSearch.sortBy,
      navigationFunc: pushWindowPath,
      sortHandler: sortHandler,
    })
  }
  // ============= SORT

  // ============= ROWCLICK
  if (rowClickHandler) {
    columnsEnhanced = generateRowClick({
      rowClickHandler: rowClickHandler,
      columns: columnsEnhanced,
    })
  }
  // ============= ROWCLICK

  // ============= BATCH

  const noResults =
    selectn('length', items) === 0 ? (
      <div
        className={'WordsList WordsList--noData'}
        dangerouslySetInnerHTML={{
          __html: intl.translate({
            key: 'no_results_found_dictionary',
            default: 'No Results Found',
            case: 'title',
          }),
        }}
      />
    ) : null

  const listButtonArg = {
    // Export
    dialect,
    exportDialectColumns,
    exportDialectExportElement,
    exportDialectLabel,
    exportDialectQuery,
    // Commented out until export is fixed
    // hasExportDialect,
    // View mode
    clickHandlerViewMode: wordsListClickHandlerViewMode,
    dictionaryListViewMode,
    hasViewModeButtons,
  }

  const getListSmallScreenArg = {
    dictionaryListSmallScreenProps: {
      rowClickHandler,
      hasSorting,
      // withPagination
      // --------------------
      fetcher,
      fetcherParams,
      metadata,
      // List: small screen
      // --------------------
      columns: columnsEnhanced,
      items,
      dictionaryListSmallScreenTemplate: dictionaryListSmallScreenTemplateWords,
    },
    hasPagination,
    pageSize: DefaultFetcherParams.pageSize,
  }

  const getListLargeScreenArg = {
    dictionaryListLargeScreenProps: {
      rowClickHandler,
      hasSorting,
      // withPagination
      // --------------------
      fetcher,
      fetcherParams,
      metadata,
      // List: large screen
      // --------------------
      columns: columnsEnhanced,
      items,
    },

    hasPagination,
    pageSize: DefaultFetcherParams.pageSize,
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1 className="DialectPageTitle">{pageTitle}</h1>

        <AuthorizationFilter filter={filter} hideFromSections routeParams={routeParams}>
          <div id="CreateNewWord" className="text-right">
            <Link className="PrintHide" href={hrefCreate}>
              <FVLabel
                transKey="views.pages.explore.dialect.learn.words.create_new_word"
                defaultStr="Create New Word"
                transform="words"
              />
            </Link>
          </div>
        </AuthorizationFilter>
        <div className={dialectClassName}>
          {childrenSearch}
          {/* {chldrenListButtons} */}
          {generateListButtons(listButtonArg)}
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
              if (dictionaryListViewMode === VIEWMODE_FLASHCARD) {
                // TODO: SPECIFY FlashcardList PROPS
                let flashCards = <FlashcardList {...props} />
                if (hasPagination) {
                  const FlashcardsWithPagination = withPagination(FlashcardList, DefaultFetcherParams.pageSize)
                  flashCards = <FlashcardsWithPagination {...props} />
                }
                return flashCards
              }
              //  Small Screen Specified: by view mode button or prop
              // -----------------------------------------
              if (dictionaryListViewMode === VIEWMODE_SMALL_SCREEN) {
                return getListSmallScreen(getListSmallScreenArg)
              }
              //  Large Screen Specified: by prop
              // -----------------------------------------
              if (dictionaryListViewMode === VIEWMODE_LARGE_SCREEN) {
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
      </div>
    </Suspense>
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
        <ExportDialect
          exportDialectColumns={exportDialectColumns}
          exportDialectExportElement={exportDialectExportElement}
          exportDialectLabel={exportDialectLabel}
          exportDialectQuery={exportDialectQuery}
        />
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

const { array, bool, func, instanceOf, node, number, object, oneOfType, string } = PropTypes
WordsListPresentation.propTypes = {
  // Pagination
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
  // Misc WordsList
  columns: array.isRequired, // NOTE: Important prop. Defines table headers and how cells are rendered.
  dialectClassName: string,
  filter: object,
  handleCreateClick: func,
  smallScreenTemplate: func, // NOTE: Overides generic template/layout used by DictionaryListSmallScreen
  wordsListClickHandlerViewMode: func, // NOTE: event handler for clicks on view mode buttons (eg: Flashcard)
  dictionaryListViewMode: number, // NOTE: can force a specific view mode with this prop (eg: always in VIEWMODE_LARGE_SCREEN)
  hasSorting: bool, // NOTE: can explicitly disable sorting if needed. EG: since we are reusing components, sometimes the `columns` prop will have a sort property within the data but where you are reusing the component it doesn't make sense to sort, `hasSorting={false}` would help you.
  hasViewModeButtons: bool, // NOTE: Toggles all of the view mode buttons (currently there is only Flashcard but there used to be more options)
  items: oneOfType([array, instanceOf(List)]), // NOTE: Important prop. Primary source of data (filteredItems is also used!)
  pageTitle: string,
  rowClickHandler: func, // NOTE: this list view is used in the browse mode where you can select items to add to other documents (eg: add a contributor to a word). This is the event handler for that action
  sortHandler: func, // NOTE: event handler for sort actions. If not defined, the url will be updated instead.
  childrenSearch: node,
  // REDUX: reducers/state
  routeParams: object, // NOTE: redux saved route params, using page & pageSize
  navigationRouteSearch: object, // NOTE: redux saved search settings, using sortOrder & sortBy. TODO: is this a logical spot for sort?
  pushWindowPath: func,
  setRouteParams: func,
  hrefCreate: string,
}

WordsListPresentation.defaultProps = {
  // Export
  hasExportDialect: false,
  // WordsList
  columns: [],
  handleCreateClick: () => {},
  wordsListClickHandlerViewMode: () => {},
  // General List
  hasSorting: true,
  hasViewModeButtons: true,
}

export default WordsListPresentation
