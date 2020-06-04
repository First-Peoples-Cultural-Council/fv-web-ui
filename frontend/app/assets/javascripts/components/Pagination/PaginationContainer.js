import React from 'react'
import PropTypes from 'prop-types'

import PaginationPresentation from './PaginationPresentation'
import PaginationData from './PaginationData'

/**
 * @summary PaginationContainer
 * @description Knits together Pagination Data & Presentation
 * @version 1.0.1
 *
 * @component
 *
 * @prop {node} children Content to be paged
 * @prop {node} childrenUnderPageSize Pass in markup to render underneath the Page Size select
 * @prop {number} initialPage Starting Page number, will be taken over by Data's internal state
 * @prop {number} initialPageSize Starting Page Size number, will be taken over by Data's internal state
 * @prop {function} onUpdate Called when there are changes to page || pageSize, use with ancestors to fetch new data
 * @prop {number} resultsCount Number of hits, items, results count, etc
 * @prop {boolean} showPageSize Toggle visibility of the Page Size select list
 */
function PaginationContainer({
  children,
  childrenUnderPageSize,
  initialPage,
  initialPageSize,
  onUpdate,
  resultsCount,
  showPageSize,
}) {
  return (
    <PaginationData
      resultsCount={resultsCount}
      initialPageSize={initialPageSize}
      initialPage={initialPage}
      onUpdate={onUpdate}
    >
      {({ onChangePage, onChangePageSize, pageSize, page, pageCount }) => {
        return (
          <PaginationPresentation
            showPageSize={showPageSize}
            childrenUnderPageSize={childrenUnderPageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
            resultsCount={resultsCount}
            pageSize={pageSize}
            page={page}
            pageCount={pageCount}
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
  initialPage: number,
  initialPageSize: number,
  onUpdate: func,
  resultsCount: number,
  showPageSize: bool,
}
export default PaginationContainer
