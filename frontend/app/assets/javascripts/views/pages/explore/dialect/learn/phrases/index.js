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
import React from 'react'
import PropTypes from 'prop-types'
import Immutable, { Set, Map } from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { overrideBreadcrumbs, updatePageProperties } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import DialectFilterList from 'views/components/DialectFilterList'
import AlphabetListView from 'views/components/AlphabetListView'

import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import { isMobile } from 'react-device-detect'
import IntlService from 'views/services/intl'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'
// import SearchDialect from 'views/components/SearchDialect'
import {
  SEARCH_SORT_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_PHRASE_BOOK,
} from 'views/components/SearchDialect/constants'

const intl = IntlService.instance

const { array, bool, func, object, string } = PropTypes
/**
 * Learn phrases
 */
export class PageDialectLearnPhrases extends PageDialectLearnBase {
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
    searchDialectUpdate: func,
    updatePageProperties: func.isRequired,
  }
  static defaultProps = {
    searchDialectUpdate: () => {},
  }

  DIALECT_FILTER_TYPE = 'phrases'

  componentDidMountViaPageDialectLearnBase() {
    const letter = selectn('routeParams.letter', this.props)
    if (letter) {
      this.handleAlphabetClick(letter)
    }
  }

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
        id: this.props.routeParams.dialect_path,
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeDocument,
      },
      {
        id: '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children',
        entity: this.props.computeCategories,
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
      'handleAlphabetClick',
      'handleSearch',
      'handlePhraseBookClick',
      'resetSearch',
      'changeFilter',
      'clearDialectFilter',
      '_initialFilterInfo',
      '_onNavigateRequest',
      '_getPageKey',
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
      '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const {
      computeEntities,
      // filterInfo,
      isKidsTheme,
      searchByMode,
      // searchByAlphabet,
      // searchingDialectFilter,
      // searchByDefinitions,
      // searchByTitle,
      // searchByTranslations,
      // searchTerm,
      // searchPartOfSpeech,

      // searchByCulturalNotes,
    } = this.state
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      this.props.routeParams.dialect_path + '/Dictionary'
    )
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )
    const computePhraseBooks = ProviderHelpers.getEntry(
      this.props.computeCategories,
      '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children'
    )

    const computePhraseBooksSize = selectn('response.entries.length', computePhraseBooks) || 0
    const dialect = selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) || ''
    const pageTitle = intl.trans('views.pages.explore.dialect.phrases.x_phrases', `${dialect} Phrases`, null, [dialect])
    const phraseListView = selectn('response.uid', computeDocument) ? (
      <PhraseListView
        controlViaURL
        disableClickItem={false}
        filter={this.state.filterInfo}
        flashcard={this.state.flashcardMode}
        flashcardTitle={pageTitle}
        onPagePropertiesChange={this._handlePagePropertiesChange}
        onPaginationReset={this._resetURLPagination}
        parentID={selectn('response.uid', computeDocument)}
        routeParams={this.props.routeParams}
        {...this._getURLPageProps()}
        // Search:
        handleSearch={this.handleSearch}
        resetSearch={this.resetSearch}
        hasSearch
        searchUi={[
          {
            defaultChecked: true,
            idName: 'searchByTitle',
            title: 'Phrase',
          },
          {
            idName: 'searchByDefinitions',
            title: 'Definitions',
          },
          {
            idName: 'searchByCulturalNotes',
            title: 'Cultural notes',
          },
        ]}
        searchByMode={searchByMode}
      />
    ) : (
      <div />
    )

    // Render kids view
    if (isKidsTheme || isMobile) {
      let pageSize = 4 // Items per Kids page

      // Mobile but not Kids
      if (!isKidsTheme && isMobile) {
        pageSize = 10 // Items per page for mobile, but not Kids
      }

      const kidsFilter = this.state.filterInfo.setIn(
        ['currentAppliedFilter', 'kids'],
        ' AND fv:available_in_childrens_archive=1'
      )

      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row">
            <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>
              {React.cloneElement(phraseListView, {
                gridListView: true,
                gridCols: 2,
                DEFAULT_PAGE_SIZE: pageSize,
                filter: kidsFilter,
              })}
            </div>
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
              hideFromSections
              routeParams={this.props.routeParams}
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computeDocument),
                login: this.props.computeLogin,
              }}
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
                {intl.trans('views.pages.explore.dialect.phrases.create_new_phrase', 'Create New Phrase', 'words')}
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div
            className={classNames('col-xs-12', 'col-md-3', computePhraseBooksSize === 0 ? 'hidden' : null, 'PrintHide')}
          >
            <AlphabetListView
              dialect={selectn('response', computePortal)}
              handleClick={this.handleAlphabetClick}
              letter={this.state.searchByAlphabet}
            />

            <DialectFilterList
              type={this.DIALECT_FILTER_TYPE}
              title={intl.trans(
                'views.pages.explore.dialect.learn.phrases.browse_by_phrase_books',
                'Browse Phrase Books',
                'words'
              )}
              appliedFilterIds={this.state.filterInfo.get('currentCategoryFilterIds')}
              facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                'fv-phrase:phrase_books',
                this.props.routeParams.area
              )}
              facets={selectn('response.entries', computePhraseBooks) || []}
              routeParams={this.props.routeParams}
              handleDialectFilterClick={this.handlePhraseBookClick}
              handleDialectFilterList={this.handleDialectFilterList} // NOTE: Comes from PageDialectLearnBase
              clearDialectFilter={this.clearDialectFilter}
            />
          </div>
          <div className={classNames('col-xs-12', computePhraseBooksSize === 0 ? 'col-md-12' : 'col-md-9')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>

            {/* <SearchDialect
              filterInfo={filterInfo}
              handleSearch={this.handleSearch}
              resetSearch={this.resetSearch}
              // Phrase specific
              isSearchingPhrases
              searchByCulturalNotes={searchByCulturalNotes}
              // Phrase & Word
              searchByAlphabet={searchByAlphabet}
              searchByDefinitions={searchByDefinitions}
              searchByMode={searchByMode}
              searchByTitle={searchByTitle}
              searchByTranslations={searchByTranslations}
              searchingDialectFilter={searchingDialectFilter}
              searchPartOfSpeech={searchPartOfSpeech}
              searchTerm={searchTerm}
              flashcardMode={this.state.flashcardMode}
            /> */}

            <div className={dialectClassName}>{phraseListView}</div>
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
    const routeParamsCategory = this.props.routeParams.phraseBook
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-phrase:phrase_books',
      this.props.routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        phraseBook: currentAppliedFilterCategories,
      }),
    })
  }

  handleSearch() {
    this.changeFilter()
  }

  handleAlphabetClick(letter, href, updateHistory = true) {
    this.props.searchDialectUpdate({
      searchTerm: '',
      searchByAlphabet: letter,
      searchByMode: SEARCH_BY_ALPHABET,
      searchByTitle: true,
      searchByDefinitions: false,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
    })

    this.changeFilter(href, updateHistory)
  }

  handlePhraseBookClick(obj, updateHistory = true) {
    const { facetField, selected, unselected, href } = obj
    this.props.searchDialectUpdate({
      searchTerm: '',
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_PHRASE_BOOK,
      searchingDialectFilter: selected.checkedFacetUid,
      searchByTitle: true,
      searchByDefinitions: false,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
    })

    this.changeFilter(href, updateHistory)

    this.handleDialectFilterList(facetField, selected, unselected, this.DIALECT_FILTER_TYPE)
  }

  resetSearch() {
    let newFilter = this.state.filterInfo

    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
        // searchNxqlSort: 'fv:custom_order',
        searchNxqlSort: 'dc:title',
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination()

        // TODO: REMOVE CATEGORY?

        // Remove alphabet/category filter urls
        if (selectn('routeParams.phraseBook', this.props) || selectn('routeParams.letter', this.props)) {
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

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Portal',
      newProps.fetchPortal,
      newProps.computePortal
    )
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Dictionary',
      newProps.fetchDocument,
      newProps.computeDocument
    )
    ProviderHelpers.fetchIfMissing(
      '/api/v1/path/' + newProps.routeParams.dialect_path + '/Phrase Books/@children',
      newProps.fetchCategories,
      newProps.computeCategories
    )
  }

  changeFilter(href, updateUrl = true) {
    const { searchByMode, searchNxqlQuery } = this.props.computeSearchDialect
    let searchType
    let newFilter = this.state.filterInfo

    switch (searchByMode) {
      case SEARCH_BY_ALPHABET: {
        searchType = 'startsWith'
        break
      }
      case SEARCH_BY_PHRASE_BOOK: {
        searchType = 'phraseBook'
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
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => ` AND ${searchNxqlQuery}`)

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    this.setState({ filterInfo: newFilter }, () => {
      this._resetURLPagination()
      // See about updating url
      if (href && updateUrl) {
        NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
      }
    })
  }
  _getPageKey() {
    return this.props.routeParams.area + '_' + this.props.routeParams.dialect_name + '_learn_phrases'
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvCategory, fvPortal, navigation, nuxeo, searchDialect, windowPath } = state

  const { computeCategories } = fvCategory
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { properties } = navigation
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCategories,
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
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
  searchDialectUpdate,
  updatePageProperties,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectLearnPhrases)
