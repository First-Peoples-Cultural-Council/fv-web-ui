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
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'
import { setListViewMode } from 'providers/redux/reducers/listView'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import DialectFilterList from 'views/components/DialectFilterList'
import AlphabetListView from 'views/components/AlphabetListView'
import FVLabel from 'views/components/FVLabel/index'

import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'

import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_PHRASE_BOOK,
} from 'views/components/SearchDialect/constants'

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
  }
  static defaultProps = {
    searchDialectUpdate: () => {},
  }

  DIALECT_FILTER_TYPE = 'phrases'

  async componentDidMountViaPageDialectLearnBase() {
    const { routeParams } = this.props

    // Portal
    ProviderHelpers.fetchIfMissing(
      this.props.routeParams.dialect_path + '/Portal',
      this.props.fetchPortal,
      this.props.computePortal
    )

    // Document
    ProviderHelpers.fetchIfMissing(
      this.props.routeParams.dialect_path + '/Dictionary',
      this.props.fetchDocument,
      this.props.computeDocument
    )

    // Phrasebooks (Category)
    let phraseBooks = this.getPhraseBooks()
    if (phraseBooks === undefined) {
      await this.props.fetchCategories(
        '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children'
      )
      phraseBooks = this.getPhraseBooks()
    }

    // Alphabet
    // ---------------------------------------------
    let characters = this.getCharacters()

    if (characters === undefined) {
      const _pageIndex = 0
      const _pageSize = 100
      await this.props.fetchCharacters(
        `${routeParams.dialect_path}/Alphabet`,
        `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=asc&sortBy=fvcharacter:alphabet_order`
      )
      characters = this.getCharacters()
    }

    const newState = {
      characters,
      phraseBooks,
    }

    // Clear out filterInfo if not in url, eg: /learn/words/categories/[category]
    if (this.props.routeParams.phraseBook === undefined) {
      newState.filterInfo = this.initialFilterInfo()
    }

    this.setState(newState, () => {
      const letter = selectn('routeParams.letter', this.props)
      if (letter) {
        this.handleAlphabetClick(letter)
      }
    })
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
      {
        id: '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children',
        entity: this.props.computeCategories,
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
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { computeEntities, isKidsTheme } = this.state

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

    const { searchByMode } = this.props.computeSearchDialect

    const computePhraseBooksSize = selectn('response.entries.length', computePhraseBooks) || 0
    const dialect = selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) || ''
    const pageTitle = this.props.intl.trans(
      'views.pages.explore.dialect.phrases.x_phrases',
      `${dialect} Phrases`,
      null,
      [dialect]
    )
    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = this._getURLPageProps() // NOTE: This function is in PageDialectLearnBase
    const phraseListView = selectn('response.uid', computeDocument) ? (
      <PhraseListView
        controlViaURL
        DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
        DEFAULT_PAGE={DEFAULT_PAGE}
        disableClickItem={false}
        filter={this.state.filterInfo}
        flashcard={this.state.flashcardMode}
        flashcardTitle={pageTitle}
        onPagePropertiesChange={this._handlePagePropertiesChange} // NOTE: This function is in PageDialectLearnBase
        parentID={selectn('response.uid', computeDocument)}
        routeParams={this.props.routeParams}
        // Search:
        handleSearch={this.handleSearch}
        resetSearch={this.resetSearch}
        hasSearch
        searchUi={[
          {
            defaultChecked: true,
            idName: 'searchByTitle',
            labelText: 'Phrase',
          },
          {
            defaultChecked: true,
            idName: 'searchByDefinitions',
            labelText: 'Definitions',
          },
          {
            idName: 'searchByCulturalNotes',
            labelText: 'Cultural notes',
          },
        ]}
        searchByMode={searchByMode}
        rowClickHandler={this.props.rowClickHandler}
        hasSorting={this.props.hasSorting}
        dictionaryListClickHandlerViewMode={this.props.setListViewMode}
        dictionaryListViewMode={this.props.listView.mode}
      />
    ) : null

    // Render kids view
    if (isKidsTheme) {
      const pageSize = 4 // Items per Kids page
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
                    this._onNavigateRequest('create') // NOTE: This function is in PageDialectLearnBase
                  }
                }}
                className="PrintHide buttonRaised"
              >
                <FVLabel
                  transKey="views.pages.explore.dialect.phrases.create_new_phrase"
                  defaultStr="Create New Phrase"
                  transform="words"
                />
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3', 'PrintHide')}>
            <AlphabetListView
              characters={this.state.characters}
              dialectClassName={dialectClassName}
              handleClick={this.handleAlphabetClick}
              letter={selectn('routeParams.letter', this.props)}
            />
            {computePhraseBooksSize !== 0 && (
              <DialectFilterList
                appliedFilterIds={this.state.filterInfo.get('currentCategoryFilterIds')}
                // clearDialectFilter={this.clearDialectFilter} // TODO: NOT IN WORDS
                facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                  'fv-phrase:phrase_books',
                  this.props.routeParams.area
                )}
                facets={this.state.phraseBooks} // TODO: NOT IN WORDS
                handleDialectFilterClick={this.handlePhraseBookClick} // TODO: NOT IN WORDS
                handleDialectFilterList={this.handleDialectFilterList} // NOTE: This function is in PageDialectLearnBase
                routeParams={this.props.routeParams}
                title={this.props.intl.trans(
                  'views.pages.explore.dialect.learn.phrases.browse_by_phrase_books',
                  'Browse Phrase Books',
                  'words'
                )}
                type={this.DIALECT_FILTER_TYPE}
              />
            )}
          </div>
          <div className={classNames('col-xs-12', 'col-md-9')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>

            <div className={dialectClassName}>{phraseListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render

  changeFilter = (href, updateUrl = true) => {
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
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => {
      return searchNxqlQuery && searchNxqlQuery !== '' ? ` AND ${searchNxqlQuery}` : ''
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    this.setState({ filterInfo: newFilter }, () => {
      this._resetURLPagination({ preserveSearch: true }) // NOTE: This function is in PageDialectLearnBase
      // See about updating url
      if (href && updateUrl) {
        NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
      }
    })
  }

  clearDialectFilter = () => {
    this.setState({ filterInfo: this.initialFilterInfo() })
  }
  // NOTE: PageDialectLearnBase calls `fetchData`
  // NOTE: Providing an empty fn() so that PageDialectLearnBase doesn't complain.
  fetchData() {}

  getCharacters = () => {
    const { routeParams } = this.props
    const computedCharacters = ProviderHelpers.getEntry(
      this.props.computeCharacters,
      `${routeParams.dialect_path}/Alphabet`
    )
    return selectn('response.entries', computedCharacters)
  }

  getPhraseBooks = () => {
    const computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children'
    )
    return selectn('response.entries', computeCategories)
  }
  handleAlphabetClick = async (letter, href, updateHistory = true) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: letter,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByDefinitions: false,
        searchByTitle: true,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })

    this.changeFilter(href, updateHistory)
  }

  handlePhraseBookClick = async ({ facetField, selected, unselected, href } = {}, updateHistory = true) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_PHRASE_BOOK,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchingDialectFilter: selected.checkedFacetUid,
      searchTerm: '',
    })

    this.changeFilter(href, updateHistory)

    this.handleDialectFilterList(facetField, selected, unselected, this.DIALECT_FILTER_TYPE) // NOTE: This function is in PageDialectLearnBase
  }

  handleSearch = () => {
    this.changeFilter()
  }

  initialFilterInfo = () => {
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

  resetSearch = () => {
    let newFilter = this.state.filterInfo

    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
        // searchNxqlSort: 'dc:title', // TODO: IS THIS BREAKING SOMETHING?
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination() // NOTE: This function is in PageDialectLearnBase

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
  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey = () => {
    return this.props.routeParams.area + '_' + this.props.routeParams.dialect_name + '_learn_phrases'
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const {
    document,
    fvCategory,
    fvPortal,
    fvCharacter,
    listView,
    navigation,
    nuxeo,
    searchDialect,
    windowPath,
    locale,
  } = state

  const { computeCategories } = fvCategory
  const { computeCharacters } = fvCharacter
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { properties } = navigation
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCategories,
    computeCharacters,
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
    listView,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchCharacters,
  fetchDocument,
  fetchPortal,
  overrideBreadcrumbs,
  pushWindowPath,
  searchDialectUpdate,
  setListViewMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnPhrases)
