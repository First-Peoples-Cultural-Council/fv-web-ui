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
import { fetchLinks } from 'reducers/fvLink'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import PromiseWrapper from 'components/PromiseWrapper'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

import DocumentListView from 'components/DocumentListView'

import DataListView from 'components/LearnBase/data-list-view'
import { dictionaryListSmallScreenColumnDataTemplate } from 'components/DictionaryList/DictionaryListSmallScreen'
/**
 * List view for links
 */

const { array, bool, func, number, object, string } = PropTypes
class LinksListView extends DataListView {
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
    gridListView: bool,
    gridCols: number,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLinks: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchLinks: func.isRequired,
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
          title: props.intl.trans('link', 'Link', 'first'),
          columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
          render: (v /*, data, cellProps*/) => v,
        },
        {
          name: 'dc:description',
          title: props.intl.trans('description', 'Description', 'first'),
          render: (v, data) => selectn('properties.dc:description', data),
        },
        {
          name: 'fvlink:url',
          title: props.intl.trans('url', 'URL', 'upper'),
          render: (v, data) => selectn('properties.fvlink:url', data),
        },
        {
          name: 'thumb:thumbnail',
          width: 72,
          textAlign: 'center',
          title: props.intl.trans('file', 'File', 'first'),
          render: (v, data) => {
            const filePreview = selectn('properties.thumb:thumbnail.data', data)
            if (filePreview)
              return (
                <img
                  className="PrintHide itemThumbnail"
                  key={selectn('uid', filePreview)}
                  src={UIHelpers.getThumbnail(filePreview, 'Thumbnail')}
                />
              )
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
      linksPath: props.routeParams.dialect_path + '/Links',
    }

    // Bind methods to 'this'
    ;[
      '_onNavigateRequest',
      '_onEntryNavigateRequest',
      '_handleRefetch',
      '_handleSortChange',
      '_handleColumnOrderChange',
      '_resetColumns',
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
      //this.props.pushWindowPath('/' + this.props.routeParams.siteTheme + item.path.replace('Dictionary', 'words/links/' + item.uid));
    }
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ''

    if (props.filter.has('currentAppliedFilter')) {
      currentAppliedFilter = Object.values(props.filter.get('currentAppliedFilter').toJS()).join('')
    }

    props.fetchLinks(
      this.state.linksPath,
      `${currentAppliedFilter}&currentPageIndex=${pageIndex -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`
    )
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.state.linksPath,
        entity: this.props.computeLinks,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeLinks = ProviderHelpers.getEntry(this.props.computeLinks, this.state.linksPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {selectn('response.entries', computeLinks) && (
          <DocumentListView
            // objectDescriptions="links"
            // onSortChange={this._handleSortChange}
            // sortInfo={this.state.sortInfo.uiSortOrder}
            className="browseDataGrid"
            columns={this.state.columns}
            data={computeLinks}
            dialect={selectn('response', computeDialect2)}
            gridCols={this.props.gridCols}
            gridListView={this.props.gridListView}
            hasSorting={this.props.hasSorting}
            hasViewModeButtons={this.props.hasViewModeButtons}
            page={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.pageSize}
            refetcher={this._handleRefetch}
            rowClickHandler={(row) => {
              this._onEntryNavigateRequest(row)
            }}
            type="FVLink"
          />
        )}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLink, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeLinks } = fvLink
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLinks,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchLinks,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksListView)
