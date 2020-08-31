import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
import useTheme from 'DataSource/useTheme'

/**
 * @summary WidgetRegistrationsData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 *
 */
function WidgetRegistrationsData({ children, columnRender }) {
  const { theme } = useTheme()
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortBy /*, setSortBy*/] = useState('date')
  const [page /*, setPage*/] = useState(0)
  const [pageSize /*, setPageSize*/] = useState(5)
  const { navigate } = useNavigationHelpers()
  const { count: tasksCount = 0, /*fetchUserGroupTasksRemoteData, */ userId } = useUserGroupTasks()

  // User Registration:
  // https://dev.firstvoices.com/tasks/users/07d51b18-f6a3-4ba0-9e44-3e557fc30a07
  const dialectId = '07d51b18-f6a3-4ba0-9e44-3e557fc30a07'
  const urlUserRegistration = `/tasks/users/${dialectId}`
  const onRowClick = (event, { id }) => {
    navigate(
      dialectId
        ? `${urlUserRegistration}?task=${id}&page=${page +
            1}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortDirection}`
        : '#'
    )
  }

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const remoteData = (/*data*/) => {
    /*const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize: _pageSize } = data

    const { field: _sortBy = 'date' } = orderBy
    setSortBy(_sortBy)
    setPage(pageIndex)
    setPageSize(_pageSize)
    return fetchUserGroupTasksRemoteData({
      pageIndex,
      pageSize: _pageSize,
      sortBy: _sortBy,
      sortOrder,
      userId,
    })*/

    // Remote Data: return a promise that resolves with { data, page /*zero-indexed*/, totalCount }
    return new Promise((resolve /*, reject*/) => {
      resolve({
        data: [
          {
            name: 'name 1',
            email: 'email@one.com',
            date: Date.now(),
          },
        ],
        page: 0,
        totalCount: 1,
      })
    })
  }
  const cellStyle = selectn(['widget', 'cellStyle'], theme) || {}
  const childrenData = {
    columns: [
      {
        title: '',
        field: 'icon',
        render: columnRender.icon,
        sorting: false,
        cellStyle,
      },
      {
        title: 'Name',
        field: 'name',
        cellStyle,
      },
      {
        title: 'Email',
        field: 'email',
        cellStyle,
      },
      {
        title: 'Date added',
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
const { array, func } = PropTypes
WidgetRegistrationsData.propTypes = {
  children: func,
  columnRender: array,
}

export default WidgetRegistrationsData
