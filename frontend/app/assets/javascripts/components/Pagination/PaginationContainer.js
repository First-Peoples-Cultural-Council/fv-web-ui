import React from 'react'
import PropTypes from 'prop-types'

import PaginationPresentation from './PaginationPresentation'
import PaginationData from './PaginationData'

/**
 * @summary PaginationContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.children Content to be paged
 * @param {node} props.childrenUnderPageSize Pass in markup to render underneath the Page Size select
 * @param {function} props.onPaginationUpdate Called when there are changes to page || pageSize, use with ancestors to fetch new data
 * @param {number} props.page Page number
 * @param {number} props.pageSize Page Size number
 * @param {number} props.resultsCount Number of hits, items, results count, etc
 * @param {boolean} props.showPageSize Toggle visibility of the Page Size select list
 *
 * @returns {node} jsx markup
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
