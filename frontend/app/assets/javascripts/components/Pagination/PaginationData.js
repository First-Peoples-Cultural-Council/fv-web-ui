import { useState } from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PaginationData
 * @version 1.0.1
 *
 * @description PaginationData manages state for PaginationPresentation.
 *
 * @component
 *
 * @prop {function} children function to handle output from data layer
 * @prop {number} resultsCount number of results
 * @prop {number} [initialPageSize] starting page size. used on init, then it's internally controlled
 * @prop {number} [initialPage] starting page selected. used on init, then it's internally controlled
 * @prop {function} onUpdate called anytime there is a change to pageSize or page
 *
 * @returns {props.children()} Calls children with { onChangePage, onChangePageSize, pageCount, pageSize,  page }
 *
 */
function PaginationData({ initialPageSize, initialPage, onUpdate, resultsCount, children }) {
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [page, setPage] = useState(initialPage)
  const onChangePageSize = (value) => {
    // reset page when pageSize changes
    const newPage = 1
    onUpdate({
      page: newPage,
      pageSize: value,
    })
    setPage(newPage)
    setPageSize(value)
  }
  const pageCount = Math.ceil(resultsCount / pageSize)
  const onChangePage = (value) => {
    const newPage = value > pageCount ? pageCount : value

    onUpdate({
      page: newPage,
      pageSize,
    })

    setPage(newPage)

    // For longer pages, user should be taken to the top when changing pages
    // document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  return children({
    onChangePage,
    onChangePageSize,
    pageCount,
    pageSize,
    page,
  })
}
// PROPTYPES
const { func, number } = PropTypes
PaginationData.propTypes = {
  children: func.isRequired,
  initialPage: number,
  initialPageSize: number,
  pageCount: number,
  resultsCount: number,
}
PaginationData.defaultProps = {
  initialPage: 1,
  initialPageSize: 10,
  pageCount: 1,
  resultsCount: 0,
}

export default PaginationData
