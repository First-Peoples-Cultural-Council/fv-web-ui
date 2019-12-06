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
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import DocumentListView from 'views/components/Document/DocumentListView'
import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * List view for categories
 */

const { bool, array, func, number, object, string } = PropTypes
class CategoriesListView extends DataListView {
  static propTypes = {
    action: func,
    categoriesPath: string.isRequired,
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

    // REDUX: reducers/state
    computeCategories: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'parent'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
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
          title: intl.trans('category', 'Category', 'first'),
          render: (v /*, data, cellProps*/) => v,
        },
        {
          name: 'parent',
          title: intl.trans('views.pages.explore.dialect.learn.words.parent_category', 'Parent Category', 'words'),
          render: (v, data /*, cellProps*/) => {
            const parentCategory = selectn('contextParameters.parentDoc.title', data)
            return parentCategory === 'Shared Categories' ? '' : parentCategory
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
      this.props.pushWindowPath(
        `/${this.props.routeParams.siteTheme}${item.path.replace('Dictionary', `words/categories/${item.uid}`)}`
      )
    }
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    props.fetchCategories(
      this.props.categoriesPath,
      `${currentAppliedFilter}&currentPageIndex=${pageIndex -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    )
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.categoriesPath,
        entity: this.props.computeCategories,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeCategories = ProviderHelpers.getEntry(this.props.computeCategories, this.props.categoriesPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computeCategories) && (
          <DocumentListView
            objectDescriptions="categories"
            type="FVCategory"
            data={computeCategories}
            gridCols={this.props.gridCols}
            gridListView={this.props.gridListView}
            refetcher={this._handleRefetch}
            onSortChange={this._handleSortChange}
            onSelectionChange={this._onEntryNavigateRequest}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            onColumnOrderChange={this._handleColumnOrderChange}
            columns={this.state.columns}
            sortInfo={this.state.sortInfo.uiSortOrder}
            className="browseDataGrid"
            dialect={selectn('response', computeDialect2)}
            rowClickHandler={(row) => {
              this._onEntryNavigateRequest(row)
            }}
            hasViewModeButtons={false}
          />
        )}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeCategories } = fvCategory
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCategories,
    computeDialect2,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchDialect2,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesListView)
