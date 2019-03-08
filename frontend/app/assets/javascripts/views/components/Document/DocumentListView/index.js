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
import React, { Component, PropTypes } from 'react'

import selectn from 'selectn'
import GridView from 'views/pages/explore/dialect/learn/base/grid-view'
import DictionaryList from 'views/components/Browsing/dictionary-list'
import FlashcardList from 'views/components/Browsing/flashcard-list'

import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

const GridViewWithPagination = withPagination(GridView, 8)
const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

export default class DocumentListView extends Component {
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
    onSelectionChange: () => {},
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
    ;["_gridListFetcher"].forEach((method) => (this[method] = this[method].bind(this)))
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
      pagination,
      page,
      pageSize,
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

    if (gridListView) {
      gridViewProps = Object.assign({}, gridViewProps, this.props.gridViewProps)

      if (pagination) {
        return <GridViewWithPagination {...gridViewProps} />
      }
      return <GridView {...gridViewProps} />
    }
    const FilteredPaginatedDictionaryList = withPagination(
      this.props.flashcard ? FlashcardList : DictionaryList,
      DefaultFetcherParams.pageSize
    )
    return <FilteredPaginatedDictionaryList {...gridViewProps} columns={columns} />
  }

  _gridListFetcher(fetcherParams) {
    this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }
}
