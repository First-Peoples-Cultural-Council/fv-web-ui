/* Copyright 2016 First People's Cultural Council

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
import React from 'react'
import PropTypes from 'prop-types'
import Immutable, { is, Set, Map } from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { setListViewMode } from 'providers/redux/reducers/listView'
import { searchDialectReset } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'

import AlphabetCharactersPresentation from 'views/components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'views/components/AlphabetCharacters/AlphabetCharactersData'

import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'
import DialectFilterListPresentation from 'views/components/DialectFilterList/DialectFilterListPresentation'
import CategoriesDataLayer from 'views/pages/explore/dialect/learn/words/categoriesDataLayer'

import FVLabel from 'views/components/FVLabel/index'

import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'

import { SEARCH_BY_ALPHABET, SEARCH_BY_CATEGORY } from 'views/components/SearchDialect/constants'

/**
 * Learn words
 */
class PageDialectLearnWords extends PageDialectLearnBase {
  componentDidMountViaPageDialectLearnBase() {
    // Clear out filterInfo if not in url, eg: /learn/words/categories/[category]
    if (this.props.routeParams.category === undefined) {
      this.setState({ filterInfo: this.initialFilterInfo() })
    }
  }
  componentWillUnmount() {
    this.props.searchDialectReset()
  }

  constructor(props, context) {
    super(props, context)

    let filterInfo = this.initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeDocument,
      },
    ])

    this.state = {
      computeEntities,
      filterInfo,
      flashcardMode: false,
      isKidsTheme: props.routeParams.siteTheme === 'kids',
    }

    // NOTE: Removing the following `this` binding can create subtle and hard to detect bugs
    // For example: After filtering by category, clicking through to an item detail triggers an error
    // due to `handleDialectFilterList` not being able to access `this.state.filterInfo`
    ;[
      '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handleFilterChange', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { computeEntities, filterInfo, isKidsTheme } = this.state

    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      this.props.routeParams.dialect_path + '/Dictionary'
    )
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    const dialect = selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) || ''
    const pageTitle = this.props.intl.trans('views.pages.explore.dialect.words.x_words', `${dialect} Words`, null, [
      dialect,
    ])

    const { searchNxqlSort = {} } = this.props.computeSearchDialect
    const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort
    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = this._getURLPageProps() // NOTE: This function is in PageDialectLearnBase

    const dialectId = selectn(
      'response.contextParameters.ancestry.dialect.uid',
      ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary')
    )
    const wordListView =
      selectn('response.uid', computeDocument) && dialectId ? (
        <WordListView
          controlViaURL
          DEFAULT_PAGE={DEFAULT_PAGE}
          DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
          DEFAULT_SORT_COL={DEFAULT_SORT_COL}
          DEFAULT_SORT_TYPE={DEFAULT_SORT_TYPE}
          disableClickItem={false}
          filter={filterInfo}
          flashcard={this.state.flashcardMode}
          flashcardTitle={pageTitle}
          parentID={selectn('response.uid', computeDocument)}
          dialectID={dialectId}
          routeParams={this.props.routeParams}
          // Search:
          handleSearch={this.handleSearch}
          resetSearch={this.resetSearch}
          hasSearch
          searchUi={[
            {
              defaultChecked: true,
              idName: 'searchByTitle',
              labelText: 'Word',
            },
            {
              defaultChecked: true,
              idName: 'searchByDefinitions',
              labelText: 'Definitions',
            },
            {
              idName: 'searchByTranslations',
              labelText: 'Literal translations',
            },
            {
              type: 'select',
              idName: 'searchPartOfSpeech',
              labelText: 'Parts of speech:',
            },
          ]}
          dictionaryListClickHandlerViewMode={this.props.setListViewMode}
          dictionaryListViewMode={this.props.listView.mode}
        />
      ) : null

    // Render kids or mobile view
    if (isKidsTheme) {
      const cloneWordListView = wordListView
        ? React.cloneElement(wordListView, {
            DEFAULT_PAGE_SIZE: 8,
            disablePageSize: true,
            filter: filterInfo.setIn(['currentAppliedFilter', 'kids'], ' AND fv:available_in_childrens_archive=1'),
            gridListView: true,
          })
        : null
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>{cloneWordListView}</div>
          </div>
        </PromiseWrapper>
      )
    }
    const dialectClassName = getDialectClassname(computePortal)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper')}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              filter={{
                entity: selectn('response', computeDocument),
                login: this.props.computeLogin,
                role: ['Record', 'Approve', 'Everything'],
              }}
              hideFromSections
              routeParams={this.props.routeParams}
            >
              <button
                type="button"
                onClick={() => {
                  const url = appendPathArrayAfterLandmark({
                    pathArray: ['create'],
                    splitWindowPath: this.props.splitWindowPath,
                  })
                  if (url) {
                    NavigationHelpers.navigate(`/${url}`, this.props.pushWindowPath, false)
                  } else {
                    this._onNavigateRequest('create') // NOTE: This function is in PageDialectLearnBase
                  }
                }}
                className="PrintHide buttonRaised"
              >
                <FVLabel
                  transKey="views.pages.explore.dialect.learn.words.create_new_word"
                  defaultStr="Create New Word"
                  transform="words"
                />
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3', 'PrintHide')}>
            <AlphabetCharactersData
              letterClickedCallback={({ href, updateHistory }) => {
                // Note: this changeFilter accepts an obj, other instances use multiple args
                this.changeFilter({ href, updateHistory })
              }}
            >
              {({ activeLetter, characters, generateAlphabetCharacterHref, letterClicked, splitWindowPath }) => {
                return (
                  <AlphabetCharactersPresentation
                    activeLetter={activeLetter}
                    characters={characters}
                    dialectClassName={dialectClassName}
                    generateAlphabetCharacterHref={generateAlphabetCharacterHref}
                    letterClicked={letterClicked}
                    splitWindowPath={splitWindowPath}
                  />
                )
              }}
            </AlphabetCharactersData>
            <CategoriesDataLayer fetchLatest>
              {({ categoriesData }) => {
                let categoriesDataLayerToRender = null
                if (categoriesData && categoriesData.length > 0) {
                  categoriesDataLayerToRender = (
                    <DialectFilterListData
                      appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                      setDialectFilterCallback={this.changeFilter}
                      facets={categoriesData}
                      facetType="category"
                      type="words"
                      workspaceKey="fv-word:categories"
                    >
                      {({ listItemData }) => {
                        return (
                          <DialectFilterListPresentation
                            title={this.props.intl.trans(
                              'views.pages.explore.dialect.learn.words.browse_by_category',
                              'Browse Categories',
                              'words'
                            )}
                            listItemData={listItemData}
                          />
                        )
                      }}
                    </DialectFilterListData>
                  )
                }
                return categoriesDataLayerToRender
              }}
            </CategoriesDataLayer>
          </div>
          <div className={classNames('col-xs-12', 'col-md-9')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>
            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render

  changeFilter = ({ href, updateUrl = true } = {}) => {
    const { searchByMode, searchNxqlQuery } = this.props.computeSearchDialect
    let searchType
    let newFilter = this.state.filterInfo
    // console.log({
    //   routeParamsLetter: this.props.routeParams.letter,
    // })
    switch (searchByMode) {
      case SEARCH_BY_ALPHABET: {
        searchType = 'startsWith'
        break
      }
      case SEARCH_BY_CATEGORY: {
        searchType = 'categories'
        break
      }
      default: {
        searchType = 'contains'
      }
    }

    // Remove all old settings...
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    // Add new search query
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => {
      return searchNxqlQuery && searchNxqlQuery !== '' ? ` AND ${searchNxqlQuery}` : ''
    })

    // NOTE: `_resetURLPagination` below can trigger FW-256:
    // "Back button is not working properly when paginating within alphabet chars
    // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
    // You will be sent to the first page)"
    //
    // The `is(...) === false` check prevents updates triggered by back or forward buttons
    // and any other unnecessary updates (ie: the filter didn't change)
    if (is(this.state.filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        if (updateUrl && !href) {
          this._resetURLPagination({ preserveSearch: true }) // NOTE: This function is in PageDialectLearnBase
        }
        // See about updating url
        if (href && updateUrl) {
          NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
        }
      })
    }
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  async fetchData() {
    const { dialect_path } = this.props.routeParams
    if (dialect_path) {
      const documentPath = `${this.props.routeParams.dialect_path}/Dictionary`
      const portalPath = `${this.props.routeParams.dialect_path}/Portal`

      const computeDocumentRequest = ProviderHelpers.getEntry(this.props.computeDocument, documentPath)
      if (selectn('action', computeDocumentRequest) !== 'FV_DOCUMENT_FETCH_START') {
        // Document
        await ProviderHelpers.fetchIfMissing(documentPath, this.props.fetchDocument, this.props.computeDocument)
      }

      const computePortalRequest = ProviderHelpers.getEntry(this.props.computePortal, portalPath)
      if (selectn('action', computePortalRequest) !== 'FV_PORTAL_FETCH_START') {
        // Portal
        await ProviderHelpers.fetchIfMissing(portalPath, this.props.fetchPortal, this.props.computePortal)
      }
    }
  }

  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey = () => {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_learn_words`
  }

  handleSearch = () => {
    this.changeFilter()
  }

  initialFilterInfo = () => {
    const routeParamsCategory = this.props.routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      this.props.routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: currentAppliedFilterCategories,
      }),
    })
  }

  resetSearch = () => {
    let newFilter = this.state.filterInfo
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFilter', new Map())

    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())

    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination() // NOTE: This function is in PageDialectLearnBase

        // Remove alphabet/category filter urls
        if (selectn('routeParams.category', this.props) || selectn('routeParams.letter', this.props)) {
          let resetUrl = `/${this.props.splitWindowPath.join('/')}`
          const _splitWindowPath = [...this.props.splitWindowPath]
          const learnIndex = _splitWindowPath.indexOf('learn')
          if (learnIndex !== -1) {
            _splitWindowPath.splice(learnIndex + 2)
            resetUrl = `/${_splitWindowPath.join('/')}`
          }

          NavigationHelpers.navigate(resetUrl, this.props.pushWindowPath, false)
        }
      }
    )
  }
}

// Proptypes
const { array, bool, func, object, string } = PropTypes
PageDialectLearnWords.propTypes = {
  hasPagination: bool,
  // REDUX: reducers/state
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  properties: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  overrideBreadcrumbs: func.isRequired,
  pushWindowPath: func.isRequired,
  replaceWindowPath: func.isRequired,
  searchDialectReset: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { document, fvPortal, listView, navigation, nuxeo, searchDialect, windowPath, locale } = state
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { properties } = navigation
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
    intl: intlService,
    listView,
    properties,
    routeParams: navigation.route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchPortal,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  setListViewMode,
  searchDialectReset,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnWords)
