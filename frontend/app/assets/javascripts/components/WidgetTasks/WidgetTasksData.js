import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
/**
 * @summary WidgetTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 *
 */
function WidgetTasksData({ children }) {
  const [sortDirection, setSortDirection] = useState('desc')
  const [sortBy, setSortBy] = useState('date')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const { navigate } = useNavigationHelpers()
  const { count: tasksCount = 0, fetchUserGroupTasksRemoteData, userId } = useUserGroupTasks()

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
    return fetchUserGroupTasksRemoteData({
      pageIndex,
      pageSize: _pageSize,
      sortBy: _sortBy,
      sortOrder,
      userId,
    })
  }

  return (
    <TableContextCount.Provider value={Number(tasksCount)}>
      <TableContextSort.Provider value={sortDirection}>
        {children({
          columns: [
            {
              title: '',
              field: 'icon',
              render: () => {
                return '[~]'
              },
              sorting: false,
            },
            {
              title: 'Entry title',
              field: 'title',
            },
            {
              title: 'Requested by',
              field: 'initiator',
            },
            {
              title: 'Date submitted',
              field: 'date',
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
        })}
      </TableContextSort.Provider>
    </TableContextCount.Provider>
  )
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
