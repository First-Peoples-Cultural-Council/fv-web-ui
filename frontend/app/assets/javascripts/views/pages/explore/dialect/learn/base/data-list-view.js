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
import React, { Component } from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import selectn from 'selectn'
import NavigationHelpers, { hasPagination, routeHasChanged } from 'common/NavigationHelpers'
import IntlService from 'views/services/intl'
import { WORKSPACES, SECTIONS } from 'common/Constants'

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
      console.warn('The `class` that `extends` `DataListView` must define a `fetchData` function')
    }

    if (typeof this._fetchListViewData === 'undefined') {
      // eslint-disable-next-line
      console.warn('The `class` that `extends` `DataListView` must define a `_fetchListViewData` function')
    }
  }

  static propTypes = {
    controlViaURL: PropTypes.any, // TODO: set appropriate propType
    routeParams: PropTypes.any, // TODO: set appropriate propType
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_TYPE: PropTypes.string,
    DEFAULT_SORT_COL: PropTypes.any, // TODO: set appropriate propType
    windowPath: PropTypes.any, // TODO: set appropriate propType
    filter: PropTypes.any, // TODO: set appropriate propType
    pushWindowPath: PropTypes.any, // TODO: set appropriate propType
    splitWindowPath: PropTypes.any, // TODO: set appropriate propType
    onPaginationReset: PropTypes.any, // TODO: set appropriate propType
    DISABLED_SORT_COLS: PropTypes.any, // TODO: set appropriate propType
    onPagePropertiesChange: PropTypes.any, // TODO: set appropriate propType
  }

  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'related_audio'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fvcharacter:alphabet_order',
    DEFAULT_SORT_TYPE: 'asc',
  }

  // NOTE: The `class` that `extends` `DataListView` must define a `fetchData` function
  fetchData() {
    // eslint-disable-next-line
    console.warn('The `class` that `extends` `DataListView` must define a `fetchData` function')
  }

  // NOTE: The `class` that `extends` `DataListView` must define a `_fetchListViewData` function
  _fetchListViewData() {
    // eslint-disable-next-line
    console.warn('The `class` that `extends` `DataListView` must define a `_fetchListViewData` function')
  }

  // Fetch data on initial render
  componentDidMount() {
    this._resetColumns(this.props)
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  // TODO: At minimum, migrate to `getDerivedStateFromProps()` or https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  componentDidUpdate(prevProps) {
    const _sortOrder = selectn(['navigationRouteSearch', 'sortOrder'], this.props) || this.props.DEFAULT_SORT_TYPE
    const _sortBy = selectn(['navigationRouteSearch', 'sortBy'], this.props) || this.props.DEFAULT_SORT_COL
    const letterChanged = this.props.routeParams.letter !== prevProps.routeParams.letter
    if (this.props.controlViaURL) {
      if (
        this.props.routeParams.page !== prevProps.routeParams.page ||
        this.props.routeParams.pageSize !== prevProps.routeParams.pageSize ||
        letterChanged
      ) {
        this._fetchListViewData(this.props, this.props.DEFAULT_PAGE, this.props.DEFAULT_PAGE_SIZE, _sortOrder, _sortBy)
        this._resetPagination(this.props)
        return
      }
    }

    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      }) ||
      letterChanged
    ) {
      // NOTE: fetchData also calls _fetchListViewData!
      this.fetchData(this.props)
      return
    }

    if (this.props.routeParams.area !== prevProps.routeParams.area) {
      this._resetColumns(this.props)
      this._resetPagination(this.props)
    }

    if (
      (prevProps.filter.has('currentAppliedFilter') &&
        !prevProps.filter.get('currentAppliedFilter').equals(this.props.filter.get('currentAppliedFilter'))) ||
      letterChanged
    ) {
      // TODO: should we use _sortOrder & _sortBy here as well?
      this._fetchListViewData(
        this.props,
        this.props.DEFAULT_PAGE,
        this.props.DEFAULT_PAGE_SIZE,
        this.props.DEFAULT_SORT_TYPE,
        this.props.DEFAULT_SORT_COL
      )
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace(SECTIONS, WORKSPACES) + '/' + path)
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
      // TODO: Investigate why splitWindowPath could not be used (instead of this.props.routeParams)
      // Note: routeParams is currently passed in via a parent component, not provided by Redux
      const _urlPage = selectn('page', this.props.routeParams)
      const _urlPageSize = selectn('pageSize', this.props.routeParams)
      const urlPage = _urlPage !== undefined ? parseInt(_urlPage, 10) : _urlPage
      const urlPageSize = _urlPageSize !== undefined ? parseInt(_urlPageSize, 10) : _urlPageSize

      const hasPaginationUrl = hasPagination(this.props.splitWindowPath)
      if (hasPaginationUrl) {
        // Replace pagination in url if present (eg: .../learn/words/10/1) and the incoming `page` || `pageSize` is different
        if (urlPage !== page || urlPageSize !== pageSize) {
          // urlPageSize / page
          NavigationHelpers.navigateForwardReplaceMultiple(
            this.props.splitWindowPath,
            [pageSize, page],
            this.props.pushWindowPath
          )
        }
      } else {
        // No pagination in url (eg: .../learn/words), append `page` & `pageSize`
        NavigationHelpers.navigateForward(this.props.splitWindowPath, [pageSize, page], this.props.pushWindowPath)
      }

      // If pageSize has changed, reset page
      if (urlPageSize && pageSize !== urlPageSize && this.props.onPaginationReset) {
        this.props.onPaginationReset(pageSize)
      }
    }
  }

  _handleRefetch2({ page = '1', pageSize = '10', preserveSearch = false, sortBy, sortOrder } = {}) {
    this.setState({
      pageInfo: {
        page: page,
        pageSize: pageSize,
      },
    })

    if (!this.props.controlViaURL) {
      const sortInfo = sortOrder || selectn('sortInfo.currentSortType', this.state) || null
      const currentSortCols = sortBy || selectn('sortInfo.currentSortCols', this.state) || null
      this._fetchListViewData(this.props, page, pageSize, sortInfo, currentSortCols)
    } else {
      // TODO: Investigate why splitWindowPath could not be used (instead of this.props.routeParams)
      const _urlPage = selectn('page', this.props.routeParams)
      const _urlPageSize = selectn('pageSize', this.props.routeParams)
      const urlPage = _urlPage !== undefined ? parseInt(_urlPage, 10) : _urlPage
      const urlPageSize = _urlPageSize !== undefined ? parseInt(_urlPageSize, 10) : _urlPageSize

      const navHelperCallback = (url) => {
        this.props.pushWindowPath(`${url}${preserveSearch ? window.location.search : ''}`)
      }

      const hasPaginationUrl = hasPagination(this.props.splitWindowPath)
      if (hasPaginationUrl) {
        // Replace pagination in url if present (eg: .../learn/words/10/1) and the incoming `page` || `pageSize` is different
        if (urlPage !== page || urlPageSize !== pageSize) {
          // urlPageSize / page
          NavigationHelpers.navigateForwardReplaceMultiple(
            this.props.splitWindowPath,
            [pageSize, page],
            navHelperCallback
          )
        }
      } else {
        // No pagination in url (eg: .../learn/words), append `page` & `pageSize`
        NavigationHelpers.navigateForward(this.props.splitWindowPath, [pageSize, page], navHelperCallback)
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

  _handleSortChangeV2({ sortBy = 'fv:custom_order', sortOrder = 'asc' } = {}) {
    this._fetchListViewData(this.props, this.props.DEFAULT_PAGE, this.props.DEFAULT_PAGE_SIZE, sortOrder, sortBy)

    const newSortInfo = {
      currentSortCols: sortBy,
      currentSortType: sortOrder,
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
      if (props.routeParams.area === SECTIONS) {
        const stateCol = this.state.columns.findIndex((item) => item.name === 'state')

        this.state.columns.splice(stateCol, 1)
      } else {
        this.state.columns.push({
          name: 'state',
          title: intl.trans('state', 'State', 'first'),
        })
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
