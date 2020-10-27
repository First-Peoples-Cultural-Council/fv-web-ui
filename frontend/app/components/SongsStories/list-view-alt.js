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
import { fetchBooks } from 'reducers/fvBook'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import PromiseWrapper from 'components/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import DocumentListView from 'components/DocumentListView'

import DataListView from 'components/LearnBase/data-list-view'
import { dictionaryListSmallScreenColumnDataTemplate } from 'components/DictionaryList/DictionaryListSmallScreen'

/**
 * List view for words
 */

const { array, bool, func, number, object, string } = PropTypes
export class SongsStoriesListViewAlt extends DataListView {
  static propTypes = {
    action: func,
    data: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    disableClickItem: bool,
    DISABLED_SORT_COLS: array,
    filter: object,
    gridListView: bool,
    routeParams: object.isRequired,
    // Export
    hasExportDialect: bool,
    exportDialectExportElement: string,
    exportDialectColumns: string,
    exportDialectLabel: string,
    exportDialectQuery: string,
    // REDUX: reducers/state
    computeBooks: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchBooks: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    disableClickItem: true,
    DISABLED_SORT_COLS: ['state', 'related_audio', 'related_pictures'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    dialect: null,
    filter: new Map(),
    gridListView: false,
  }

  constructor(props, context) {
    super(props, context)

    const currentTheme = this.props.routeParams.siteTheme

    this.state = {
      columns: [
        {
          name: 'title',
          title: props.intl.trans('title', 'Title', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
          render: (v, data /*, cellProps*/) => {
            const href = NavigationHelpers.generateUIDPath(
              currentTheme || 'explore',
              data,
              selectn('properties.fvbook:type', data) === 'story' ? 'stories' : 'songs'
            )
            const clickHandler = props.disableClickItem
              ? NavigationHelpers.disable
              : (/*e*/) => {
                // e.preventDefault()
                // NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
              }
            return (
              <a className="DictionaryList__link DictionaryList__link--indigenous" onClick={clickHandler} href={href}>
                {v}
              </a>
            )
          },
        },
        {
          name: 'dc:modified',
          width: 250,
          title: props.intl.trans('date_modified', 'Date Modified'),
          render: (v, data /*, cellProps*/) => {
            return StringHelpers.formatUTCDateString(selectn('lastModified', data))
          },
        },
        {
          name: 'dc:created',
          width: 210,
          title: props.intl.trans('date_created', 'Date Added to FirstVoices'),
          render: (v, data /*, cellProps*/) => {
            return StringHelpers.formatUTCDateString(selectn('properties.dc:created', data))
          },
        },
      ],
      sortInfo: {
        uiSortOrder: [],
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE,
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE,
      },
    }

    // Bind methods to 'this'
    ;[
      '_onNavigateRequest',
      '_onEntryNavigateRequest',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_resetColumns',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }

    this._fetchListViewData(
      newProps,
      newProps.DEFAULT_PAGE,
      newProps.DEFAULT_PAGE_SIZE,
      newProps.DEFAULT_SORT_TYPE,
      newProps.DEFAULT_SORT_COL
    )
  }

  _onEntryNavigateRequest(item) {
    if (this.props.action) {
      this.props.action(item)
    } else {
      this.props.pushWindowPath(
        NavigationHelpers.generateUIDPath(
          this.props.siteTheme || 'explore',
          item,
          selectn('properties.fvbook:type', item) === 'story' ? 'stories' : 'songs'
        )
      )
    }
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    props.fetchBooks(
      props.routeParams.dialect_path,
      currentAppliedFilter +
        '&currentPageIndex=' +
        (pageIndex - 1) +
        '&pageSize=' +
        pageSize +
        '&sortOrder=' +
        sortOrder +
        '&sortBy=' +
        sortBy
    )
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeBooks,
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

    const computeBooks = ProviderHelpers.getEntry(this.props.computeBooks, this.props.routeParams.dialect_path)
    const computeDialect2 = this.props.dialect || this.getDialect()

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {(() => {
          if (selectn('response.entries', computeBooks)) {
            return (
              <DocumentListView
                // objectDescriptions="books"
                // onSelectionChange={this._onEntryNavigateRequest}
                // onSortChange={this._handleSortChange}
                // sortInfo={this.state.sortInfo.uiSortOrder}
                className="browseDataGrid"
                columns={this.state.columns}
                data={computeBooks}
                dialect={selectn('response', computeDialect2)}
                gridListView={this.props.gridListView}
                hasViewModeButtons={false}
                page={this.state.pageInfo.page}
                pageSize={this.state.pageInfo.pageSize}
                refetcher={this._handleRefetch}
                type="FVBook"
                // Export
                hasExportDialect={this.props.hasExportDialect}
                exportDialectExportElement={this.props.exportDialectExportElement || 'FVBook'}
                exportDialectLabel={this.props.exportDialectLabel}
                exportDialectQuery={this.props.exportDialectQuery}
                exportDialectColumns={this.props.exportDialectColumns}
                //
              />
            )
          }
        })()}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeBooks } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeBooks,
    computeDialect2,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchBooks,
  fetchDialect2,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(SongsStoriesListViewAlt)
