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
import { fetchContributors } from 'providers/redux/reducers/fvContributor'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { setRouteParams } from 'providers/redux/reducers/navigation'

import selectn from 'selectn'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import DocumentListView from 'views/components/Document/DocumentListView'

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
/**
 * List view for contributors
 */

const { array, bool, func, number, object, string } = PropTypes
class ContributorsListView extends DataListView {
  static propTypes = {
    action: func,
    data: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    dialect: object,
    DISABLED_SORT_COLS: array,
    filter: object,
    gridCols: number,
    gridListView: bool,
    routeParams: object.isRequired,
    dictionaryListSmallScreenTemplate: func,
    // REDUX: reducers/state
    properties: object.isRequired,
    windowPath: string.isRequired,
    splitWindowPath: array.isRequired,
    computeLogin: object.isRequired,
    computeDialect2: object.isRequired,
    computeContributors: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchContributors: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    dialect: null,
    filter: new Map(),
    gridListView: false,
    gridCols: 4,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      columns: [
        {
          name: 'title',
          title: props.intl.trans('contributor', 'Contributor', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
          // sortBy: 'title',
          render: (v /*, data, cellProps*/) => v,
        },
        {
          name: 'dc:description',
          title: props.intl.trans('short_proflile', 'Short Profile', 'words'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
          render: (v, data /*, cellProps*/) => selectn('properties.dc:description', data),
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
      contributorsPath: `${props.routeParams.dialect_path}/Contributors`,
    }

    // Bind methods to 'this'
    ;[
      '_onNavigateRequest', // NOTE: Comes from DataListView
      '_onEntryNavigateRequest',
      '_handleRefetch', // NOTE: Comes from DataListView
      '_handleRefetch2', // NOTE: Comes from DataListView
      '_handleSortChange', // NOTE: Comes from DataListView
      '_handleColumnOrderChange', // NOTE: Comes from DataListView
      '_resetColumns', // NOTE: Comes from DataListView
      '_fetchListViewData',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: DataListView calls `fetchData`
  fetchData(newProps) {
    if (newProps.dialect === null) {
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
      //this.props.pushWindowPath('/' + this.props.routeParams.siteTheme + item.path.replace('Dictionary', 'words/contributors/' + item.uid));
    }
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    props.fetchContributors(
      this.state.contributorsPath,
      `${currentAppliedFilter}&currentPageIndex=${pageIndex -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    )
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.state.contributorsPath,
        entity: this.props.computeContributors,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeContributors = ProviderHelpers.getEntry(this.props.computeContributors, this.state.contributorsPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computeContributors) && (
          <DocumentListView
            // objectDescriptions="contributors"
            // onSortChange={this._handleSortChange}
            // sortInfo={this.state.sortInfo.uiSortOrder}
            className="browseDataGrid"
            columns={this.state.columns}
            data={computeContributors}
            dialect={selectn('response', computeDialect2)}
            dictionaryListSmallScreenTemplate={({ templateData }) => {
              return (
                <span className="DictionaryListSmallScreen__ContributorsListView">
                  {templateData.rowClick}
                  {templateData.title}
                  {templateData['dc:description']}
                  {templateData.state}
                </span>
              )
            }}
            gridCols={this.props.gridCols}
            gridListView={this.props.gridListView}
            hasSorting={false}
            hasViewModeButtons={false}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            refetcher={(dataGridProps, page, pageSize) => {
              this._handleRefetch2({
                page,
                pageSize,
                preserveSearch: true,
              })
            }}
            rowClickHandler={(row) => {
              this._onEntryNavigateRequest(row)
            }}
            type="FVContributor"
            // TODO: Page rerenders on sort, cloasing the modal
            // sortHandler={({ page, pageSize, sortBy, sortOrder } = {}) => {
            //   /*
            //   NOTE: TOWER OF INDIRECTION!

            //   Since `ContributorsListView extends DataListView`...

            //   `DataListView` detects the sort change via it's `componentDidUpdate`
            //   which then calls `WordsListView's > fetchData()` which gets the new
            //   data via `this._fetchListViewData`

            //   _handleRefetch2 is called to update the url
            //   eg: A sort event happens on page 3, `_handleRefetch2` resets it to page 1
            //   */
            //   this.props.setRouteParams({
            //     search: {
            //       pageSize,
            //       page,
            //       sortBy,
            //       sortOrder,
            //     },
            //   })
            //   this._handleRefetch2({
            //     page,
            //     pageSize,
            //     preserveSearch: true,
            //     sortBy,
            //     sortOrder,
            //   })
            // }}
            // TODO: Search
            // handleSearch={(a, b, c, d, e, f) => {
            //   console.log('handleSearch', { a, b, c, d, e, f })
            // }}
            // hasSearch
            // resetSearch={(a, b, c, d, e, f) => {
            //   console.log('resetSearch', { a, b, c, d, e, f })
            // }}
            // searchUi={this.props.searchUi}
          />
        )}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, fvDialect, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeContributors } = fvContributor
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeContributors,
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
  fetchContributors,
  fetchDialect2,
  pushWindowPath,
  setRouteParams,
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributorsListView)
