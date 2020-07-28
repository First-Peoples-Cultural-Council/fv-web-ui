import { useState } from 'react'
import PropTypes from 'prop-types'
import StringHelpers from 'common/StringHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
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
  const { fetchUserGroupTasks, userId, formatTasksData } = useUserGroupTasks(false)

  const onRowClick = (event, { id }) => {
    navigate(`/dashboard/tasks?active=${id}`)
  }

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  const friendlyNamePropertyNameLookup = {
    date: 'nt:dueDate',
    id: 'uid',
    initiator: 'nt:initiator',
    title: 'nt:name',
  }

  // Note: Library has a sort bug when using remote data
  // see: https://github.com/mbrn/material-table/issues/2177
  const remoteData = (data) => {
    const { orderBy = {}, orderDirection: sortOrder, page: currentPageIndex = 0, pageSize = 100 } = data
    const { field: sortBy = 'date' } = orderBy
    const requestParams = {
      currentPageIndex,
      pageSize,
      sortBy: friendlyNamePropertyNameLookup[sortBy],
      sortOrder,
    }
    return fetchUserGroupTasks(userId, requestParams).then(({ entries, resultsCount, pageIndex }) => {
      return {
        data: formatTasksData(entries),
        page: pageIndex,
        totalCount: resultsCount,
      }
    })
  }
  return children({
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
    onRowClick,
    options: {
      paging: true,
      pageSizeOptions: [5], // NOTE: with only one option the Per Page Select is hidden
      sorting: true,
    },
    // NOTE: when not logged in, show an empty data set
    data: userId === 'Guest' ? [] : remoteData,
    sortDirection,
    onOrderChange,
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
