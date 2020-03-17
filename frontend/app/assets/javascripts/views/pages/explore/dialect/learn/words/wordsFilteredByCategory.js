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
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { fetchWords } from 'providers/redux/reducers/fvWord'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'
import { setListViewMode } from 'providers/redux/reducers/listView'
import { setRouteParams } from 'providers/redux/reducers/navigation'
import { updatePageProperties } from 'providers/redux/reducers/navigation'

// MISC
import Immutable, { is, Map, Set } from 'immutable'
import selectn from 'selectn'

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
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import {
  onNavigateRequest,
  handleDialectFilterList,
  updateUrlIfPageOrPageSizeIsDifferent,
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
    const { routeParams } = this.props

    // Portal
    ProviderHelpers.fetchIfMissing(
      routeParams.dialect_path + '/Portal',
      this.props.fetchPortal,
      this.props.computePortal
    )
    // Document
    ProviderHelpers.fetchIfMissing(
      routeParams.dialect_path + '/Dictionary',
      this.props.fetchDocument,
      this.props.computeDocument
    )

    // Category
    let categories = this.getCategories()
    if (categories === undefined) {
      await this.props.fetchCategories(
        '/api/v1/path/FV/' + routeParams.area + '/SharedData/Shared Categories/@children'
      )
      categories = this.getCategories()
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

    // WORDS
    // ---------------------------------------------
    this.fetchListViewData()

    this.setState(
      {
        characters,
        categories,
      },
      () => {
        const letter = selectn('routeParams.letter', this.props)
        if (letter) {
          this.handleAlphabetClick(letter)
        }
      }
    )
  }

  fetchListViewData({ pageIndex = 1, pageSize = 10 } = {}) {
    const searchObj = getSearchObject()

    // 1st: redux values, 2nd: url search query, 3rd: defaults
    const sortOrder = this.props.navigationRouteSearch.sortOrder || searchObj.sortOrder || this.DEFAULT_SORT_TYPE
    const sortBy = this.props.navigationRouteSearch.sortBy || searchObj.sortBy || this.DEFAULT_SORT_COL

    const { routeParams } = this.props
    const currentAppliedFilter = routeParams.category ? ` AND fv-word:categories/* IN ("${routeParams.category}")` : ''
    /*
    let currentAppliedFilter = ''
    if (this.state.filterInfo.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(this.state.filterInfo.get('currentAppliedFilter').toJS()).join('')
    }

    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    */
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)
    const nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&enrichment=category_children${startsWithQuery}`

    this.props.fetchWords(`${this.props.routeParams.dialect_path}/Dictionary`, nql)
  }

  constructor(props, context) {
    super(props, context)

    let filterInfo = this.initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this.getPageKey()], 'filterInfo'], props.properties.pageProperties)
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
      computeEntities,
      filterInfo,
      flashcardMode: false,
      isKidsTheme: props.routeParams.siteTheme === 'kids',
    }
  }

  render() {
    const { computeEntities, filterInfo, isKidsTheme } = this.state
    const {
      computeDialect2,
      computeDocument,
      computeLogin,
      computePortal,
      computeWords,
      DEFAULT_LANGUAGE,
      hasPagination,
      listView,
      routeParams,
      splitWindowPath,
    } = this.props

    const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const computedPortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const uid = `${routeParams.dialect_path}/Dictionary`
    const computedWords = ProviderHelpers.getEntry(computeWords, uid)

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computedPortal) ||
      ''} ${intl.trans('words', 'Words', 'first')}`

    const computedDialect2Response = selectn('response', computedDialect2)
    const wordListView = selectn('response.uid', computedDocument) ? (
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryList
          //   // Export
          //   exportDialectColumns={props.exportDialectColumns}
          //   exportDialectExportElement={props.exportDialectExportElement}
          //   exportDialectLabel={props.exportDialectLabel}
          //   exportDialectQuery={props.exportDialectQuery}
          //   hasExportDialect={props.hasExportDialect}
          //   // Listview
          //   data={props.data}
          //   hasFlashcard={props.flashcard}
          //   hasViewModeButtons={props.hasViewModeButtons}
          //   rowClickHandler={props.rowClickHandler}
          dictionaryListClickHandlerViewMode={this.props.setListViewMode}
          dictionaryListViewMode={listView.mode}
          //   dictionaryListSmallScreenTemplate={props.dictionaryListSmallScreenTemplate}
          //   // Listview: Batch
          //   batchConfirmationAction={props.batchConfirmationAction}
          //   batchTitleSelect={props.batchTitleSelect}
          //   batchTitleDeselect={props.batchTitleDeselect}
          //   batchFooterIsConfirmOrDenyTitle={props.batchFooterIsConfirmOrDenyTitle}
          //   batchFooterBtnInitiate={props.batchFooterBtnInitiate}
          //   batchFooterBtnDeny={props.batchFooterBtnDeny}
          //   batchFooterBtnConfirm={props.batchFooterBtnConfirm}
          //   batchSelected={props.batchSelected}
          //   setBatchSelected={props.setBatchSelected}
          //   batchDeletedUids={props.batchDeletedUids}
          //   setBatchDeletedUids={props.setBatchDeletedUids}
          //   // Listview: computed data
          //   computedData={props.computedData}
          // Search
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
          //   searchByMode={props.searchByMode}
          //   searchDialectDataType={props.searchDialectDataType}
          //   // ==================================================
          //   cellHeight={160}
          //   cols={props.gridCols}
          columns={[
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
            {
              name: 'dc:modified',
              width: 210,
              title: intl.trans('date_modified', 'Date Modified'),
              render: (v, data) => {
                return StringHelpers.formatUTCDateString(selectn('lastModified', data))
              },
            },
            {
              name: 'dc:created',
              width: 210,
              title: intl.trans('date_created', 'Date Created'),
              render: (v, data) => {
                return StringHelpers.formatUTCDateString(selectn('properties.dc:created', data))
              },
            },
            {
              name: 'fv-word:categories',
              title: intl.trans('categories', 'Categories', 'first'),
              render: (v, data) => {
                return UIHelpers.generateDelimitedDatumFromDataset({
                  dataSet: selectn('contextParameters.word.categories', data),
                  extractDatum: (entry) => selectn('dc:title', entry),
                })
              },
            },
          ]}
          //   // cssModifier={props.cssModifier}
          dialect={computedDialect2Response}
          // ===============================================
          // Pagination
          // -----------------------------------------------
          // disablePageSize={props.disablePageSize}
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
          flashcardTitle={pageTitle}
          //   gridListTile={props.gridListTile}
          items={selectn('response.entries', computedWords)}
          //   style={{ overflowY: 'auto', maxHeight: '50vh' }}
          //   type={props.type}
          //
          // ===============================================
          // Sort
          // -----------------------------------------------
          sortHandler={this.sortHandler}
          //   hasSorting={props.hasSorting}
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
                    // this._onNavigateRequest('create') // NOTE: This function is in PageDialectLearnBase
                    onNavigateRequest({
                      hasPagination: hasPagination,
                      path: 'create',
                      pushWindowPath: this.props.pushWindowPath,
                      splitWindowPath: splitWindowPath,
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
              characters={this.state.characters}
              dialectClassName={dialectClassName}
              handleClick={this.handleAlphabetClick}
              letter={selectn('letter', routeParams)}
            />

            <DialectFilterList
              type={this.DIALECT_FILTER_TYPE}
              title={intl.trans(
                'views.pages.explore.dialect.learn.words.browse_by_category',
                'Browse Categories',
                'words'
              )}
              filterInfo={filterInfo}
              // appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
              appliedFilterIds={new Set([routeParams.category])}
              facetField={facetField}
              handleDialectFilterClick={this.handleCategoryClick}
              handleDialectFilterList={(facetFieldParam, selected, unselected, type, shouldResetUrlPagination) => {
                this.handleDialectFilterChange({
                  facetField: facetFieldParam,
                  selected,
                  type,
                  unselected,
                  routeParams: routeParams,
                  filterInfo: this.state.filterInfo,
                  shouldResetUrlPagination,
                })
              }}
              facets={this.state.categories}
              clearDialectFilter={this.clearDialectFilter}
              routeParams={routeParams}
            />
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
    const { computeSearchDialect, routeParams, splitWindowPath } = this.props
    const { searchByMode, searchNxqlQuery } = computeSearchDialect
    let searchType
    let newFilter = this.state.filterInfo

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

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(this.state.filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        // NOTE: `updateUrlIfPageOrPageSizeIsDifferent` below can trigger FW-256:
        // "Back button is not working properly when paginating within alphabet chars
        // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
        // You will be sent to the first page)"
        //
        // The above test (`is(...) === false`) prevents updates triggered by back or forward buttons
        // and any other unnecessary updates (ie: the filter didn't change)
        updateUrlIfPageOrPageSizeIsDifferent({
          // pageSize, // TODO?
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

  getCategories = () => {
    const { routeParams } = this.props
    const computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
    )
    return selectn('response.entries', computeCategories)
  }

  getCharacters = () => {
    const { computeCharacters, routeParams } = this.props
    const computedCharacters = ProviderHelpers.getEntry(computeCharacters, `${routeParams.dialect_path}/Alphabet`)
    return selectn('response.entries', computedCharacters)
  }

  getPageKey = () => {
    const { routeParams } = this.props
    return `${routeParams.area}_${routeParams.dialect_name}_learn_words`
  }

  handleAlphabetClick = async (letter, href, updateHistory = true) => {
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

    this.changeFilter({ href, updateHistory })
  }

  handleCategoryClick = async ({ facetField, selected, unselected, href }, updateHistory = true) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CATEGORY,
      searchingDialectFilter: selected.checkedFacetUid,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })

    this.changeFilter({ href, updateHistory })

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
        // pageSize, // TODO?
        // preserveSearch, // TODO?
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
        const { routeParams, splitWindowPath } = this.props
        // When facets change, pagination should be reset.
        // See about removing alphabet/category filter urls
        if (selectn('category', routeParams) || selectn('letter', routeParams)) {
          let resetUrl = window.location.pathname + ''
          const _splitWindowPath = [...splitWindowPath]
          const learnIndex = _splitWindowPath.indexOf('learn')
          if (learnIndex !== -1) {
            _splitWindowPath.splice(learnIndex + 2)
            resetUrl = `/${_splitWindowPath.join('/')}`
          }
          NavigationHelpers.navigate(resetUrl, this.props.pushWindowPath, false)
        } else {
          // In these pages (words/phrase), list views are controlled via URL
          updateUrlIfPageOrPageSizeIsDifferent({
            // pageSize, // TODO?
            // preserveSearch, // TODO?
            pushWindowPath: this.props.pushWindowPath,
            routeParams,
            splitWindowPath,
          })
        }
      }
    )
  }
  sortHandler = async ({ page, pageSize, sortBy, sortOrder } = {}) => {
    const { routeParams, splitWindowPath } = this.props
    await this.props.setRouteParams({
      search: {
        pageSize,
        page,
        sortBy,
        sortOrder,
      },
    })

    // Conditionally update the url after a sort event
    updateUrlIfPageOrPageSizeIsDifferent({
      // onPaginationReset: (_pageNum, _pageSizeNum) => {console.log('WordsFilteredByCategory > sortHandler > updateUrlIfPageOrPageSizeIsDifferent > onPaginationReset', _pageNum, _pageSizeNum)}, // If you need to reset pagination after sort event
      page,
      pageSize,
      pushWindowPath: this.props.pushWindowPath,
      routeParamsPage: routeParams.page,
      routeParamsPageSize: routeParams.pageSize,
      // sortBy,
      // sortOrder,
      splitWindowPath: splitWindowPath,
      windowLocationSearch: window.location.search, // Set only if you want to append the search
    })
  }
}

// PROPTYPES
// -------------------------------------------
const { any, array, bool, func, object, string } = PropTypes
WordsFilteredByCategory.propTypes = {
  hasPagination: bool,
  DEFAULT_LANGUAGE: any, // TODO
  // REDUX: reducers/state
  computeCategories: object.isRequired,
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
  fetchCategories: func.isRequired,
  fetchCharacters: func.isRequired,
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  fetchWords: func.isRequired,
  pushWindowPath: func.isRequired,
  searchDialectUpdate: func.isRequired,
  setListViewMode: func.isRequired,
  // setRouteParams: func.isRequired,
  updatePageProperties: func.isRequired,
}

// REDUX: reducers/state
// -------------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const {
    document,
    fvCharacter,
    fvCategory,
    fvDialect,
    fvPortal,
    fvWord,
    listView,
    navigation,
    nuxeo,
    searchDialect,
    windowPath,
  } = state

  const { computeCategories } = fvCategory
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
    computeCategories,
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
  fetchCategories,
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
