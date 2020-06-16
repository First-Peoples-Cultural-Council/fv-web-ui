import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, Select, TextField } from '@material-ui/core'

import Pagination from 'views/components/Navigation/Pagination'
import UIHelpers from 'common/UIHelpers'
import FVLabel from 'views/components/FVLabel/index'
import '!style-loader!css-loader!./Pagination.css'
/*
childrenUnderPageSize
onChangePage
onChangePageSize
page
pageCount
pageSize
resultsCount
showPageSize
*/
/**
 * @summary PaginationPresentation
 * @version 1.0.1
 *
 * @component
 *
 * @param {object} props
 * @param {node} props.children The paged data
 * @param {node} [props.childrenUnderPageSize] Slot to add markup just below the "per page" select.
 * @param {function} [props.onChangePage] Called when changing page. Default: () => {}
 * @param {function} [props.onChangePageSize] Called when changing pageSize. Default: () => {}
 * @param {number} [props.page] Default: 1
 * @param {number} [props.pageCount] Default: 1
 * @param {number} [props.pageSize] Default: 10
 * @param {number} [props.resultsCount] Number of results. Default: 0
 * @param {boolean} [props.showPageSize] Default: true
 *
 * @returns {node} jsx markup
 */
function PaginationPresentation({
  children,
  childrenUnderPageSize,
  onChangePage,
  onChangePageSize,
  page,
  pageCount,
  pageSize,
  resultsCount,
  showPageSize,
}) {
  return (
    <div className="Pagination">
      <div className="row">
        <div className="col-xs-12">{children}</div>
      </div>

      <div className="row PrintHide Pagination__container">
        <div className="col-md-7 col-xs-12 Pagination__pager">
          <Pagination
            forcePage={page - 1}
            pageCount={pageCount}
            marginPagesDisplayed={0}
            pageRangeDisplayed={UIHelpers.isViewSize('xs') ? 3 : 10}
            onPageChange={(paginationOutput) => {
              onChangePage(paginationOutput.selected + 1)
            }}
          />
        </div>

        <div className="col-md-5 col-xs-12 Pagination__pageSizeContainer">
          {showPageSize && (
            <>
              <label className="Pagination__pageSizeLabel">Page:</label>
              <span className="Pagination__pageSizePageOverPageCount">
                {page} / {pageCount}
              </span>
              <label className="Pagination__pageSizePerPageLabel">Per Page:</label>
              <Select
                className="Pagination__pageSizePerPageSelect"
                value={pageSize}
                onChange={(event) => {
                  onChangePageSize(event.target.value)
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={250}>250</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
              <label className="Pagination__resultsLabel">
                <FVLabel transKey="results" defaultStr="Results" transform="first" />
              </label>
              <span className="Pagination__resultsCount">{resultsCount}</span>
            </>
          )}
          {childrenUnderPageSize}
        </div>

        <div className="col-xs-12 Pagination__skipContainer">
          Skip to Page:
          <TextField
            className="Pagination__skipPageNumber"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                onChangePage(event.target.value)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { node, bool, func, /*object, */ number } = PropTypes
PaginationPresentation.propTypes = {
  children: node,
  childrenUnderPageSize: node,
  onChangePage: func,
  onChangePageSize: func,
  page: number,
  pageCount: number,
  pageSize: number,
  resultsCount: number,
  showPageSize: bool,
}
PaginationPresentation.defaultProps = {
  onChangePage: () => {},
  onChangePageSize: () => {},
  page: 1,
  pageCount: 1,
  pageSize: 10,
  resultsCount: 0,
  showPageSize: true,
}

export default PaginationPresentation
