// TODO: FIX OR DROP OVER IN FW-2027

/* eslint-disable */

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
import Immutable, { Set, Map } from 'immutable'
import selectn from 'selectn'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'reducers/document'
import { fetchPhrases } from 'reducers/fvPhrase'
import { fetchPortal } from 'reducers/fvPortal'
import { pushWindowPath } from 'reducers/windowPath'
import { setListViewMode } from 'reducers/listView'
import { setRouteParams, updatePageProperties } from 'reducers/navigation'

// FPCC
// -------------------------------------------
import AuthorizationFilter from 'components/AuthorizationFilter'

import AlphabetCharactersPresentation from 'components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'components/AlphabetCharacters/AlphabetCharactersData'

import DialectFilterListPresentation from 'components/DialectFilterList/DialectFilterListPresentation'
import DialectFilterListData from 'components/DialectFilterList/DialectFilterListData'

import CategoriesData from 'components/Categories/CategoriesData'

import Edit from '@material-ui/icons/Edit'
import FVButton from 'components/FVButton'
import IntlService from 'common/services/IntlService'
import Link from 'components/Link'
import NavigationHelpers, { appendPathArrayAfterLandmark, getSearchObject } from 'common/NavigationHelpers'
import Preview from 'components/Preview'
import PromiseWrapper from 'components/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { getDialectClassname } from 'common/Helpers'
import { SEARCH_DATA_TYPE_PHRASE } from 'common/Constants'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenTemplatePhrases,
} from 'components/DictionaryList/DictionaryListSmallScreen'
import { onNavigateRequest, sortHandler, updateUrlAfterResetSearch, useIdOrPathFallback } from 'components/LearnBase'
import { WORKSPACES } from 'common/Constants'
const SearchDialectContainer = React.lazy(() => import('components/SearchDialect/SearchDialectContainer'))
const DictionaryList = React.lazy(() => import('components/DictionaryList/DictionaryList'))
const intl = IntlService.instance

// phrasesFilteredByPhrasebook
// ====================================================
export class phrasesFilteredByPhrasebook extends Component {
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
    await ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, this.props.fetchPortal, computePortal)
    // Document
    await ProviderHelpers.fetchIfMissing(
      `${routeParams.dialect_path}/Dictionary`,
      this.props.fetchDocument,
      computeDocument
    )

    // Phrases
    // NOTE: need to wait for computeDocument to finish before calling fetchListViewData
    // If we don't then within fetchListViewData dialectUid will be undefined and useIdOrPathFallback will use the path
    this.fetchListViewData()
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
    }
  }

  render() {
    const { computeEntities } = this.state

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
          childrenSearch={
            <Suspense fallback={<div>Loading...</div>}>
              <SearchDialectContainer
                handleSearch={this.changeFilter}
                resetSearch={this.resetSearch}
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
              />
            </Suspense>
          }
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
          navigationRouteSearch={this.props.navigationRouteSearch}
          routeParams={routeParams}
          // ===============================================
          // Sort
          // -----------------------------------------------
          sortHandler={this._sortHandler}
          // ===============================================
        />
      </Suspense>
    ) : null

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

            <CategoriesData fetchPhraseBooks>
              {({ categoriesData }) => {
                let CategoriesDataToRender = null
                if (categoriesData && categoriesData.length > 0) {
                  CategoriesDataToRender = (
                    <DialectFilterListData
                      selectedCategoryId={routeParams.phraseBook}
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
                return CategoriesDataToRender
              }}
            </CategoriesData>
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
    // TODO: DROPPED computeSearchDialect & updating immutable fitlers for url queries
    // const { filterInfo } = this.state
    // const { routeParams, splitWindowPath } = this.props
    // const { searchFilteredBy, searchNxqlQuery } = computeSearchDialect
    // const newFilter = updateFilter({
    //   filterInfo,
    //   searchFilteredBy,
    //   searchNxqlQuery,
    // })
    // // When facets change, pagination should be reset.
    // // In these pages (words/phrase), list views are controlled via URL
    // if (is(filterInfo, newFilter) === false) {
    //   this.setState({ filterInfo: newFilter }, () => {
    //     updateUrlIfPageOrPageSizeIsDifferent({
    //       preserveSearch: true,
    //       pushWindowPath: this.props.pushWindowPath,
    //       routeParams,
    //       splitWindowPath,
    //     })
    //   })
    // }
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

    const uid = useIdOrPathFallback({ id: selectn('response.uid', extractComputeDocument), routeParams })
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
                  variant="text"
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
phrasesFilteredByPhrasebook.propTypes = {
  hasPagination: bool,
  DEFAULT_LANGUAGE: any, // TODO ?
  // REDUX: reducers/state
  computeDialect2: object.isRequired,
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  computePhrases: object.isRequired,
  computePortal: object.isRequired,
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
}
phrasesFilteredByPhrasebook.defaultProps = {
  DEFAULT_LANGUAGE: 'english',
}

// REDUX: reducers/state
// -------------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, fvDialect, fvPhrase, fvPortal, listView, navigation, nuxeo, windowPath } = state

  const { computeDialect2 } = fvDialect
  const { computeDocument } = document
  const { computeLogin } = nuxeo
  const { computePhrases } = fvPhrase
  const { computePortal } = fvPortal
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
    properties,
    routeParams: route.routeParams,
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
}
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(phrasesFilteredByPhrasebook)
