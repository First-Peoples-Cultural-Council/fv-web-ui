import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Pagination from 'views/components/Navigation/Pagination'

import { MenuItem, Select, TextField } from '@material-ui/core'

import UIHelpers from 'common/UIHelpers'
import FVLabel from 'views/components/FVLabel/index'
/**
 * @summary PaginationPresentation
 * @version 1.0.1
 *
 * @description
 *
 * @component
 *
 * @prop {node} children
 * @prop {node} childrenUnderPageSize
 * @prop {function} onChangePage: call when changing page
 * @prop {function} onChangePageSize: call when changing pageSize
 * @prop {number} page
 * @prop {number} pageCount
 * @prop {number} pageSize
 * @prop {number} resultsCount number of results
 * @prop {boolean} [showPageSize] Defaults to true
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
    <div>
      <div className="row">
        <div className="col-xs-12">{children}</div>
      </div>

      <div className="row PrintHide" style={{ marginTop: '15px' }}>
        <div className={classNames('col-md-7', 'col-xs-12')} style={{ paddingBottom: '15px' }}>
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

        <div className={classNames('col-md-5', 'col-xs-12')} style={{ textAlign: 'right' }}>
          {showPageSize && (
            <div>
              <label style={{ verticalAlign: '4px', marginRight: '8px' }}>Page:</label>
              <span style={{ verticalAlign: '4px' }}>
                {page} / {pageCount}
              </span>
              <label
                style={{
                  verticalAlign: '4px',
                  marginRight: '8px',
                  marginLeft: '8px',
                  paddingLeft: '8px',
                  borderLeft: '1px solid #e0e0e0',
                }}
              >
                Per Page:
              </label>
              <Select
                style={{ width: '45px', marginRight: '8px' }}
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
              <label
                style={{
                  verticalAlign: '4px',
                  marginRight: '8px',
                  paddingLeft: '8px',
                  borderLeft: '1px solid #e0e0e0',
                }}
              >
                <FVLabel transKey="results" defaultStr="Results" transform="first" />
              </label>
              <span style={{ verticalAlign: '4px' }}>{resultsCount}</span>
            </div>
          )}
          {childrenUnderPageSize}
        </div>

        <div
          className={classNames('col-xs-12')}
          style={{
            textAlign: 'left',
            backgroundColor: '#f1f1f1',
            borderTop: '1px #d8d8d8 solid',
          }}
        >
          Skip to Page:
          <TextField
            style={{ paddingLeft: '5px' }}
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
  showPageSize: bool,
  resultsCount: number,
  pageCount: number,
  pageSize: number,
  page: number,
}
PaginationPresentation.defaultProps = {
  onChangePage: () => {},
  onChangePageSize: () => {},
  showPageSize: true,
  resultsCount: 0,
  pageSize: 10,
  page: 1,
  pageCount: 1,
}

export default PaginationPresentation
