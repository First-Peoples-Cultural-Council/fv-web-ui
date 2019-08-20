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
import DictionaryList from 'views/components/Browsing/dictionary-list'
import FlashcardList from 'views/components/Browsing/flashcard-list'

import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

const GridViewWithPagination = withPagination(GridView, 8)
const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

const { any, bool, func, number, string } = PropTypes

export default class DocumentListView extends Component {
  static propTypes = {
    cssModifier: string,
    columns: any, // TODO: set appropriate propType
    data: any, // TODO: set appropriate propType
    dialect: any, // TODO: set appropriate propType
    disablePageSize: any, // TODO: set appropriate propType
    gridCols: any, // TODO: set appropriate propType
    gridListTile: any, // TODO: set appropriate propType
    gridListView: any, // TODO: set appropriate propType
    gridViewProps: any, // TODO: set appropriate propType
    onSelectionChange: func,
    onSortChange: any, // TODO: set appropriate propType
    page: number,
    pageSize: number,
    pagination: bool,
    refetcher: func,
    renderSimpleTable: any, // TODO: set appropriate propType
    sortInfo: any, // TODO: set appropriate propType
    type: any, // TODO: set appropriate propType
    flashcard: bool,
    flashcardTitle: string,
    usePrevResponse: bool,
  }

  static defaultProps = {
    cssModifier: '',
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
  }

  intl = IntlService.instance

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        page: 1,
      })
    }
  }

  render() {
    const {
      columns,
      cssModifier,
      data,
      dialect,
      disablePageSize,
      flashcardTitle,
      gridCols,
      gridListTile,
      gridListView,
      pagination,
      page,
      pageSize,
      type,
    } = this.props

    let gridViewProps = {
      cssModifier,
      style: { overflowY: 'auto', maxHeight: '50vh' },
      cols: gridCols,
      cellHeight: 160,
      fetcher: this._gridListFetcher,
      type,
      pagination,
      fetcherParams: { currentPageIndex: page, pageSize: pageSize },
      metadata: selectn('response', data),
      gridListTile,
      disablePageSize,
      dialect,
      items: selectn('response.entries', data),
      flashcardTitle,
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

  _gridListFetcher = (fetcherParams) => {
    this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }
}
