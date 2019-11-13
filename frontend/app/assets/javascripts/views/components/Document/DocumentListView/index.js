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
import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Media from 'react-media'

import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'

const GridView = React.lazy(() => import('views/pages/explore/dialect/learn/base/grid-view'))
// const DictionaryList = React.lazy(() => import('views/components/Browsing/dictionary-list'))
const DictionaryListV2 = React.lazy(() => import('views/components/Browsing/dictionary-list-v2'))
const DictionaryListSmallScreen = React.lazy(() => import('views/components/Browsing/dictionary-list-small-screen'))
const FlashcardList = React.lazy(() => import('views/components/Browsing/flashcard-list'))

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 10, sortBy: 'fv:custom_order', sortOrder: 'asc' }

const { any, bool, func, number, object, string } = PropTypes

export default class DocumentListView extends Component {
  static propTypes = {
    cssModifier: string,
    columns: any, // TODO: set appropriate propType
    data: any, // TODO: set appropriate propType
    dialect: object,
    disablePageSize: any, // TODO: set appropriate propType
    gridCols: any, // TODO: set appropriate propType
    gridListTile: any, // TODO: set appropriate propType
    gridListView: bool,
    gridViewProps: any, // TODO: set appropriate propType
    onSelectionChange: func,
    onSortChange: func,
    page: number,
    pageSize: number,
    pagination: bool,
    refetcher: func,
    renderSimpleTable: bool,
    sortInfo: any, // TODO: set appropriate propType
    type: string,
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
    // reset pagination after new data
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

    const listViewProps = {
      cellHeight: 160,
      cols: gridCols,
      cssModifier,
      dialect,
      disablePageSize,
      fetcher: this._gridListFetcher,
      fetcherParams: { currentPageIndex: page, pageSize: pageSize },
      flashcardTitle,
      gridListTile,
      items: selectn('response.entries', data),
      metadata: selectn('response', data),
      pagination,
      style: { overflowY: 'auto', maxHeight: '50vh' },
      type,
      handleSearch: this.props.handleSearch,
      resetSearch: this.props.resetSearch,
    }
    return (
      <Media
        queries={{
          small: '(max-width: 850px)',
          medium: '(min-width: 851px)',
        }}
      >
        {(matches) => {
          let mediaContent = null
          // Small screen
          // -----------------------------------------
          if (matches.small) {
            const FilteredPaginatedDictionaryListSmallScreen = withPagination(
              this.props.flashcard ? FlashcardList : DictionaryListSmallScreen,
              10
            )

            mediaContent = (
              <Suspense fallback={<div>Loading...</div>}>
                <FilteredPaginatedDictionaryListSmallScreen {...listViewProps} columns={columns} />
              </Suspense>
            )
          }
          // Large screen
          // -----------------------------------------
          if (matches.medium) {
            // Large screen: grid
            if (gridListView) {
              const gridViewProps = Object.assign({}, listViewProps, this.props.gridViewProps)
              const GridViewWithPagination = withPagination(GridView, 8)
              mediaContent = pagination ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <GridViewWithPagination {...gridViewProps} />
                </Suspense>
              ) : (
                <Suspense fallback={<div>Loading...</div>}>
                  <GridView {...gridViewProps} />
                </Suspense>
              )
            } else {
              // Large screen: list
              const FilteredPaginatedDictionaryList = withPagination(
                this.props.flashcard ? FlashcardList : DictionaryListV2,
                DefaultFetcherParams.pageSize
              )
              mediaContent = (
                <Suspense fallback={<div>Loading...</div>}>
                  <FilteredPaginatedDictionaryList {...listViewProps} columns={columns} />
                </Suspense>
              )
            }
          }
          return mediaContent
        }}
      </Media>
    )
  }

  _gridListFetcher = (fetcherParams) => {
    this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }
}
