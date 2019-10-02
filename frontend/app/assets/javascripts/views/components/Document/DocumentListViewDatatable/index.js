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
import DataGrid from 'react-datagrid2'

import Paper from '@material-ui/core/Paper'

import GridView from 'views/pages/explore/dialect/learn/base/grid-view'
import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'
// Stylesheet
import '!style-loader!css-loader!react-datagrid2/dist/index.min.css'

const GridViewWithPagination = withPagination(GridView, 8)

/* eslint-disable */
function debounce(a, b, c) {
  let d
  let e
  return function dB1() {
    function h() {
      ;(d = null), c || (e = a.apply(f, g))
    }

    var f = this
    var g = arguments
    return clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
  }
}
/* eslint-enable */

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
  }

  intl = IntlService.instance

  componentDidUpdate(prevProps) {
    if (this.props.data != prevProps.data) {
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
      flashcardTitle,
      gridCols,
      gridListTile,
      gridListView,
      onSortChange,
      page,
      pageSize,
      pagination,
      sortInfo,
      type,
    } = this.props

    if (gridListView) {
      let gridViewProps = {
        style: { overflowY: 'auto', maxHeight: '50vh' },
        cols: gridCols,
        cellHeight: 160,
        fetcher: this._gridListFetcher,
        type: type,
        pagination: pagination,
        fetcherParams: { currentPageIndex: page, pageSize },
        metadata: selectn('response', data),
        gridListTile: gridListTile,
        disablePageSize,
        dialect,
        items: selectn('response.entries', data),
        flashcardTitle,
      }

      gridViewProps = Object.assign({}, gridViewProps, this.props.gridViewProps)

      if (pagination) {
        return <GridViewWithPagination {...gridViewProps} />
      }
      return <GridView {...gridViewProps} />
    }

    return (
      <Paper>
        <DataGrid
          idProperty="uid"
          dataSource={selectn('response.entries', data)}
          // No react-datagrid2 equivalent
          // dataSourceCount={selectn('response.totalSize', data)}
          columns={columns}
          rowStyle={{
            minHeight: '55px',
          }}
          style={{
            minHeight: '70vh',
            zIndex: 0,
          }}
          selected={this.state.selectedId}
          // No react-datagrid2 equivalent
          // onSelectionChange={this._handleSelectionChange}
          onColumnOrderChange={this.props.onColumnOrderChange}
          onSortChange={onSortChange}
          // No react-datagrid2 equivalent
          // withColumnMenu={false}
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
          // No react-datagrid2 equivalent
          // emptyText={this.intl.trans('no_records', 'No records', 'words')}
          // No react-datagrid2 equivalent
          // showCellBorders
        />
      </Paper>
    )
  }

  _gridListFetcher = (fetcherParams) => {
    this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }

  _handleSelectionChange = (newSelectedId, data) => {
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

  _onPageSizeChange = (pageSize) => {
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
