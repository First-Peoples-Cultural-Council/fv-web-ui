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
import React, { Component, PropTypes } from 'react'
import selectn from 'selectn'
import NavigationHelpers from 'common/NavigationHelpers'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * Data List View
 * NOTE: The `class` that `extends` `DataListView` must define `fetchData`, `_fetchListViewData` functions
 * TODO: Convert to composition vs. inheritance https://facebook.github.io/react/docs/composition-vs-inheritance.html
 */
export default class DataListView extends Component {
  constructor(props, context) {
    super(props, context)

    if (typeof this.fetchData === 'undefined') {
      // eslint-disable-next-line
      console.warn("The `class` that `extends` `DataListView` must define a `fetchData` function")
    }

    if (typeof this._fetchListViewData === 'undefined') {
      // eslint-disable-next-line
      console.warn("The `class` that `extends` `DataListView` must define a `_fetchListViewData` function")
    }
  }

  static defaultProps = {}
  static propTypes = {
    controlViaURL: PropTypes.any, // TODO: set appropriate propType
    routeParams: PropTypes.any, // TODO: set appropriate propType
    DEFAULT_PAGE: PropTypes.any, // TODO: set appropriate propType
    DEFAULT_PAGE_SIZE: PropTypes.any, // TODO: set appropriate propType
    DEFAULT_SORT_TYPE: PropTypes.any, // TODO: set appropriate propType
    DEFAULT_SORT_COL: PropTypes.any, // TODO: set appropriate propType
    windowPath: PropTypes.any, // TODO: set appropriate propType
    filter: PropTypes.any, // TODO: set appropriate propType
    pushWindowPath: PropTypes.any, // TODO: set appropriate propType
    splitWindowPath: PropTypes.any, // TODO: set appropriate propType
    onPaginationReset: PropTypes.any, // TODO: set appropriate propType
    DISABLED_SORT_COLS: PropTypes.any, // TODO: set appropriate propType
    onPagePropertiesChange: PropTypes.any, // TODO: set appropriate propType
  }

  // NOTE: The `class` that `extends` `DataListView` must define a `fetchData` function
  fetchData() {
    // eslint-disable-next-line
    console.warn("The `class` that `extends` `DataListView` must define a `fetchData` function")
  }

  // NOTE: The `class` that `extends` `DataListView` must define a `_fetchListViewData` function
  _fetchListViewData() {
    // eslint-disable-next-line
    console.warn("The `class` that `extends` `DataListView` must define a `_fetchListViewData` function")
  }

  // Fetch data on initial render
  componentDidMount() {
    this._resetColumns(this.props)
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  // TODO: At minimum, migrate to `getDerivedStateFromProps()` or https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  componentWillReceiveProps(nextProps) {
    if (nextProps.controlViaURL) {
      if (
        nextProps.routeParams.page !== this.props.routeParams.page ||
        nextProps.routeParams.pageSize !== this.props.routeParams.pageSize
      ) {
        this._fetchListViewData(
          nextProps,
          nextProps.DEFAULT_PAGE,
          nextProps.DEFAULT_PAGE_SIZE,
          nextProps.DEFAULT_SORT_TYPE,
          nextProps.DEFAULT_SORT_COL
        )
        this._resetPagination(nextProps)
      }
    } else {
      if (nextProps.windowPath !== this.props.windowPath) {
        this.fetchData(nextProps)
      }
    }

    if (nextProps.routeParams.area !== this.props.routeParams.area) {
      this._resetColumns(nextProps)
      this._resetPagination(nextProps)
    }

    if (
      this.props.filter.has('currentAppliedFilter') &&
      !this.props.filter.get('currentAppliedFilter').equals(nextProps.filter.get('currentAppliedFilter'))
    ) {
      this._fetchListViewData(
        nextProps,
        nextProps.DEFAULT_PAGE,
        nextProps.DEFAULT_PAGE_SIZE,
        nextProps.DEFAULT_SORT_TYPE,
        nextProps.DEFAULT_SORT_COL
      )
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path)
  }

  _handleRefetch(dataGridProps, page, pageSize) {
    this.setState({
      pageInfo: {
        page: page,
        pageSize: pageSize,
      },
    })

    let sortInfo = null
    let currentSortCols = null

    if (this.state.hasOwnProperty('sortInfo') && this.state.sortInfo.hasOwnProperty('currentSortType')) {
      sortInfo = this.state.sortInfo.currentSortType
      currentSortCols = this.state.sortInfo.currentSortCols
    }

    if (!this.props.controlViaURL) {
      this._fetchListViewData(this.props, page, pageSize, sortInfo, currentSortCols)
    } else {
      const _urlPage = selectn('page', this.props.routeParams)
      const _urlPageSize = selectn('pageSize', this.props.routeParams)
      const urlPage = _urlPage !== undefined ? parseInt(_urlPage, 10) : _urlPage
      const urlPageSize = _urlPageSize !== undefined ? parseInt(_urlPageSize, 10) : _urlPageSize
      // If page and pageSize exist, and are different, replace them; otherwise - add them
      if (urlPage && urlPageSize) {
        if (urlPage !== page || urlPageSize !== pageSize) {
          NavigationHelpers.navigateForwardReplaceMultiple(
            this.props.splitWindowPath,
            [pageSize, page],
            this.props.pushWindowPath
          )
        }
      } else {
        NavigationHelpers.navigateForward(this.props.splitWindowPath, [pageSize, page], this.props.pushWindowPath)
      }

      // If pageSize has changed, reset page
      if (urlPageSize && pageSize !== urlPageSize && this.props.onPaginationReset) {
        this.props.onPaginationReset(pageSize)
      }
    }
  }

  _handleSortChange(sortInfo) {
    let colRequestSkipped = false
    let sortCol = []
    let sortType = []

    sortInfo.map((sortColumn, i) => {
      const name = selectn('[' + i + '].name', sortInfo)

      if (this.props.DISABLED_SORT_COLS.indexOf(name) === -1) {
        const definedCol = this.state.columns.find((item) => item.name === name)

        sortCol.push(selectn('sortName', definedCol) ? selectn('sortName', definedCol) : name)
        sortType.push(selectn('[' + i + '].dir', sortInfo) === -1 ? 'desc' : 'asc')
      } else {
        if (i === sortInfo.length - 1) colRequestSkipped = true
      }
    })

    if (sortCol.length === 0) {
      sortCol = [this.props.DEFAULT_SORT_COL]
      sortType = [this.props.DEFAULT_SORT_TYPE]
    }

    const joinedSortType = sortType.join()
    const joinedSortCols = sortCol.join()

    // Skip updating if last sort addition is disabled
    if (colRequestSkipped) return

    this._fetchListViewData(
      this.props,
      this.props.DEFAULT_PAGE,
      this.props.DEFAULT_PAGE_SIZE,
      joinedSortType,
      joinedSortCols
    )

    const newSortInfo = {
      uiSortOrder: sortInfo,
      currentSortCols: joinedSortCols,
      currentSortType: joinedSortType,
    }

    // Update page properties to use when navigating away
    this.props.onPagePropertiesChange({ sortInfo: newSortInfo })

    this.setState({
      sortInfo: newSortInfo,
    })
  }

  _handleColumnOrderChange(index, dropIndex) {
    const col = this.state.columns[index]
    this.state.columns.splice(index, 1)
    this.state.columns.splice(dropIndex, 0, col)
    this.setState({})
  }

  _resetColumns(props) {
    if (this.state.fixedCols || this.state.hideStateColumn) {
      return
    }

    // Toggle 'state' column for section/workspaces view
    if (this.state.hasOwnProperty('columns')) {
      if (props.routeParams.area === 'sections') {
        const stateCol = this.state.columns.findIndex((item) => item.name === 'state')

        this.state.columns.splice(stateCol, 1)
      } else {
        this.state.columns.push({ name: 'state', title: intl.trans('state', 'State', 'first') })
      }
    }
  }

  _resetPagination(props) {
    this.setState({
      pageInfo: {
        page: props.DEFAULT_PAGE,
        pageSize: props.DEFAULT_PAGE_SIZE,
      },
    })
  }
}
