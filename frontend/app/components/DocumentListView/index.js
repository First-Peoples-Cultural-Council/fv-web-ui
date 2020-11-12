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

import withPagination from 'components/withPagination'

const GridView = React.lazy(() => import('components/LearnBase/grid-view'))
const DictionaryList = React.lazy(() => import('components/DictionaryList/DictionaryList'))

const DocumentListView = (props) => {
  const commonProps = {
    exportDialectColumns: props.exportDialectColumns,
    exportDialectExportElement: props.exportDialectExportElement,
    exportDialectLabel: props.exportDialectLabel,
    exportDialectQuery: props.exportDialectQuery,
    hasExportDialect: props.hasExportDialect,
    // Listview
    data: props.data,
    hasFlashcard: props.flashcard,
    hasPagination: props.pagination,
    hasSearch: props.hasSearch,
    hasViewModeButtons: props.hasViewModeButtons,
    rowClickHandler: props.rowClickHandler,
    dictionaryListClickHandlerViewMode: props.dictionaryListClickHandlerViewMode,
    dictionaryListViewMode: props.dictionaryListViewMode,
    dictionaryListSmallScreenTemplate: props.dictionaryListSmallScreenTemplate,
    // Listview: Batch
    batchConfirmationAction: props.batchConfirmationAction,
    batchTitleSelect: props.batchTitleSelect,
    batchTitleDeselect: props.batchTitleDeselect,
    batchFooterIsConfirmOrDenyTitle: props.batchFooterIsConfirmOrDenyTitle,
    batchFooterBtnInitiate: props.batchFooterBtnInitiate,
    batchFooterBtnDeny: props.batchFooterBtnDeny,
    batchFooterBtnConfirm: props.batchFooterBtnConfirm,
    batchSelected: props.batchSelected,
    setBatchSelected: props.setBatchSelected,
    batchDeletedUids: props.batchDeletedUids,
    setBatchDeletedUids: props.setBatchDeletedUids,
    // Listview: Sort
    sortHandler: props.sortHandler,
    hasSorting: props.hasSorting,
    // Listview: computed data
    computedData: props.computedData,
    // Search
    childrenSearch: props.childrenSearch,
    handleSearch: props.handleSearch,
    resetSearch: props.resetSearch,
    searchUi: props.searchUi,
    searchByMode: props.searchByMode,
    searchDialectDataType: props.searchDialectDataType,
    // ==================================================
    cellHeight: 160,
    cols: props.gridCols,
    columns: props.columns,
    dialect: props.dialect,
    disablePageSize: props.disablePageSize,
    fetcher: (fetcherParams) => {
      props.refetcher(props, fetcherParams.currentPageIndex, fetcherParams.pageSize)
    },
    fetcherParams: { currentPageIndex: props.page, pageSize: props.pageSize },
    flashcardTitle: props.flashcardTitle,
    gridListTile: props.gridListTile,
    items: selectn('response.entries', props.data),
    metadata: selectn('response', props.data),
    style: { overflowY: 'auto', maxHeight: '50vh' },
    type: props.type,
  }

  let toRender = null
  if (props.gridListView) {
    const gridViewProps = Object.assign(commonProps, props.gridViewProps)

    if (props.pagination) {
      const GridViewWithPagination = withPagination(GridView, 8)
      toRender = (
        <Suspense fallback={<div>Loading...</div>}>
          <GridViewWithPagination {...gridViewProps} />
        </Suspense>
      )
    } else {
      toRender = (
        <Suspense fallback={<div>Loading...</div>}>
          <GridView {...gridViewProps} />
        </Suspense>
      )
    }
  } else {
    toRender = (
      <Suspense fallback={<div>Loading...</div>}>
        <DictionaryList {...commonProps} />
      </Suspense>
    )
  }
  return toRender
}

const { any, array, bool, func, number, object, string } = PropTypes
DocumentListView.propTypes = {
  // Export
  hasExportDialect: bool,
  exportDialectExportElement: string,
  exportDialectColumns: string,
  exportDialectLabel: string,
  exportDialectQuery: string,
  // className,
  columns: array,
  // cssModifier: string,
  data: object,
  dialect: object,
  dictionaryListSmallScreenTemplate: func,
  disablePageSize: bool,
  flashcard: bool,
  flashcardTitle: string,
  gridCols: any, // TODO: set appropriate propType
  gridListTile: any, // TODO: set appropriate propType
  gridListView: bool,
  gridViewProps: object,
  handleSearch: func,
  hasSearch: bool,
  searchDialectDataType: number,
  hasViewModeButtons: bool,
  page: number,
  pageSize: number,
  pagination: bool,
  refetcher: func,
  resetSearch: func,
  rowClickHandler: func,
  type: string,
}

DocumentListView.defaultProps = {
  // cssModifier: '',
  data: {},
  pagination: true,
  flashcard: false,
  flashcardTitle: '',
}
export default DocumentListView
