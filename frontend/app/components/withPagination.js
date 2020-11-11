import React, { Component } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import classNames from 'classnames'

import ReactPaginate from 'react-paginate'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

import { MenuItem, Select, TextField } from '@material-ui/core'

import UIHelpers from 'common/UIHelpers'
import FVLabel from 'components/FVLabel'

/**
 * HOC: Adds pagination to a grid list
 */
const { any, bool, func, object } = PropTypes
export default function withPagination(ComposedFilter, pageSize = 10, pageRange = 10) {
  class PaginatedGridList extends Component {
    static propTypes = {
      appendControls: any, // TODO: set appropriate propType
      disablePageSize: bool,
      fetcher: func.isRequired,
      fetcherParams: object.isRequired,
      metadata: object,
    }
    static defaultProps = {
      disablePageSize: false,
      fetcher: () => {},
      fetcherParams: {},
      metadata: {
        resultsCount: 0,
        pageCount: 0,
      },
    }

    constructor(props, context) {
      super(props, context)

      this.state = {
        pageRange: pageRange,
        initialPageSize: parseInt(props.fetcherParams.pageSize, 10) || pageSize,
        currentPageSize: parseInt(props.fetcherParams.pageSize, 10) || pageSize,
        currentPageIndex: 1,
      }
      ;['_onPageChange', '_onPageSizeChange', '_onGoToPage', '_getPageSizeControls'].forEach(
        (method) => (this[method] = this[method].bind(this)),
      )
    }

    _onPageSizeChange(event) {
      const currentPageSize = event.target.value

      this.props.fetcher(
        Object.assign({}, this.props.fetcherParams, {
          currentPageIndex: this.state.currentPageIndex,
          pageSize: currentPageSize,
        }),
      )

      this.setState({ currentPageSize: currentPageSize })
    }

    _changePage(newPageIndex) {
      this.props.fetcher(
        Object.assign({}, this.props.fetcherParams, {
          currentPageIndex: newPageIndex,
          pageSize: this.state.currentPageSize,
        }),
      )

      this.setState({ currentPageIndex: newPageIndex })

      // For longer pages, user should be taken to the top when changing pages
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }

    _onPageChange(pagination) {
      this._changePage(pagination.selected + 1)
    }

    _onGoToPage(event) {
      let newPageIndex = event.target.value
      const maxPageIndex = Math.ceil(selectn('resultsCount', this.props.metadata) / this.state.currentPageSize)

      if (newPageIndex > maxPageIndex) {
        newPageIndex = maxPageIndex
      }

      this._changePage(newPageIndex)
    }

    render() {
      const pageSizeControl = this.props.disablePageSize ? null : this._getPageSizeControls()

      return (
        <div>
          <div className="row">
            <div className="col-xs-12">
              <ComposedFilter {...this.state} {...this.props} />
            </div>
          </div>

          <div className="row PrintHide" style={{ marginTop: '15px' }}>
            <div className={classNames('col-md-7', 'col-xs-12')} style={{ paddingBottom: '15px' }}>
              <ReactPaginate
                activeClassName={'active'}
                breakClassName={'pagination-page'}
                breakLabel={<a style={{ paddingBottom: '7px' }}>...</a>}
                containerClassName={'pagination'}
                forcePage={this.props.fetcherParams.currentPageIndex - 1}
                marginPagesDisplayed={0}
                nextLabel={<ChevronRight data-testid="pagination__next" />}
                onPageChange={this._onPageChange}
                pageCount={selectn('pageCount', this.props.metadata)}
                pageLinkClassName={'pagination-page'}
                pageRangeDisplayed={UIHelpers.isViewSize('xs') ? 3 : 10}
                previousLabel={<ChevronLeft />}
                subContainerClassName={'pages pagination'}
              />
            </div>

            <div className={classNames('col-md-5', 'col-xs-12')} style={{ textAlign: 'right' }}>
              {pageSizeControl}
              {this.props.appendControls}
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
                // hintText="Enter #"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this._onGoToPage(e)
                  }
                }}
              />
            </div>
          </div>
        </div>
      )
    }

    _getPageSizeControls() {
      return (
        <div>
          <label style={{ verticalAlign: '4px', marginRight: '8px' }}>Page:</label>
          <span style={{ verticalAlign: '4px' }}>
            {this.props.fetcherParams.currentPageIndex} /{' '}
            {Math.ceil(selectn('resultsCount', this.props.metadata) / this.state.currentPageSize)}
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
            value={this.state.currentPageSize}
            onChange={this._onPageSizeChange}
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
          <span style={{ verticalAlign: '4px' }}>{selectn('resultsCount', this.props.metadata)}</span>
        </div>
      )
    }
  }

  return PaginatedGridList
}
