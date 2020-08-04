import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StringHelpers from 'common/StringHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import TableContextSort from 'components/Table/TableContextSort'
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
  const { navigate } = useNavigationHelpers()
  const { fetchUserGroupTasksRemoteData, userId } = useUserGroupTasks()

  const onRowClick = (event, { id }) => {
    navigate(`/dashboard/tasks?active=${id}`)
  }

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const remoteData = (data) => {
    const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize } = data

    const { field: sortBy } = orderBy
    return fetchUserGroupTasksRemoteData({
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      userId,
    })
  }

  return (
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
            render: ({ date }) => StringHelpers.formatUTCDateString(new Date(date)),
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
  )
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
