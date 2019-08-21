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
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import selectn from 'selectn'
import GridView from 'views/pages/explore/dialect/learn/base/grid-view'
// import DictionaryList from 'views/components/Browsing/dictionary-list'
import DataGrid from 'react-datagrid2'
import Paper from '@material-ui/core/Paper'
// import FlashcardList from 'views/components/Browsing/flashcard-list'

import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'

// Stylesheet
// import '!style-loader!css-loader!react-datagrid/dist/index.min.css'

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

const GridViewWithPagination = withPagination(GridView, 8)
const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

function debounce(a, b, c) {
  var d, e // eslint-disable-line
  // eslint-disable-next-line
  return function() {
    function h() {
      ;(d = null), c || (e = a.apply(f, g)) // eslint-disable-line
    }

    var f = this // eslint-disable-line

    var g = arguments // eslint-disable-line
    return clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e // eslint-disable-line
  }
}

export default class DocumentListViewDatatable extends Component {
  static propTypes = {
    columns: PropTypes.any, // TODO: set appropriate propType
    data: PropTypes.any, // TODO: set appropriate propType
    dialect: PropTypes.any, // TODO: set appropriate propType
    disablePageSize: PropTypes.any, // TODO: set appropriate propType
    gridCols: PropTypes.any, // TODO: set appropriate propType
    gridListTile: PropTypes.any, // TODO: set appropriate propType
    gridListView: PropTypes.any, // TODO: set appropriate propType
    gridViewProps: PropTypes.any, // TODO: set appropriate propType
    onSelectionChange: PropTypes.func,
    onSortChange: PropTypes.any, // TODO: set appropriate propType
    page: PropTypes.number,
    pageSize: PropTypes.number,
    pagination: PropTypes.bool,
    refetcher: PropTypes.func,
    renderSimpleTable: PropTypes.any, // TODO: set appropriate propType
    sortInfo: PropTypes.any, // TODO: set appropriate propType
    type: PropTypes.any, // TODO: set appropriate propType
    flashcard: PropTypes.bool,
    flashcardTitle: PropTypes.string,
    usePrevResponse: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
    pagination: true,
    usePrevResponse: false,
    onSelectionChange: () => {}, // TODO: HOOK UP THIS ROW CLICK HANDLER
    flashcard: false,
    flashcardTitle: '',
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedId: null,
    }

    // Bind methods to 'this'
    // eslint-disable-next-line
    ;['_handleSelectionChange', '_onPageChange', '_onPageSizeChange', '_gridListFetcher'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  intl = IntlService.instance

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        page: 1,
      })
    }
  }

  render() {
    const {
      columns,
      data,
      dialect,
      disablePageSize,
      gridCols,
      gridListTile,
      gridListView,
      onSortChange,
      pagination,
      page,
      pageSize,
      renderSimpleTable,
      sortInfo,
      type,
    } = this.props

    let gridViewProps = {
      style: { overflowY: 'auto', maxHeight: '50vh' },
      cols: gridCols,
      cellHeight: 160,
      fetcher: this._gridListFetcher,
      type: type,
      pagination: pagination,
      fetcherParams: { currentPageIndex: page, pageSize: pageSize },
      metadata: selectn('response', data),
      gridListTile: gridListTile,
      disablePageSize: disablePageSize,
      dialect: dialect,
      items: selectn('response.entries', data),
      flashcardTitle: this.props.flashcardTitle,
    }

    // TODO: IS THIS NEEDED FOR THIS VIEW?
    if (gridListView) {
      gridViewProps = Object.assign({}, gridViewProps, this.props.gridViewProps)

      if (pagination) {
        return <GridViewWithPagination {...gridViewProps} />
      }
      return <GridView {...gridViewProps} />
    }

    // TODO: IS THIS NEEDED FOR THIS VIEW?
    // const FilteredPaginatedDictionaryList = withPagination(
    //   this.props.flashcard ? FlashcardList : DictionaryList,
    //   DefaultFetcherParams.pageSize
    // )
    // return <FilteredPaginatedDictionaryList {...gridViewProps} columns={columns} />

    return (
      <Paper>
        <DataGrid
          idProperty="uid"
          dataSource={selectn('response.entries', data)}
          // dataSourceCount={selectn('response.totalSize', data)} // No react-datagrid2 equivalent
          columns={columns}
          // rowHeight={55} // No react-datagrid2 equivalent
          style={{
            minHeight: '70vh',
            zIndex: 0,
          }}
          // selected={this.state.selectedId} // rowStyle={(data, props)=>{}} // expected to return a style object
          // onSelectionChange={this._handleSelectionChange} // No react-datagrid2 equivalent
          onSortChange={onSortChange}
          // withColumnMenu={false} // No react-datagrid2 equivalent
          pagination={pagination}
          // No react-datagrid2 equivalent
          // paginationToolbarProps={{
          //   showRefreshIcon: false,
          //   pageSizes: [10, 20, 50],
          // }}
          sortInfo={sortInfo}
          page={page}
          pageSize={pageSize}
          onPageChange={this._onPageChange}
          onPageSizeChange={this._onPageSizeChange}
          // emptyText={this.intl.trans('no_records', 'No records', 'words')} // No react-datagrid2 equivalent
          // showCellBorders // No react-datagrid2 equivalent
        />
      </Paper>
    )
  }

  _gridListFetcher(fetcherParams) {
    this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }

  _handleSelectionChange(newSelectedId, data) {
    this.setState({
      selectedId: newSelectedId,
    })

    this.props.onSelectionChange(data)
  }

  _onPageChange = debounce((page) => {
    // Skip if page hasn't actually changed.
    if (page === this.props.page) {
      return
    }

    this.setState({
      page: page,
    })

    this.props.refetcher(this.props, page, this.props.pageSize)
  }, 750)

  _onPageSizeChange(pageSize) {
    // Skip if page size hasn't actually changed
    if (pageSize === this.props.pageSize) {
      return
    }

    let newPage = this.props.page

    if (pageSize > this.props.pageSize) {
      // TODO: use selectn for this.props.data.response.totalSize?
      newPage = Math.min(this.props.page, Math.ceil(this.props.data.response.totalSize / pageSize))
    }

    // Refresh data
    this.props.refetcher(this.props, newPage, pageSize)
  }
}
