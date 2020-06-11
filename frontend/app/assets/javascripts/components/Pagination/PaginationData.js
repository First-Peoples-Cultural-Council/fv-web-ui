import PropTypes from 'prop-types'
/**
 * @summary PaginationData
 * @version 1.0.1
 *
 * @description PaginationData manages state for PaginationPresentation.
 *
 * @component
 *
 * @prop {object} props
 * @prop {function} props.children Render prop technique. Assumes children will be a function, eg: children({ ... })
 * @prop {function} props.onPaginationUpdate called anytime there is a change to pageSize or page
 * @prop {number} [props.initialPage] starting page selected. used on init, then is internally controlled
 * @prop {number} [props.initialPageSize] starting page size. used on init, then is internally controlled
 * @prop {number} props.resultsCount number of results
 *
 * @returns {object} output = { onChangePage, onChangePageSize, page, pageCount, pageSize}
 * @returns {function} output.onChangePage
 * @returns {function} output.onChangePageSize
 * @returns {number} output.page
 * @returns {number} output.pageCount
 * @returns {number} output.pageSize
 */
function PaginationData({ children, page, pageSize, onPaginationUpdate, resultsCount }) {
  const pageCount = Math.ceil(resultsCount / pageSize)

  const onChangePageSize = (value) => {
    // reset page when pageSize changes
    const valueNumber = Number(value)
    const newPage = 1
    onPaginationUpdate({
      page: newPage,
      pageSize: valueNumber,
    })
  }

  const onChangePage = (value) => {
    const valueNumber = Number(value)
    const newPage = valueNumber > pageCount ? pageCount : valueNumber

    onPaginationUpdate({
      page: newPage,
      pageSize,
    })
  }

  return children({
    onChangePage,
    onChangePageSize,
    page,
    pageCount,
    pageSize,
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
