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
import Immutable, { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchPhrases } from 'reducers/fvPhrase'
import { pushWindowPath } from 'reducers/windowPath'
import { setRouteParams } from 'reducers/navigation'

import selectn from 'selectn'

import Edit from '@material-ui/icons/Edit'

import { WORKSPACES } from 'common/Constants'
import AuthorizationFilter from 'components/AuthorizationFilter'
import DataListView from 'components/LearnBase/data-list-view'
import DocumentListView from 'components/DocumentListView'
import FVButton from 'components/FVButton'
import NavigationHelpers, { getSearchObject } from 'common/NavigationHelpers'
import Preview from 'components/Preview'
import PromiseWrapper from 'components/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
import Link from 'components/Link'
import { SEARCH_DATA_TYPE_PHRASE } from 'components/SearchDialect/constants'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
  dictionaryListSmallScreenTemplatePhrases,
  dictionaryListSmallScreenColumnDataTemplateCustomState,
} from 'components/DictionaryList/DictionaryListSmallScreen'
/**
 * List view for phrases
 */
export class PhrasesListView extends DataListView {
  constructor(props, context) {
    super(props, context)

    const currentTheme = this.props.routeParams.siteTheme

    // NOTE: searchObj used below in setting state
    const searchObj = getSearchObject()

    this.state = {
      phrasesPath: props.parentID ? props.parentID : `${props.routeParams.dialect_path}/Dictionary`,
      columns: [
        {
          name: 'title',
          title: props.intl.trans('phrase', 'Phrase', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
          render: (v, data) => {
            const href = NavigationHelpers.generateUIDPath(currentTheme, data, 'phrases')

            const isWorkspaces = this.props.routeParams.area === WORKSPACES
            const hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'phrases')
            const hrefEditRedirect = `${hrefEdit}?redirect=${encodeURIComponent(
              `${window.location.pathname}${window.location.search}`
            )}`
            const computeDialect2 = this.props.dialect || this.getDialect()

            const editButton =
              isWorkspaces && hrefEdit ? (
                <AuthorizationFilter
                  filter={{
                    entity: selectn('response', computeDialect2),
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
                    <Edit title={props.intl.trans('edit', 'Edit', 'first')} />
                    {/* <span>{intl.trans('edit', 'Edit', 'first')}</span> */}
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
          title: props.intl.trans('definitions', 'Definitions', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
          columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildrenCellRender,
          render: (v, data, cellProps) => {
            return UIHelpers.generateOrderedListFromDataset({
              dataSet: selectn(`properties.${cellProps.name}`, data),
              extractDatum: (entry, i) => {
                if (entry.language === this.props.DEFAULT_LANGUAGE && i < 2) {
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
          title: props.intl.trans('audio', 'Audio', 'first'),
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
          title: props.intl.trans('picture', 'Picture', 'first'),
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
        {
          name: 'fv-phrase:phrase_books',
          title: props.intl.trans('phrase_books', 'Phrase Books', 'words'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
          columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
          render: (v, data) => {
            return UIHelpers.generateDelimitedDatumFromDataset({
              dataSet: selectn('contextParameters.phrase.phrase_books', data),
              extractDatum: (entry) => selectn('dc:title', entry),
            })
          },
        },
        {
          name: 'dc:modified',
          width: 210,
          title: props.intl.trans('date_modified', 'Date Modified'),
          render: (v, data) => {
            return StringHelpers.formatLocalDateString(selectn('lastModified', data))
          },
        },
        {
          name: 'dc:created',
          width: 210,
          title: props.intl.trans('date_created', 'Date Added to FirstVoices'),
          render: (v, data) => {
            return StringHelpers.formatLocalDateString(selectn('properties.dc:created', data))
          },
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: this.props.customSortBy || searchObj.sortBy || this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.customSortOrder || searchObj.sortOrder || this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
    }

    // Only show enabled cols if specified
    if (this.props.ENABLED_COLS.length > 0) {
      this.state.columns = this.state.columns.filter((v) => this.props.ENABLED_COLS.indexOf(v.name) !== -1)
    }

    if (this.props.routeParams.area === WORKSPACES) {
      this.state.columns.push({
        name: 'state',
        title: 'Visibility',
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.custom,
        columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomState,
      })
    }

    // Bind methods to 'this'
    ;['_onEntryNavigateRequest', '_handleRefetch', '_handleSortChange', '_handleColumnOrderChange'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  render() {
    const {
      dialect,
      dictionaryListClickHandlerViewMode,
      dictionaryListViewMode,
      exportDialectColumns,
      exportDialectExportElement,
      exportDialectLabel,
      exportDialectQuery,
      flashcard,
      flashcardTitle,
      gridCols,
      gridListView,
      gridViewProps,
      handleSearch,
      hasSearch,
      hasSorting,
      hasViewModeButtons,
      navigationRouteSearch,
      resetSearch,
      rowClickHandler,
      searchByMode,
      searchUi,
    } = this.props

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.phrasesPath,
        entity: this.props.computePhrases,
      },
    ])

    // If dialect not supplied, promise wrapper will need to wait for compute dialect
    if (!dialect) {
      computeEntities.push(
        new Map({
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        })
      )
    }

    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this.state.phrasesPath)
    const computeDialect2 = dialect || this.getDialect()
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computePhrases) && (
          <DocumentListView
            // className={'browseDataGrid'}
            // objectDescriptions="phrases"
            // onSelectionChange={this._onEntryNavigateRequest}
            // onSortChange={this._handleSortChange}
            // sortInfo={this.state.sortInfo.uiSortOrder}

            // Export
            hasExportDialect
            exportDialectExportElement={exportDialectExportElement || 'FVPhrase'}
            exportDialectLabel={exportDialectLabel}
            exportDialectQuery={exportDialectQuery}
            exportDialectColumns={exportDialectColumns}
            //
            columns={this.state.columns}
            data={computePhrases}
            dialect={selectn('response', computeDialect2)}
            flashcard={flashcard}
            flashcardTitle={flashcardTitle}
            gridCols={gridCols}
            gridListView={gridListView}
            gridViewProps={gridViewProps}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            // refetcher: this._handleRefetch,
            // NOTE: Pagination === refetcher
            refetcher={(dataGridProps, page, pageSize) => {
              const searchObj = getSearchObject()
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
                // 1st: custom values, 2nd: redux values, 3rd: url search query, 4th: defaults
                sortOrder:
                  this.props.customSortOrder ||
                  navigationRouteSearch.sortOrder ||
                  searchObj.sortOrder ||
                  this.props.DEFAULT_SORT_TYPE,
                sortBy:
                  this.props.customSortBy ||
                  navigationRouteSearch.sortBy ||
                  searchObj.sortBy ||
                  this.props.DEFAULT_SORT_COL,
              })
            }}
            sortHandler={({ page, pageSize, sortBy, sortOrder } = {}) => {
              this.props.setRouteParams({
                search: {
                  pageSize,
                  page,
                  sortBy,
                  sortOrder,
                },
              })

              // _handleRefetch2 is called to update the url, eg:
              // A sort event happened on page 3, `_handleRefetch2` will reset to page 1
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
                sortBy,
                sortOrder,
              })
            }}
            type={'FVPhrase'}
            dictionaryListClickHandlerViewMode={dictionaryListClickHandlerViewMode}
            dictionaryListViewMode={dictionaryListViewMode}
            dictionaryListSmallScreenTemplate={dictionaryListSmallScreenTemplatePhrases}
            // SEARCH:
            handleSearch={handleSearch}
            hasSearch={hasSearch}
            searchDialectDataType={SEARCH_DATA_TYPE_PHRASE}
            resetSearch={resetSearch}
            searchByMode={searchByMode}
            searchUi={searchUi}
            // List view
            hasViewModeButtons={hasViewModeButtons}
            hasSorting={hasSorting}
            rowClickHandler={rowClickHandler}
          />
        )}
      </PromiseWrapper>
    )
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
    const searchObj = getSearchObject()
    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      // sortOrder - 1st: custom values, 2nd: redux values, 3rd: url search query, 4th: defaults
      this.props.customSortOrder ||
        this.props.navigationRouteSearch.sortOrder ||
        searchObj.sortOrder ||
        newProps.DEFAULT_SORT_TYPE,
      // sortBy - 1st: custom values, 2nd: redux values, 3rd: url search query, 4th: defaults
      this.props.customSortBy ||
        this.props.navigationRouteSearch.sortBy ||
        searchObj.sortBy ||
        newProps.DEFAULT_SORT_COL
    )
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    let nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`

    const { routeParams } = this.props
    const letter = routeParams.letter

    if (letter) {
      nql = `${nql}&dialectId=${this.props.dialectID}&letter=${letter}&starts_with_query=Document.CustomOrderQuery`
    } else {
      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
    }

    // NOTE: the following attempts to prevent double requests but it doesn't work all the time!
    // Eventually `this.state.nql` becomes `undefined` and then a duplicate request is initiated
    //
    // DataListView calls this._fetchListViewData AND this.fetchData (which calls this.__fetchListViewData)
    if (this.state.nql !== nql) {
      this.setState(
        {
          nql,
        },
        () => {
          props.fetchPhrases(this.state.phrasesPath, nql)
        }
      )
    }
  }

  _onEntryNavigateRequest(item) {
    if (this.props.action) {
      this.props.action(item)
    } else {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, item, 'phrases'),
        this.props.pushWindowPath,
        true
      )
    }
  }
}

// PROPTYPES
const { array, bool, func, number, object, string } = PropTypes
PhrasesListView.propTypes = {
  action: func,
  data: string,
  controlViaURL: bool,
  customSortBy: string,
  customSortOrder: string,
  DEFAULT_PAGE: number,
  DEFAULT_PAGE_SIZE: number,
  DEFAULT_SORT_COL: string,
  DEFAULT_SORT_TYPE: string,
  dialect: object,
  disableClickItem: bool,
  // DISABLED_SORT_COLS: array,
  ENABLED_COLS: array,
  filter: object,
  flashcard: bool,
  flashcardTitle: string,
  gridCols: number,
  gridListView: bool,
  parentID: string,
  dialectID: string,
  onPagePropertiesChange: func,
  pageProperties: object,
  routeParams: object.isRequired,
  // Export
  hasExportDialect: bool,
  exportDialectExportElement: string,
  exportDialectColumns: string,
  exportDialectLabel: string,
  exportDialectQuery: string,
  // REDUX: reducers/state
  computeDialect2: object.isRequired,
  computeLogin: object.isRequired,
  computePhrases: object.isRequired,
  properties: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  // REDUX: actions/dispatch/func
  fetchDialect2: func.isRequired,
  fetchPhrases: func.isRequired,
  pushWindowPath: func.isRequired,
}
PhrasesListView.defaultProps = {
  disableClickItem: true,
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_LANGUAGE: 'english',
  DEFAULT_SORT_COL: 'fv:custom_order', // NOTE: Used when paging
  DEFAULT_SORT_TYPE: 'asc',
  ENABLED_COLS: ['title', 'fv:definitions', 'related_pictures', 'related_audio', 'fv-phrase:phrase_books'],
  dialect: null,
  filter: new Map(),
  gridListView: false,
  gridCols: 4,
  controlViaURL: false,
  flashcard: false,
  flashcardTitle: '',
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath, locale } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computePhrases } = fvPhrase
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale
  return {
    computeDialect2,
    computeLogin,
    computePhrases,
    intl: intlService,
    navigationRouteSearch: route.search,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPhrases,
  pushWindowPath,
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(PhrasesListView)
