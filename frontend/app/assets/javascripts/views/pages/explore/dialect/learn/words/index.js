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
import Immutable, { Set, Map, is } from 'immutable'

import classNames from 'classnames'
import { isMobile } from 'react-device-detect'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { overrideBreadcrumbs, updatePageProperties } from 'providers/redux/reducers/navigation'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import SearchDialect from 'views/components/SearchDialect'
import {
  SEARCH_SORT_DEFAULT,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
} from 'views/components/SearchDialect/constants'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DialectFilterList from 'views/components/DialectFilterList'
import IntlService from 'views/services/intl'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'
import AlphabetListView from 'views/components/AlphabetListView'
// import ExportDialect from 'views/components/ExportDialect'

const intl = IntlService.instance

const { array, bool, func, object, string } = PropTypes
class PageDialectLearnWords extends PageDialectLearnBase {
  static propTypes = {
    hasPagination: bool,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeCategories: object.isRequired,
    computeDocument: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updatePageProperties: func.isRequired,
  }

  componentDidMountViaPageDialectLearnBase() {
    // const category = selectn('routeParams.category', this.props)
    // if (category) {
    //   this.setState({
    //     selectedCategory: category,
    //   })
    // }
    const letter = selectn('routeParams.letter', this.props)
    if (letter) {
      this.handleAlphabetClick(letter)
    }
  }

  DIALECT_FILTER_TYPE = 'words'

  constructor(props, context) {
    super(props, context)

    let filterInfo = this._initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    const computeEntities = Immutable.fromJS([
      {
        id: props.routeParams.dialect_path,
        entity: props.computePortal,
      },
      {
        id: `${props.routeParams.dialect_path}/Dictionary`,
        entity: props.computeDocument,
      },
      {
        id: `/api/v1/path/FV/${props.routeParams.area}/SharedData/Shared Categories/@children`,
        entity: props.computeCategories,
      },
    ])

    this.state = {
      filterInfo,
      searchTerm: '',
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_DEFAULT,
      searchingDialectFilter: undefined,
      searchByDefinitions: true,
      searchByTitle: true,
      searchByTranslations: false,
      searchNxqlQuery: '',
      searchNxqlSort: {},
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
      computeEntities,
      isKidsTheme: props.routeParams.siteTheme === 'kids',
      flashcardMode: false,
    }

    // Bind methods to 'this'
    ;[
      'changeFilter',
      'clearDialectFilter',
      'handleAlphabetClick',
      'handleCategoryClick',
      'handleSearch',
      'resetSearch',
      'updateState',
      '_getPageKey',
      '_initialFilterInfo',
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
      '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handleFilterChange', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const {
      computeEntities,
      filterInfo,
      isKidsTheme,
      searchNxqlSort,
      searchByMode,
      searchByAlphabet,
      searchingDialectFilter,
      searchByDefinitions,
      searchByTitle,
      searchByTranslations,
      searchTerm,
      searchPartOfSpeech,
    } = this.state
    const { routeParams } = this.props
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Dictionary`
    )

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
    )
    const computeCategoriesSize = selectn('response.entries.length', computeCategories) || 0

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      ''} ${intl.trans('words', 'Words', 'first')}`

    const wordListView = selectn('response.uid', computeDocument) ? (
      <WordListView
        disableClickItem={false}
        controlViaURL
        DEFAULT_PAGE_SIZE={10}
        filter={filterInfo}
        parentID={selectn('response.uid', computeDocument)}
        renderSimpleTable
        routeParams={this.props.routeParams}
        // NOTE: PageDialectLearnBase provides `_getURLPageProps`
        {...this._getURLPageProps()}
        {...searchNxqlSort}
        flashcard={this.state.flashcardMode}
        flashcardTitle={pageTitle}
      />
    ) : null

    // Render kids or mobile view
    if (isKidsTheme || isMobile) {
      const cloneWordListView = wordListView
        ? React.cloneElement(wordListView, {
            DEFAULT_PAGE_SIZE: !isKidsTheme && isMobile ? 10 : 8,
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
                    // fallback, fn() from PageDialectLearnBase
                    this._onNavigateRequest('create')
                  }
                }}
                className="buttonRaised"
              >
                {intl.trans('views.pages.explore.dialect.learn.words.create_new_word', 'Create New Word', 'words')}
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div
            className={classNames('col-xs-12', 'col-md-3', computeCategoriesSize === 0 ? 'hidden' : null, 'PrintHide')}
          >
            <div>
              {/* <ExportDialect dialectId={fvaDialectId} /> */}

              <AlphabetListView
                dialect={selectn('response', computePortal)}
                handleClick={this.handleAlphabetClick}
                letter={this.state.searchByAlphabet}
              />

              <DialectFilterList
                type={this.DIALECT_FILTER_TYPE}
                title={intl.trans(
                  'views.pages.explore.dialect.learn.words.browse_by_category',
                  'Browse Categories',
                  'words'
                )}
                appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                  'fv-word:categories',
                  this.props.routeParams.area
                )}
                handleDialectFilterClick={this.handleCategoryClick}
                handleDialectFilterList={this.handleDialectFilterList} // NOTE: Comes from PageDialectLearnBase
                facets={selectn('response.entries', computeCategories) || []}
                clearDialectFilter={this.clearDialectFilter}
                routeParams={this.props.routeParams}
              />
            </div>
          </div>
          <div className={classNames('col-xs-12', computeCategoriesSize === 0 ? 'col-md-12' : 'col-md-9')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>

            <SearchDialect
              filterInfo={filterInfo}
              handleSearch={this.handleSearch}
              resetSearch={this.resetSearch}
              searchByAlphabet={searchByAlphabet}
              searchByDefinitions={searchByDefinitions}
              searchByMode={searchByMode}
              searchByTitle={searchByTitle}
              searchByTranslations={searchByTranslations}
              searchingDialectFilter={searchingDialectFilter}
              searchPartOfSpeech={searchPartOfSpeech}
              searchTerm={searchTerm}
              updateAncestorState={this.updateState}
              flashcardMode={this.state.flashcardMode}
            />

            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render

  clearDialectFilter() {
    this.setState({ filterInfo: this._initialFilterInfo() })
  }

  _initialFilterInfo = () => {
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

  handleSearch() {
    this.changeFilter()
  }

  resetSearch() {
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
        searchNxqlSort: 'fv:custom_order',
        //searchNxqlSort: 'dc:title',
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination()

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

  updateState(stateObj) {
    this.setState(stateObj)
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    /*
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Portal', // key
      newProps.fetchPortal, // action
      newProps.computePortal // reducer
    )
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Dictionary', // key
      newProps.fetchDocument, // action
      newProps.computeDocument
    )
    ProviderHelpers.fetchIfMissing(
      '/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children', // key
      newProps.fetchCategories, // action
      newProps.computeCategories
    )
    */

    // action(key);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary')
    newProps.fetchCategories('/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children')
  }

  changeFilter(href, updateUrl = true) {
    const { searchByMode, searchNxqlQuery } = this.state
    let searchType
    let newFilter = this.state.filterInfo

    switch (searchByMode) {
      case SEARCH_BY_ALPHABET: {
        searchType = 'startsWith'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
        // newFilter = newFilter.set('currentCategoryFilterIds', new Set())
        break
      }
      case SEARCH_BY_CATEGORY: {
        searchType = 'categories'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        break
      }
      default: {
        searchType = 'contains'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
        // newFilter = newFilter.set('currentCategoryFilterIds', new Set())
      }
    }

    // Remove all old settings...
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    // Add new search query
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => ` AND ${searchNxqlQuery}`)

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(this.state.filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        // NOTE: `_resetURLPagination` below can trigger FW-256:
        // "Back button is not working properly when paginating within alphabet chars
        // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
        // You will be sent to the first page)"
        //
        // The above test (`is(...) === false`) prevents updates triggered by back or forward buttons
        // and any other unnecessary updates (ie: the filter didn't change)
        this._resetURLPagination()
        // See about updating url
        if (href && updateUrl) {
          NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
        }
      })
    }
  }

  handleAlphabetClick(letter, href, updateHistory = true) {
    this.setState(
      {
        searchTerm: '',
        searchByAlphabet: letter,
        searchByMode: SEARCH_BY_ALPHABET,
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_SORT_DEFAULT,
      },
      () => {
        this.changeFilter(href, updateHistory)
      }
    )
  }

  handleCategoryClick(obj, updateHistory = true) {
    const { facetField, selected, unselected, href } = obj

    this.setState(
      {
        searchTerm: '',
        searchByAlphabet: '',
        searchByMode: SEARCH_BY_CATEGORY,
        searchingDialectFilter: selected.checkedFacetUid,
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_SORT_DEFAULT,
      },
      () => {
        this.changeFilter(href, updateHistory)

        this.handleDialectFilterList(facetField, selected, unselected, this.DIALECT_FILTER_TYPE)
      }
    )
  }

  _getPageKey() {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_learn_words`
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvCategory, fvPortal, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeCategories } = fvCategory
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCategories,
    computeDocument,
    computeLogin,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchDocument,
  fetchPortal,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  updatePageProperties,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectLearnWords)
