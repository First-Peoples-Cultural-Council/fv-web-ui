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
import React, { PropTypes } from "react"
import Immutable, { Map } from "immutable"
import provide from "react-redux-provide"
import selectn from "selectn"

import PromiseWrapper from "views/components/Document/PromiseWrapper"

import ProviderHelpers from "common/ProviderHelpers"
import StringHelpers from "common/StringHelpers"
import NavigationHelpers from "common/NavigationHelpers"
import DocumentListView from "views/components/Document/DocumentListView"

import DataListView from "views/pages/explore/dialect/learn/base/data-list-view"

import IntlService from "views/services/intl"

const intl = IntlService.instance
/**
 * List view for words
 */
@provide
export default class ListViewAlt extends DataListView {
  static defaultProps = {
    disableClickItem: true,
    DISABLED_SORT_COLS: ["state", "related_audio", "related_pictures"],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: "english",
    DEFAULT_SORT_COL: "dc:title",
    DEFAULT_SORT_TYPE: "asc",
    dialect: null,
    filter: new Map(),
    gridListView: false,
  }

  static propTypes = {
    disableClickItem: PropTypes.bool,
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    dialect: PropTypes.object,
    fetchBooks: PropTypes.func.isRequired,
    computeBooks: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    filter: PropTypes.object,
    data: PropTypes.string,
    gridListView: PropTypes.bool,
    action: PropTypes.func,

    DISABLED_SORT_COLS: PropTypes.array,
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_COL: PropTypes.string,
    DEFAULT_SORT_TYPE: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    const currentTheme = this.props.routeParams.theme

    this.state = {
      columns: [
        {
          name: "title",
          title: intl.trans("title", "Title", "first"),
          render: (v, data, cellProps) => {
            const href = NavigationHelpers.generateUIDPath(
              currentTheme || "explore",
              data,
              selectn("properties.fvbook:type", data) === "story" ? "stories" : "songs"
            )
            const clickHandler = props.disableClickItem
              ? NavigationHelpers.disable
              : (e) => {
                  // e.preventDefault()
                  // NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
                }
            return (<a
              onClick={clickHandler}
              href={href}
            >
              {v}
            </a>)
          },
        },
        {
          name: "dc:modified",
          width: 250,
          title: intl.trans("date_modified", "Date Modified"),
          render: function(v, data, cellProps) {
            return StringHelpers.formatUTCDateString(selectn("lastModified", data))
          },
        },
        {
          name: "dc:created",
          width: 210,
          title: intl.trans("date_created", "Date Created"),
          render: function(v, data, cellProps) {
            return StringHelpers.formatUTCDateString(selectn("properties.dc:created", data))
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
      "_onNavigateRequest",
      "_onEntryNavigateRequest",
      "_handleRefetch",
      "_handleSortChange",
      "_handleColumnOrderChange",
      "_resetColumns",
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
          this.props.theme || "explore",
          item,
          selectn("properties.fvbook:type", item) === "story" ? "stories" : "songs"
        )
      )
    }
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    let currentAppliedFilter = ""

    if (props.filter.has("currentAppliedFilter")) {
      currentAppliedFilter = Object.values(props.filter.get("currentAppliedFilter").toJS()).join("")
    }

    props.fetchBooks(
      props.routeParams.dialect_path,
      currentAppliedFilter +
        "&currentPageIndex=" +
        (pageIndex - 1) +
        "&pageSize=" +
        pageSize +
        "&sortOrder=" +
        sortOrder +
        "&sortBy=" +
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
          if (selectn("response.entries", computeBooks)) {
            return (
              <DocumentListView
                objectDescriptions="books"
                type="FVBook"
                data={computeBooks}
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
                dialect={selectn("response", computeDialect2)}
              />
            )
          }
        })()}
      </PromiseWrapper>
    )
  }
}
