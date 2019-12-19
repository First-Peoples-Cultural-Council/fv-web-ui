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
import { fetchWords } from 'providers/redux/reducers/fvWord'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setRouteParams } from 'providers/redux/reducers/navigation'

import selectn from 'selectn'

import Edit from '@material-ui/icons/Edit'

import { WORKSPACES } from 'common/Constants'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import DocumentListView from 'views/components/Document/DocumentListView'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import NavigationHelpers, { getSearchObject } from 'common/NavigationHelpers'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
import {
  dictionaryListSmallScreenColumnDataTemplate,
  dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
  dictionaryListSmallScreenColumnDataTemplateCustomAudio,
} from 'views/components/Browsing/DictionaryListSmallScreen'
const intl = IntlService.instance

/**
 * List view for words
 */
const { array, bool, func, number, object, string } = PropTypes
class WordsListView extends DataListView {
  static propTypes = {
    action: func,
    controlViaURL: bool,
    data: string,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_PAGE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    disableClickItem: bool,
    DISABLED_SORT_COLS: array,
    disablePageSize: bool,
    ENABLED_COLS: array,
    filter: object,
    flashcard: bool,
    flashcardTitle: string,
    gridListView: bool,
    pageProperties: object,
    parentID: string,
    routeParams: object.isRequired,
    // Search
    handleSearch: func,
    resetSearch: func,
    hasSearch: bool,
    hasViewModeButtons: bool,

    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeWords: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchWords: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    controlViaURL: false,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_PAGE: 1,
    DEFAULT_SORT_COL: 'fv:custom_order',
    DEFAULT_SORT_TYPE: 'asc',
    dialect: null,
    disableClickItem: true,
    DISABLED_SORT_COLS: ['state', 'fv-word:categories', 'related_audio', 'related_pictures', 'dc:modified'],
    disablePageSize: false,
    ENABLED_COLS: [
      'fv-word:categories',
      'fv-word:part_of_speech',
      'fv-word:pronunciation',
      'fv:definitions',
      'related_audio',
      'related_pictures',
      'title',
    ],
    filter: new Map(),
    flashcard: false,
    flashcardTitle: '',
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    // NOTE: searchObj used below in setting state
    const searchObj = getSearchObject()

    this.state = {
      columns: [
        {
          name: 'title',
          title: intl.trans('word', 'Word', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
          render: (v, data) => {
            const isWorkspaces = this.props.routeParams.area === WORKSPACES

            const href = NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, data, 'words')
            const hrefEdit = NavigationHelpers.generateUIDEditPath(this.props.routeParams.siteTheme, data, 'words')
            // NOTE: FW-135: Using `onClick={()=>{}}` for unknown reasons causes the following error when on Words and clicking between categories:
            //`Uncaught Invariant Violation: findComponentRoot(..., .0.0.2.0.1.0.0:1.1.2.0.0.0.0.0.0.1:$0.$0.0): Unable to find element`
            // That's why `undefined` is used in `clickHandler`
            const clickHandler = props.disableClickItem ? NavigationHelpers.disable : undefined

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
                    variant="flat"
                    size="small"
                    component="a"
                    href={hrefEdit}
                    onClick={(e) => {
                      e.preventDefault()
                      NavigationHelpers.navigate(hrefEdit, this.props.pushWindowPath, false)
                    }}
                  >
                    <Edit title={intl.trans('edit', 'Edit', 'first')} />
                    {/* <span>{intl.trans('edit', 'Edit', 'first')}</span> */}
                  </FVButton>
                </AuthorizationFilter>
              ) : null

            return (
              <>
                <a className="DictionaryList__link" onClick={clickHandler} href={href}>
                  {v}
                </a>
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
          columnDataTemplateCustom: dictionaryListSmallScreenColumnDataTemplateCustomInspectChildren,
          render: (v, data, cellProps) => {
            return UIHelpers.renderComplexArrayRow(selectn(`properties.${cellProps.name}`, data), (entry, i) => {
              if (entry.language === this.props.DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>
              }
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
                  tagStyles={{ width: '250px', maxWidth: '100%' }}
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
                  key={selectn('uid', firstPicture)}
                  style={{ maxWidth: '62px', maxHeight: '45px' }}
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
          render: (v, data) =>
            UIHelpers.renderComplexArrayRow(selectn('contextParameters.word.categories', data), (entry, i) => (
              <li key={i}>{selectn('dc:title', entry)}</li>
            )),
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: searchObj.sortBy || this.props.DEFAULT_SORT_COL,
        currentSortType: searchObj.sortOrder || this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
    }

    // Reduce the number of columns displayed for mobile
    if (UIHelpers.isViewSize('xs')) {
      this.state.columns = this.state.columns.filter((v) => ['title', 'fv:literal_translation'].indexOf(v.name) !== -1)
      this.state.hideStateColumn = true
    }

    // Only show enabled cols if specified
    if (this.props.ENABLED_COLS.length > 0) {
      this.state.columns = this.state.columns.filter((v) => this.props.ENABLED_COLS.indexOf(v.name) !== -1)
    }

    // Bind methods to 'this'
    ;[
      '_onNavigateRequest', // no references in file
      '_handleRefetch', // Note: comes from DataListView
      '_handleSortChange', // Note: comes from DataListView
      '_handleColumnOrderChange', // Note: comes from DataListView
      '_resetColumns', // Note: comes from DataListView
      // '_fetchData2', // now an arrow fn, no need for binding, looks like it's not being used though
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getPathOrParentID = (newProps) => {
    return newProps.parentID ? newProps.parentID : `${newProps.routeParams.dialect_path}/Dictionary`
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
      // 1st: redux values, 2nd: url search query, 3rd: defaults
      this.props.navigationRouteSearch.sortOrder || searchObj.sortOrder || newProps.DEFAULT_SORT_TYPE,
      this.props.navigationRouteSearch.sortBy || searchObj.sortBy || newProps.DEFAULT_SORT_COL
    )
  }

  _onEntryNavigateRequest = (item) => {
    if (this.props.action) {
      this.props.action(item)
    } else {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, item, 'words'),
        this.props.pushWindowPath,
        true
      )
    }
  }

  // NOTE: DataListView calls `_fetchListViewData`
  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    const startsWithQuery = ProviderHelpers.isStartsWithQuery(currentAppliedFilter)

    const nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
      1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}&enrichment=category_children${startsWithQuery}`

    props.fetchWords(this._getPathOrParentID(props), nql)
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  // TODO: Is this fn() being used?
  _fetchData2 = (fetcherParams /*, props = this.props*/) => {
    this.setState({
      fetcherParams: fetcherParams,
    })

    this._handleRefetch()
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getPathOrParentID(this.props),
        entity: this.props.computeWords,
      },
    ])

    // If dialect not supplied, promise wrapper will need to wait for compute dialect
    if (!this.props.dialect) {
      computeEntities.push(
        new Map({
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        })
      )
    }

    const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this._getPathOrParentID(this.props))
    const computeDialect2 = this.props.dialect || this.getDialect()

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computeWords) && (
          <DocumentListView
            // objectDescriptions="words"
            // onSelectionChange={this._onEntryNavigateRequest} // NOTE: may call this.props.action
            // sortInfo={this.state.sortInfo.uiSortOrder}
            className={'browseDataGrid'}
            columns={this.state.columns}
            data={computeWords}
            dialect={selectn('response', computeDialect2)}
            disablePageSize={this.props.disablePageSize}
            flashcard={this.props.flashcard}
            flashcardTitle={this.props.flashcardTitle}
            gridListView={this.props.gridListView}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            // NOTE: Pagination === refetcher
            refetcher={(dataGridProps, page, pageSize) => {
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
              })
            }}
            sortHandler={async ({ page, pageSize, sortBy, sortOrder } = {}) => {
              /*
              NOTE: TOWER OF INDIRECTION!

              Since `WordsListView extends DataListView`...

              `DataListView` detects the sort change via it's `componentDidUpdate`
              which then calls `WordsListView's > fetchData()` which gets the new
              data via `this._fetchListViewData`

              _handleRefetch2 is called to update the url
              eg: A sort event happens on page 3, `_handleRefetch2` resets it to page 1
              */
              await this.props.setRouteParams({
                search: {
                  pageSize,
                  page,
                  sortBy,
                  sortOrder,
                },
              })
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
                sortBy,
                sortOrder,
              })
            }}
            type={'FVWord'}
            // List View
            hasViewModeButtons={this.props.hasViewModeButtons}
            rowClickHandler={this.props.rowClickHandler}
            hasSorting={this.props.hasSorting}
            // SEARCH:
            handleSearch={this.props.handleSearch}
            hasSearch={this.props.hasSearch}
            resetSearch={this.props.resetSearch}
            searchUi={this.props.searchUi}
          />
        )}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvWord, navigation, nuxeo, windowPath } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computeWords } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeWords,
    properties,
    navigationRouteSearch: route.search,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchWords,
  fetchDialect2,
  pushWindowPath,
  setRouteParams,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordsListView)
