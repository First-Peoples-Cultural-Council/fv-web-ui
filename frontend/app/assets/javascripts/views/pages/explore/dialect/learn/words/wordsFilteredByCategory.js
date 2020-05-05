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

// 3rd party
// -------------------------------------------
import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import Immutable, { is, Map, Set } from 'immutable'
import selectn from 'selectn'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { fetchWords } from 'providers/redux/reducers/fvWord'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'
import { setListViewMode } from 'providers/redux/reducers/listView'
import { setRouteParams, updatePageProperties } from 'providers/redux/reducers/navigation'

// FPCC
// -------------------------------------------
import AlphabetListView from 'views/components/AlphabetListView'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DialectFilterList from 'views/components/DialectFilterList'
import Edit from '@material-ui/icons/Edit'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import Link from 'views/components/Link'
import NavigationHelpers, { appendPathArrayAfterLandmark, getSearchObject } from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { initialState } from 'providers/redux/reducers/searchDialect/reducer'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenTemplateWords,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import {
  getCharacters,
  handleDialectFilterList,
  onNavigateRequest,
  sortHandler,
  updateFilter,
  updateUrlAfterResetSearch,
  updateUrlIfPageOrPageSizeIsDifferent,
  useIdOrPathFallback,
} from 'views/pages/explore/dialect/learn/base'
import {
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_PART_OF_SPEECH_ANY,
} from 'views/components/SearchDialect/constants'
import { WORKSPACES } from 'common/Constants'

const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))
const intl = IntlService.instance

// WordsFilteredByCategory
// ====================================================
class WordsFilteredByCategory extends Component {
  DEFAULT_SORT_COL = 'fv:custom_order' // NOTE: Used when paging
  DEFAULT_SORT_TYPE = 'asc'
  DIALECT_FILTER_TYPE = 'words'

  componentDidUpdate(prevProps) {
    const { routeParams: curRouteParams } = this.props
    const { routeParams: prevRouteParams } = prevProps
    if (
      curRouteParams.page !== prevRouteParams.page ||
      curRouteParams.pageSize !== prevRouteParams.pageSize ||
      curRouteParams.category !== prevRouteParams.category ||
      curRouteParams.area !== prevRouteParams.area
    ) {
      this.fetchListViewData({ pageIndex: curRouteParams.page, pageSize: curRouteParams.pageSize })
    }
  }

  async componentDidMount() {
    const { computeDocument, computePortal, routeParams } = this.props

    // Portal
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, this.props.fetchPortal, computePortal)
    // Document
    await ProviderHelpers.fetchIfMissing(
      `${routeParams.dialect_path}/Dictionary`,
      this.props.fetchDocument,
      computeDocument
    )

    // Alphabet
    // ---------------------------------------------
    let characters = getCharacters({
      computeCharacters: this.props.computeCharacters,
      routeParamsDialectPath: routeParams.dialect_path,
    })

    if (characters === undefined) {
      const _pageIndex = 0
      const _pageSize = 100

      await this.props.fetchCharacters(
        `${routeParams.dialect_path}/Alphabet`,
        `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=asc&sortBy=fvcharacter:alphabet_order`
      )
      characters = getCharacters({
        computeCharacters: this.props.computeCharacters,
        routeParamsDialectPath: routeParams.dialect_path,
      })
    }

    // WORDS
    // ---------------------------------------------
    this.fetchListViewData()

    this.setState(
      {
        characters,
      },
      () => {
        const letter = selectn('routeParams.letter', this.props)
        if (letter) {
          this.handleAlphabetClick(letter)
        }
      }
    )
  }

  componentWillUnmount() {
    this.props.searchDialectUpdate(initialState)
  }

  constructor(props, context) {
    super(props, context)

    const { computeDocument, computePortal, properties, routeParams } = props

    let filterInfo = this.initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn(
        [[`${routeParams.area}_${routeParams.dialect_name}_learn_words`], 'filterInfo'],
        properties.pageProperties
      )
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    const computeEntities = Immutable.fromJS([
      {
        id: routeParams.dialect_path,
        entity: computePortal,
      },
      {
        id: `${routeParams.dialect_path}/Dictionary`,
        entity: computeDocument,
      },
    ])

    this.state = {
      computeEntities,
      filterInfo,
      flashcardMode: false,
      isKidsTheme: routeParams.siteTheme === 'kids',
    }
  }

  render() {
    const { characters, computeEntities, filterInfo, isKidsTheme } = this.state

    const {
      computeDialect2,
      computeDocument,
      computeLogin,
      computePortal,
      computeWords,
      hasPagination,
      listView,
      routeParams,
      splitWindowPath,
    } = this.props

    const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const computedPortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const uid = selectn('response.uid', computedDocument)
    const computedWords = ProviderHelpers.getEntry(computeWords, uid)

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computedPortal) ||
      ''} ${intl.trans('words', 'Words', 'first')}`

    const computedDialect2Response = selectn('response', computedDialect2)
    const wordListView = selectn('response.uid', computedDocument) ? (
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryList
          dictionaryListClickHandlerViewMode={this.props.setListViewMode}
          dictionaryListViewMode={listView.mode}
          dictionaryListSmallScreenTemplate={dictionaryListSmallScreenTemplateWords}
          flashcardTitle={pageTitle}
          dialect={computedDialect2Response}
          // ==================================================
          // Search
          // --------------------------------------------------
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
          // ==================================================
          // Table data
          // --------------------------------------------------
          items={selectn('response.entries', computedWords)}
          columns={this.getColumns()}
          // ===============================================
          // Pagination
          // -----------------------------------------------
          hasPagination
          fetcher={({ currentPageIndex, pageSize }) => {
            const newUrl = appendPathArrayAfterLandmark({
              pathArray: [pageSize, currentPageIndex],
              splitWindowPath,
              landmarkArray: [routeParams.category],
            })
            NavigationHelpers.navigate(`/${newUrl}`, this.props.pushWindowPath)
          }}
          fetcherParams={{ currentPageIndex: routeParams.page, pageSize: routeParams.pageSize }}
          metadata={selectn('response', computedWords)}
          // ===============================================
          // Sort
          // -----------------------------------------------
          sortHandler={this._sortHandler}
          // ===============================================
        />
      </Suspense>
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
            <div className="col-xs-12 col-md-8 col-md-offset-2">{cloneWordListView}</div>
          </div>
        </PromiseWrapper>
      )
    }

    const dialectClassName = getDialectClassname(computedPortal)
    const facetField = ProviderHelpers.switchWorkspaceSectionKeys('fv-word:categories', routeParams.area)
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row row-create-wrapper">
          <div className="col-xs-12 col-md-4 col-md-offset-8 text-right">
            <AuthorizationFilter
              filter={{
                entity: selectn('response', computedDocument),
                login: computeLogin,
                role: ['Record', 'Approve', 'Everything'],
              }}
              hideFromSections
              routeParams={routeParams}
            >
              <button
                type="button"
                onClick={() => {
                  const url = appendPathArrayAfterLandmark({
                    pathArray: ['create'],
                    splitWindowPath,
                  })
                  if (url) {
                    NavigationHelpers.navigate(`/${url}`, this.props.pushWindowPath, false)
                  } else {
                    onNavigateRequest({
                      hasPagination,
                      path: 'create',
                      pushWindowPath: this.props.pushWindowPath,
                      splitWindowPath,
                    })
                  }
                }}
                className="PrintHide buttonRaised"
              >
                {intl.trans('views.pages.explore.dialect.learn.words.create_new_word', 'Create New Word', 'words')}
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-3 PrintHide">
            <AlphabetListView
              characters={characters}
              dialectClassName={dialectClassName}
              handleClick={this.handleAlphabetClick}
              letter={selectn('letter', routeParams)}
            />

            <CategoriesDataLayer>
              {({ categoriesData }) => {
                return (
                  <DialectFilterList
                    appliedFilterIds={new Set([routeParams.category])}
                    clearDialectFilter={this.clearDialectFilter}
                    facets={categoriesData}
                    // facets={categories}
                    facetField={facetField}
                    filterInfo={filterInfo}
                    handleDialectFilterClick={this.handleCategoryClick}
                    handleDialectFilterList={(
                      facetFieldParam,
                      selected,
                      unselected,
                      type,
                      shouldResetUrlPagination
                    ) => {
                      this.handleDialectFilterChange({
                        facetField: facetFieldParam,
                        selected,
                        type,
                        unselected,
                        routeParams: routeParams,
                        filterInfo: filterInfo,
                        shouldResetUrlPagination,
                      })
                    }}
                    routeParams={routeParams}
                    title={intl.trans(
                      'views.pages.explore.dialect.learn.words.browse_by_category',
                      'Browse Categories',
                      'words'
                    )}
                    type={this.DIALECT_FILTER_TYPE}
                  />
                )
              }}
            </CategoriesDataLayer>
          </div>
          <div className="col-xs-12 col-md-9">
            <h1 className="DialectPageTitle">{pageTitle}</h1>
            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render

  changeFilter = () => {
    const { filterInfo } = this.state
    const { computeSearchDialect, routeParams, splitWindowPath } = this.props
    const { searchByMode, searchNxqlQuery } = computeSearchDialect

    const newFilter = updateFilter({
      filterInfo,
      searchByMode,
      searchNxqlQuery,
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        // NOTE: `updateUrlIfPageOrPageSizeIsDifferent` below can trigger FW-256:
        // "Back button is not working properly when paginating within alphabet chars
        // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
        // You will be sent to the first page)"
        //
        // The above test (`is(...) === false`) prevents updates triggered by back or forward buttons
        // and any other unnecessary updates (ie: the filter didn't change)
        updateUrlIfPageOrPageSizeIsDifferent({
          // pageSize, // TODO ?
          preserveSearch: true,
          pushWindowPath: this.props.pushWindowPath,
          routeParams,
          splitWindowPath,
        })
      })
    }
  }

  clearDialectFilter = () => {
    this.setState({ filterInfo: this.initialFilterInfo() })
  }

  fetchListViewData({ pageIndex = 1, pageSize = 10 } = {}) {
    const { computeDocument, computeSearchDialect, navigationRouteSearch, routeParams } = this.props
    const { category, area } = routeParams
    let currentAppliedFilter = ''
    if (category) {
      // Private
      if (area === 'Workspaces') {
        currentAppliedFilter = ` AND fv-word:categories/* IN ("${category}")`
      }
      // Public
      if (area === 'sections') {
        currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${category}")`
      }
    }

    const searchObj = getSearchObject()
    // 1st: redux values, 2nd: url search query, 3rd: defaults
    const sortOrder = navigationRouteSearch.sortOrder || searchObj.sortOrder || this.DEFAULT_SORT_TYPE
    const sortBy = navigationRouteSearch.sortBy || searchObj.sortBy || this.DEFAULT_SORT_COL

    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const uid = useIdOrPathFallback({ id: selectn('response.uid', extractComputeDocument), routeParams })
    const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)

    let nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&enrichment=category_children`

    const letter = computeSearchDialect.searchByAlphabet || routeParams.letter

    if (letter) {
      nql = `${nql}&dialectId=${dialectUid}&letter=${letter}&starts_with_query=Document.CustomOrderQuery`
    } else {
      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
    }

    this.props.fetchWords(uid, nql)
  }

  getColumns = () => {
    const { computeDialect2, DEFAULT_LANGUAGE, computeLogin, routeParams } = this.props

    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const computedDialect2Response = selectn('response', computedDialect2)
    const columns = [
      {
        name: 'title',
        title: intl.trans('word', 'Word', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const isWorkspaces = routeParams.area === WORKSPACES
          const href = NavigationHelpers.generateUIDPath(routeParams.siteTheme, data, 'words')
          const hrefEdit = NavigationHelpers.generateUIDEditPath(routeParams.siteTheme, data, 'words')
          const hrefEditRedirect = `${hrefEdit}?redirect=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          )}`
          const editButton =
            isWorkspaces && hrefEdit ? (
              <AuthorizationFilter
                filter={{
                  entity: computedDialect2Response,
                  login: computeLogin,
                  role: ['Record', 'Approve', 'Everything'],
                }}
                hideFromSections
                routeParams={routeParams}
              >
                <FVButton
                  type="button"
                  variant="flat"
                  size="small"
                  component="a"
                  className="DictionaryList__linkEdit PrintHide"
                  href={hrefEditRedirect}
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(hrefEditRedirect, this.props.pushWindowPath, false)
                  }}
                >
                  <Edit title={intl.trans('edit', 'Edit', 'first')} />
                </FVButton>
              </AuthorizationFilter>
            ) : null
          return (
            <>
              <Link className="DictionaryList__link DictionaryList__link--indigenous" href={href}>
                {v}
              </Link>
              {editButton}
            </>
          )
        },
        sortName: 'fv:custom_order',
        sortBy: 'fv:custom_order',
      },
      {
        name: 'fv:definitions',
        title: intl.trans('definitions', 'Definitions', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
        render: (v, data, cellProps) => {
          return UIHelpers.generateOrderedListFromDataset({
            dataSet: selectn(`properties.${cellProps.name}`, data),
            extractDatum: (entry, i) => {
              if (entry.language === DEFAULT_LANGUAGE && i < 2) {
                return entry.translation
              }
              return null
            },
            classNameList: 'DictionaryList__definitionList',
            classNameListItem: 'DictionaryList__definitionListItem',
          })
        },
        sortName: 'fv:definitions/0/translation',
      },
      {
        name: 'related_audio',
        title: intl.trans('audio', 'Audio', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomAudio,
        render: (v, data, cellProps) => {
          const firstAudio = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
          if (firstAudio) {
            return (
              <Preview
                key={selectn('uid', firstAudio)}
                minimal
                tagProps={{ preload: 'none' }}
                styles={{ padding: 0 }}
                tagStyles={{ width: '100%', minWidth: '230px' }}
                expandedValue={firstAudio}
                type="FVAudio"
              />
            )
          }
        },
      },
      {
        name: 'related_pictures',
        width: 72,
        textAlign: 'center',
        title: intl.trans('picture', 'Picture', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data, cellProps) => {
          const firstPicture = selectn('contextParameters.word.' + cellProps.name + '[0]', data)
          if (firstPicture) {
            return (
              <img
                className="PrintHide itemThumbnail"
                key={selectn('uid', firstPicture)}
                src={UIHelpers.getThumbnail(firstPicture, 'Thumbnail')}
                alt=""
              />
            )
          }
        },
      },
      {
        name: 'fv-word:part_of_speech',
        title: intl.trans('part_of_speech', 'Part of Speech', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => selectn('contextParameters.word.part_of_speech', data),
        sortBy: 'fv-word:part_of_speech',
      },
    ]

    // NOTE: Append `categories` & `state` columns if on Workspaces
    if (routeParams.area === WORKSPACES) {
      columns.push({
        name: 'fv-word:categories',
        title: intl.trans('categories', 'Categories', 'first'),
        render: (v, data) => {
          return UIHelpers.generateDelimitedDatumFromDataset({
            dataSet: selectn('contextParameters.word.categories', data),
            extractDatum: (entry) => selectn('dc:title', entry),
          })
        },
      })

      columns.push({
        name: 'state',
        title: intl.trans('state', 'State', 'first'),
      })
    }

    return columns
  }

  handleAlphabetClick = async (letter, href) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: letter,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })

    this.changeFilter()

    NavigationHelpers.navigate(href, this.props.pushWindowPath)
  }

  handleCategoryClick = async ({ facetField, selected, unselected }) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CATEGORY,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchingDialectFilter: selected.checkedFacetUid,
      searchTerm: '',
    })

    this.changeFilter()

    this.handleDialectFilterChange({
      facetField,
      selected,
      type: this.DIALECT_FILTER_TYPE,
      unselected,
    })
  }

  handleDialectFilterChange = ({ facetField, selected, type, unselected, shouldResetUrlPagination }) => {
    const { filterInfo } = this.state
    const { routeParams, splitWindowPath } = this.props

    const newFilter = handleDialectFilterList({
      facetField,
      selected,
      type,
      unselected,
      routeParams,
      filterInfo,
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (shouldResetUrlPagination === true) {
      updateUrlIfPageOrPageSizeIsDifferent({
        // pageSize, // TODO ?
        // preserveSearch, // TODO ?
        pushWindowPath: this.props.pushWindowPath,
        routeParams: routeParams,
        splitWindowPath: splitWindowPath,
      })
    }

    this.setState({ filterInfo: newFilter })
  }

  handleSearch = () => {
    this.changeFilter()
  }

  initialFilterInfo = () => {
    const { routeParams } = this.props
    const routeParamsCategory = routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      routeParams.area
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
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
      },
      () => {
        updateUrlAfterResetSearch({
          routeParams: this.props.routeParams,
          splitWindowPath: this.props.splitWindowPath,
          pushWindowPath: this.props.pushWindowPath,
        })
      }
    )
  }
  _sortHandler = async ({ page, pageSize, sortBy, sortOrder } = {}) => {
    sortHandler({
      page,
      pageSize,
      sortBy,
      sortOrder,
      setRouteParams: this.props.setRouteParams,
      routeParams: this.props.routeParams,
      splitWindowPath: this.props.splitWindowPath,
      pushWindowPath: this.props.pushWindowPath,
    })
  }
}

// PROPTYPES
// -------------------------------------------
const { any, array, bool, func, object, string } = PropTypes
WordsFilteredByCategory.propTypes = {
  hasPagination: bool,
  DEFAULT_LANGUAGE: any, // TODO ?
  // REDUX: reducers/state
  computeCharacters: object.isRequired,
  computeDialect2: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  computeSearchDialect: object.isRequired,
  computeWords: object.isRequired,
  listView: object.isRequired,
  navigationRouteSearch: object.isRequired,
  properties: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  // fetchCategories: func.isRequired,
  fetchCharacters: func.isRequired,
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  fetchWords: func.isRequired,
  pushWindowPath: func.isRequired,
  searchDialectUpdate: func.isRequired,
  setListViewMode: func.isRequired,
  setRouteParams: func.isRequired,
  updatePageProperties: func.isRequired,
}
WordsFilteredByCategory.defaultProps = {
  DEFAULT_LANGUAGE: 'english',
}

// REDUX: reducers/state
// -------------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const {
    document,
    fvCharacter,
    fvDialect,
    fvPortal,
    fvWord,
    listView,
    navigation,
    nuxeo,
    searchDialect,
    windowPath,
  } = state

  const { computeCharacters } = fvCharacter
  const { computeDialect2 } = fvDialect
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { computeWords } = fvWord
  const { properties, route } = navigation
  const { splitWindowPath, _windowPath } = windowPath
  return {
    computeCharacters,
    computeDialect2,
    computeDocument,
    computeLogin,
    computePortal,
    computeSearchDialect,
    computeWords,
    listView,
    properties,
    navigationRouteSearch: route.search,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCharacters,
  fetchDocument,
  fetchPortal,
  fetchWords,
  pushWindowPath,
  searchDialectUpdate,
  setListViewMode,
  setRouteParams,
  updatePageProperties,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsFilteredByCategory)
