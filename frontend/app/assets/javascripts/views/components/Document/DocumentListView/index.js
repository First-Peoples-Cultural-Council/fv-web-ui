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
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import withPagination from 'views/hoc/grid-list/with-pagination'

const GridView = React.lazy(() => import('views/pages/explore/dialect/learn/base/grid-view'))
const DictionaryListV2 = React.lazy(() => import('views/components/Browsing/dictionary-list-v2'))

const DocumentListView = (props) => {
  const getContent = () => {
    if (props.gridListView) {
      const gridViewProps = Object.assign(
        {},
        {
          cellHeight: 160,
          cols: props.gridCols,
          cssModifier: props.cssModifier,
          dialect: props.dialect,
          disablePageSize: props.disablePageSize,
          fetcher: gridListFetcher,
          fetcherParams: { currentPageIndex: props.page, pageSize: props.pageSize },
          flashcardTitle: props.flashcardTitle,
          gridListTile: props.gridListTile,
          items: selectn('response.entries', props.data),
          metadata: selectn('response', props.data),
          pagination: props.pagination,
          style: { overflowY: 'auto', maxHeight: '50vh' },
          type: props.type,
          // Search:
          handleSearch: props.handleSearch,
          hasSearch: props.hasSearch,
          resetSearch: props.resetSearch,
          hasViewModeButtons: props.hasViewModeButtons,
        },
        props.gridViewProps
      )
      const GridViewWithPagination = withPagination(GridView, 8)
      return props.pagination ? (
        <Suspense fallback={<div>Loading...</div>}>
          <GridViewWithPagination {...gridViewProps} />
        </Suspense>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <GridView {...gridViewProps} />
        </Suspense>
      )
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryListV2
          // Listview
          hasFlashcard={props.flashcard}
          hasPagination={props.pagination}
          hasSearch={props.hasSearch}
          hasViewModeButtons={props.hasViewModeButtons}
          rowClickHandler={props.rowClickHandler}
          // Listview: Batch
          batchConfirmationAction={props.batchConfirmationAction}
          batchTitleSelect={props.batchTitleSelect}
          batchTitleDeselect={props.batchTitleDeselect}
          batchFooterIsConfirmOrDenyTitle={props.batchFooterIsConfirmOrDenyTitle}
          batchFooterBtnInitiate={props.batchFooterBtnInitiate}
          batchFooterBtnDeny={props.batchFooterBtnDeny}
          batchFooterBtnConfirm={props.batchFooterBtnConfirm}
          batchSelected={props.batchSelected}
          setBatchSelected={props.setBatchSelected}
          batchDeletedUids={props.batchDeletedUids}
          setBatchDeletedUids={props.setBatchDeletedUids}
          // Listview: Sort
          sortHandler={props.sortHandler}
          // Listview: computed data
          computedData={props.computedData}
          // Search
          handleSearch={props.handleSearch}
          resetSearch={props.resetSearch}
          searchUi={props.searchUi}
          searchByMode={props.searchByMode}
          // ==================================================
          cellHeight={160}
          cols={props.gridCols}
          columns={props.columns}
          cssModifier={props.cssModifier}
          dialect={props.dialect}
          disablePageSize={props.disablePageSize}
          fetcher={gridListFetcher}
          fetcherParams={{ currentPageIndex: props.page, pageSize: props.pageSize }}
          flashcardTitle={props.flashcardTitle}
          gridListTile={props.gridListTile}
          items={selectn('response.entries', props.data)}
          metadata={selectn('response', props.data)}
          style={{ overflowY: 'auto', maxHeight: '50vh' }}
          type={props.type}
        />
      </Suspense>
    )
  }

  const gridListFetcher = (fetcherParams) => {
    props.refetcher(props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
  }

  return getContent()
}

const { any, bool, func, number, object, string } = PropTypes

DocumentListView.propTypes = {
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
  // Search
  handleSearch: func,
  resetSearch: func,
  hasSearch: bool,
  // List View
  hasViewModeButtons: bool,
  rowClickHandler: func,
}

DocumentListView.defaultProps = {
  cssModifier: '',
  data: {},
  pagination: true,
  usePrevResponse: false,
  onSelectionChange: () => {},
  flashcard: false,
  flashcardTitle: '',
}
export default DocumentListView
