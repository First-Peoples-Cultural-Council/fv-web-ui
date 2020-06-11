import React from 'react'
import PropTypes from 'prop-types'

import PaginationPresentation from './PaginationPresentation'
import PaginationData from './PaginationData'

/**
 * @summary PaginationContainer
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {node} props.children Content to be paged
 * @prop {node} props.childrenUnderPageSize Pass in markup to render underneath the Page Size select
 * @prop {function} props.onPaginationUpdate Called when there are changes to page || pageSize, use with ancestors to fetch new data
 * @prop {number} props.page Page number
 * @prop {number} props.pageSize Page Size number
 * @prop {number} props.resultsCount Number of hits, items, results count, etc
 * @prop {boolean} props.showPageSize Toggle visibility of the Page Size select list
 */
function PaginationContainer({
  children,
  childrenUnderPageSize,
  onPaginationUpdate,
  page,
  pageSize,
  resultsCount,
  showPageSize,
}) {
  return (
    <PaginationData onPaginationUpdate={onPaginationUpdate} page={page} pageSize={pageSize} resultsCount={resultsCount}>
      {({ onChangePage, onChangePageSize, page: dataPage, pageCount, pageSize: dataPageSize }) => {
        return (
          <PaginationPresentation
            childrenUnderPageSize={childrenUnderPageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            page={dataPage}
            pageCount={pageCount}
            pageSize={dataPageSize}
            resultsCount={resultsCount}
            showPageSize={showPageSize}
          >
            {children}
          </PaginationPresentation>
        )
      }}
    </PaginationData>
  )
}
// PROPTYPES
const { node, func, bool, number } = PropTypes
PaginationContainer.propTypes = {
  children: node,
  childrenUnderPageSize: node,
  onPaginationUpdate: func,
  page: number,
  pageSize: number,
  resultsCount: number,
  showPageSize: bool,
}
export default PaginationContainer
