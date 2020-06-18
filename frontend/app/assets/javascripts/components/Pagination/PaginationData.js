import PropTypes from 'prop-types'
/**
 * @summary PaginationData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children props.children({ onChangePage, onChangePageSize, page, pageCount, pageSize})
 * @param {function} [props.onPaginationUpdate] Called anytime there is a change to pageSize or page. Default: ()=>{}
 * @param {number} [props.page] Default: 1
 * @param {number} [props.pageSize] Default: 10
 * @param {number} [props.resultsCount] Number of results. Default: 0
 *
 * @see {@link PaginationPresentation} for info on the children callback object
 */
function PaginationData({ children, onPaginationUpdate, page, pageSize, resultsCount }) {
  const pageCount = resultsCount === 0 ? 1 : Math.ceil(resultsCount / pageSize)

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
  page: number,
  pageSize: number,
  pageCount: number,
  resultsCount: number,
}
PaginationData.defaultProps = {
  page: 1,
  pageSize: 10,
  pageCount: 1,
  resultsCount: 0,
  onPaginationUpdate: () => {},
}

export default PaginationData
