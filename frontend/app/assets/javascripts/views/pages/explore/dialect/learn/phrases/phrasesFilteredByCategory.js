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
import Immutable, { is, Set, Map } from 'immutable'
import selectn from 'selectn'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPhrases } from 'providers/redux/reducers/fvPhrase'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setListViewMode } from 'providers/redux/reducers/listView'
import { setRouteParams, updatePageProperties } from 'providers/redux/reducers/navigation'
import { searchDialectReset } from 'providers/redux/reducers/searchDialect'

// FPCC
// -------------------------------------------
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import AlphabetCharactersPresentation from 'views/components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'views/components/AlphabetCharacters/AlphabetCharactersData'

import DialectFilterListPresentation from 'views/components/DialectFilterList/DialectFilterListPresentation'
import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'

import CategoriesDataLayer from 'views/pages/explore/dialect/learn/words/categoriesDataLayer'

import Edit from '@material-ui/icons/Edit'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import Link from 'views/components/Link'
import NavigationHelpers, {
  appendPathArrayAfterLandmark,
  getSearchObject,
  updateUrlIfPageOrPageSizeIsDifferent,
} from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import { SEARCH_DATA_TYPE_PHRASE } from 'views/components/SearchDialect/constants'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenTemplatePhrases,
} from 'views/components/Browsing/DictionaryListSmallScreen'
import {
  onNavigateRequest,
  sortHandler,
  updateFilter,
  updateUrlAfterResetSearch,
  useIdOrPathFallback,
} from 'views/pages/explore/dialect/learn/base'
import { WORKSPACES } from 'common/Constants'

const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))
const intl = IntlService.instance

// PhrasesFilteredByCategory
// ====================================================
export class PhrasesFilteredByCategory extends Component {
  DEFAULT_SORT_COL = 'fv:custom_order' // NOTE: Used when paging
  DEFAULT_SORT_TYPE = 'asc'

  componentDidUpdate(prevProps) {
    const { routeParams: curRouteParams } = this.props
    const { routeParams: prevRouteParams } = prevProps
    if (
      curRouteParams.page !== prevRouteParams.page ||
      curRouteParams.pageSize !== prevRouteParams.pageSize ||
      curRouteParams.phraseBook !== prevRouteParams.phraseBook ||
      curRouteParams.area !== prevRouteParams.area
    ) {
      this.fetchListViewData({ pageIndex: curRouteParams.page, pageSize: curRouteParams.pageSize })
    }
  }

  async componentDidMount() {
    const { routeParams, computePortal, computeDocument } = this.props

    // Portal
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, this.props.fetchPortal, computePortal)
    // Document
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Dictionary`, this.props.fetchDocument, computeDocument)

    // PHRASES
    // ---------------------------------------------
    this.fetchListViewData()
  }

  componentWillUnmount() {
    this.props.searchDialectReset()
  }

  constructor(props, context) {
    super(props, context)

    const { computeDocument, computePortal, properties, routeParams } = props

    let filterInfo = this.initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn(
        [[`${routeParams.area}_${routeParams.dialect_name}_learn_phrases`], 'filterInfo'],
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
      isKidsTheme: routeParams.siteTheme === 'kids',
    }
  }

  render() {
    const {
      computeEntities,
      filterInfo,
      // flashcardMode, // TODO ?
      isKidsTheme,
    } = this.state

    const {
      computeDialect2,
      computeDocument,
      computeLogin,
      computePhrases,
      computePortal,
      hasPagination,
      listView,
      routeParams,
      splitWindowPath,
    } = this.props

    const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const computedPortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const computedDialect2Response = selectn('response', computedDialect2)
    const parentUid = selectn('response.uid', computedDocument)
    const computedPhrases = ProviderHelpers.getEntry(computePhrases, parentUid)
    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computedPortal) ||
      ''} ${intl.trans('phrases', 'Phrases', 'first')}`

    const phraseListView = parentUid ? (
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryList
          dictionaryListClickHandlerViewMode={this.props.setListViewMode}
          dictionaryListViewMode={listView.mode}
          dictionaryListSmallScreenTemplate={dictionaryListSmallScreenTemplatePhrases}
          flashcardTitle={pageTitle}
          dialect={computedDialect2Response}
          // ==================================================
          // Search
          // --------------------------------------------------
          handleSearch={this.changeFilter}
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
          searchDialectDataType={SEARCH_DATA_TYPE_PHRASE}
          // ==================================================
          // Table data
          // --------------------------------------------------
          items={selectn('response.entries', computedPhrases)}
          columns={this.getColumns()}
          // ===============================================
          // Pagination
          // -----------------------------------------------
          hasPagination
          fetcher={({ currentPageIndex, pageSize }) => {
            const newUrl = appendPathArrayAfterLandmark({
              pathArray: [pageSize, currentPageIndex],
              splitWindowPath,
              landmarkArray: [routeParams.phraseBook],
            })
            NavigationHelpers.navigate(`/${newUrl}`, this.props.pushWindowPath)
          }}
          fetcherParams={{ currentPageIndex: routeParams.page, pageSize: routeParams.pageSize }}
          metadata={selectn('response', computedPhrases)}
          // ===============================================
          // Sort
          // -----------------------------------------------
          sortHandler={this._sortHandler}
          // ===============================================
        />
      </Suspense>
    ) : null

    // Render kids view
    if (isKidsTheme) {
      const clonePhraseListView = phraseListView
        ? React.cloneElement(phraseListView, {
            DEFAULT_PAGE_SIZE: 8,
            disablePageSize: true,
            filter: filterInfo.setIn(['currentAppliedFilter', 'kids'], ' AND fv:available_in_childrens_archive=1'),
            gridListView: true,
          })
        : null
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-xs-12 col-md-8 col-md-offset-2">{clonePhraseListView}</div>
          </div>
        </PromiseWrapper>
      )
    }

    const dialectClassName = getDialectClassname(computedPortal)
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row row-create-wrapper">
          <div className="col-xs-12 col-md-4 col-md-offset-8 text-right">
            <AuthorizationFilter
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computedDocument),
                login: computeLogin,
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
                {intl.trans('views.pages.explore.dialect.phrases.create_new_phrase', 'Create New Phrase', 'words')}
              </button>
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-3 PrintHide">
            <AlphabetCharactersData
              letterClickedCallback={() => {
                this.changeFilter()
              }}
            >
              {({ activeLetter, characters, generateAlphabetCharacterHref, letterClicked }) => {
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

            <CategoriesDataLayer fetchPhraseBooks>
              {({ categoriesData }) => {
                let CategoriesDataLayerToRender = null
                if (categoriesData && categoriesData.length > 0) {
                  CategoriesDataLayerToRender = (
                    <DialectFilterListData
                      appliedFilterIds={new Set([routeParams.phraseBook])}
                      setDialectFilterCallback={this.changeFilter} // TODO
                      facets={categoriesData}
                      facetType="phraseBook"
                      type="phrases"
                      workspaceKey="fv-phrase:phrase_books"
                    >
                      {({ listItemData }) => {
                        return (
                          <DialectFilterListPresentation
                            title={intl.trans(
                              'views.pages.explore.dialect.learn.phrases.browse_by_phrase_books',
                              'Browse Phrase Books',
                              'words'
                            )}
                            listItemData={listItemData}
                          />
                        )
                      }}
                    </DialectFilterListData>
                  )
                }
                return CategoriesDataLayerToRender
              }}
            </CategoriesDataLayer>
          </div>
          <div className="col-xs-12 col-md-9">
            <h1 className="DialectPageTitle">{pageTitle}</h1>
            <div className={dialectClassName}>{phraseListView}</div>
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
        updateUrlIfPageOrPageSizeIsDifferent({
          preserveSearch: true,
          pushWindowPath: this.props.pushWindowPath,
          routeParams,
          splitWindowPath,
        })
      })
    }
  }

  fetchListViewData({ pageIndex = 1, pageSize = 10 } = {}) {
    const { computeDocument, navigationRouteSearch, routeParams } = this.props
    const { phraseBook, area } = routeParams

    let currentAppliedFilter = ''
    if (phraseBook) {
      // Private
      if (area === 'Workspaces') {
        currentAppliedFilter = ` AND fv-phrase:phrase_books/* IN ("${phraseBook}")`
      }
      // Public
      if (area === 'sections') {
        currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${phraseBook}")`
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
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`

    const letter = routeParams.letter
    if (letter) {
      nql = `${nql}&dialectId=${dialectUid}&letter=${letter}&starts_with_query=Document.CustomOrderQuery`
    } else {
      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
    }

    this.props.fetchPhrases(uid, nql)
  }

  getColumns = () => {
    const { computeDialect2, DEFAULT_LANGUAGE, routeParams } = this.props

    const computedDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
    const computedDialect2Response = selectn('response', computedDialect2)
    const columns = [
      {
        name: 'title',
        title: intl.trans('phrase', 'Phrase', 'first'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
        render: (v, data) => {
          const href = NavigationHelpers.generateUIDPath(routeParams.siteTheme, data, 'phrases')

          const isWorkspaces = this.props.routeParams.area === WORKSPACES
          const hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'phrases')
          const hrefEditRedirect = `${hrefEdit}?redirect=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
          )}`

          const editButton =
            isWorkspaces && hrefEdit ? (
              <AuthorizationFilter
                filter={{
                  entity: computedDialect2Response,
                  login: this.props.computeLogin,
                  role: ['Record', 'Approve', 'Everything'],
                }}
                hideFromSections
                routeParams={this.props.routeParams}
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
          const firstAudio = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
          if (firstAudio) {
            return (
              <Preview
                minimal
                styles={{ padding: 0 }}
                tagStyles={{ width: '100%', minWidth: '230px' }}
                key={selectn('uid', firstAudio)}
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
          const firstPicture = selectn('contextParameters.phrase.' + cellProps.name + '[0]', data)
          if (firstPicture) {
            return (
              <img
                className="PrintHide itemThumbnail"
                key={selectn('uid', firstPicture)}
                src={UIHelpers.getThumbnail(firstPicture, 'Thumbnail')}
              />
            )
          }
        },
      },
    ]

    // NOTE: Append `phrase book` & `state` columns if on Workspaces
    if (routeParams.area === WORKSPACES) {
      columns.push({
        name: 'fv-phrase:phrase_books',
        title: intl.trans('phrase_books', 'Phrase Books', 'words'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
        render: (v, data) => {
          return UIHelpers.generateDelimitedDatumFromDataset({
            dataSet: selectn('contextParameters.phrase.phrase_books', data),
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

  initialFilterInfo = () => {
    const { routeParams } = this.props
    const routeParamsCategory = routeParams.phraseBook
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-phrase:phrase_books',
      routeParams.area
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
      },
      () => {
        updateUrlAfterResetSearch({
          routeParams: this.props.routeParams,
          splitWindowPath: this.props.splitWindowPath,
          pushWindowPath: this.props.pushWindowPath,
          urlAppend: `/${this.props.routeParams.pageSize}/1`,
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
PhrasesFilteredByCategory.propTypes = {
  hasPagination: bool,
  DEFAULT_LANGUAGE: any, // TODO ?
  // REDUX: reducers/state
  computeDialect2: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePhrases: object.isRequired,
  computePortal: object.isRequired,
  computeSearchDialect: object,
  listView: object.isRequired,
  navigationRouteSearch: object.isRequired,
  properties: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchPhrases: func.isRequired,
  fetchPortal: func.isRequired,
  pushWindowPath: func.isRequired,
  setListViewMode: func.isRequired,
  setRouteParams: func.isRequired,
  updatePageProperties: func.isRequired,
  searchDialectReset: func.isRequired,
}
PhrasesFilteredByCategory.defaultProps = {
  computeSearchDialect: {},
  DEFAULT_LANGUAGE: 'english',
}

// REDUX: reducers/state
// -------------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvDialect, fvPhrase, fvPortal, listView, navigation, nuxeo, windowPath } = state

  const { computeDialect2 } = fvDialect
  const { computePhrases } = fvPhrase
  const { computePortal } = fvPortal
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { properties, route } = navigation
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeDocument,
    computeLogin,
    computePhrases,
    computePortal,
    listView,
    navigationRouteSearch: route.search,
    routeParams: route.routeParams,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchPhrases,
  fetchPortal,
  pushWindowPath,
  setListViewMode,
  setRouteParams,
  updatePageProperties,
  searchDialectReset,
}

export default connect(mapStateToProps, mapDispatchToProps)(PhrasesFilteredByCategory)
