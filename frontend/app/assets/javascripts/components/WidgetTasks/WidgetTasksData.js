import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useDashboard from 'DataSource/useDashboard'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
import useTheme from 'DataSource/useTheme'
/**
 * @summary WidgetTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 *
 */
function WidgetTasksData({ children, columnRender }) {
  const { theme } = useTheme()
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortBy, setSortBy] = useState('date')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const { navigate } = useNavigationHelpers()
  const { count: tasksCount = 0, fetchTasksRemoteData, userId } = useDashboard()

  const onRowClick = (event, { id }) => {
    navigate(
      `/dashboard/tasks?task=${id}&page=${page + 1}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortDirection}`
    )
  }

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const remoteData = (data) => {
    const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize: _pageSize } = data

    const { field: _sortBy = 'date' } = orderBy
    setSortBy(_sortBy)
    setPage(pageIndex)
    setPageSize(_pageSize)
    return fetchTasksRemoteData({
      pageIndex,
      pageSize: _pageSize,
      sortBy: _sortBy,
      sortOrder,
      userId,
    })
  }
  const cellStyle = selectn(['widget', 'cellStyle'], theme) || {}
  const childrenData = {
    columns: [
      {
        title: '',
        field: 'itemType',
        render: columnRender.itemType,
        sorting: false,
        cellStyle,
      },
      {
        title: 'Entry title',
        field: 'titleItem',
        cellStyle,
        sorting: false,
      },
      {
        title: 'Visibility change requested',
        field: 'titleTask',
        cellStyle,
        render: columnRender.titleTask,
      },
      {
        title: 'Requested by',
        field: 'initiatorEmail',
        cellStyle,
      },
      {
        title: 'Date submitted',
        field: 'date',
        cellStyle,
      },
    ],
    // NOTE: when not logged in, show an empty data set
    data: userId === 'Guest' ? [] : remoteData,
    onOrderChange,
    onRowClick,
    options: {
      paging: true,
      pageSizeOptions: [5], // NOTE: with only one option the Per Page Select is hidden
      sorting: true,
    },
    sortDirection,
  }
  return (
    <TableContextCount.Provider value={Number(tasksCount)}>
      <TableContextSort.Provider value={sortDirection}>{children(childrenData)}</TableContextSort.Provider>
    </TableContextCount.Provider>
  )
}
// PROPTYPES
const { func, object } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
  columnRender: object,
}
WidgetTasksData.defaultProps = {
  columnRender: {
    itemType: () => '',
  },
}
export default WidgetTasksData
