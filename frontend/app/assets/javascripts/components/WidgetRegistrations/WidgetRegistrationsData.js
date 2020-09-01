import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
import useTheme from 'DataSource/useTheme'
import StringHelpers from 'common/StringHelpers'
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
  const [sortBy, setSortBy] = useState('date')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const { navigate } = useNavigationHelpers()
  const { count: registrationsCount = 1234, /*fetchUserGroupTasksRemoteData, */ userId } = useUserGroupTasks()

  // User Registration:
  // https://dev.firstvoices.com/tasks/users/07d51b18-f6a3-4ba0-9e44-3e557fc30a07

  // TODO: get dialect uid
  const dialectId = '07d51b18-f6a3-4ba0-9e44-3e557fc30a07'

  const urlUserRegistration = `/tasks/users/${dialectId}`

  // TODO: why have a row click?
  const onRowClick = (event, { id }) => {
    navigate(
      dialectId
        ? `${urlUserRegistration}?id=${id}&page=${page +
            1}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortDirection}`
        : '#'
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

    // TODO: call different endpoint
    /*
    return fetchUserGroupTasksRemoteData({
      pageIndex,
      pageSize: _pageSize,
      sortBy: _sortBy,
      sortOrder,
      userId,
    })
    */

    /* eslint-disable */
    console.log('remoteData', {
      sortOrder,
      sortBy: _sortBy,
      pageIndex,
      pageSize: _pageSize,
    })
    /* eslint-enable */

    // Remote Data: return a promise that resolves with { data, page /*zero-indexed*/, totalCount }
    return new Promise((resolve /*, reject*/) => {
      resolve({
        entries: [
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4e',
            dateCreated: '2020-08-20T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fnL1_RECORDER',
              lastName: 'lnL1_RECORDER',
              email: 'fnL1@lnL1.ca',
            },
          },
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4f',
            dateCreated: '2020-08-21T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fnL2_RECORDER',
              lastName: 'lnL2_RECORDER',
              email: 'fnL2@lnL2.ca',
            },
          },
          {
            'entity-type': 'user-registration-task',
            uid: '3bb74e0b-ae6d-4cca-92a2-de5be1e41f4g',
            dateCreated: '2020-08-22T21:58:59.255Z',
            requestedGroup: 'members',
            requestedBy: {
              firstName: 'fnL3_RECORDER',
              lastName: 'lnL4_RECORDER',
              email: 'fnL4@lnL4.ca',
            },
          },
        ],
      })
    }).then((response) => {
      // TODO: Normalize server response to what the component needs

      const {
        // TODO: extract registration array from server response
        entries,
        // TODO: extract total registrations count from server response
        // resultsCount: totalCount = 999,
      } = response

      // TODO: relocate this section to a data source?
      return {
        data: entries.map((registration) => {
          return {
            name: `${registration.requestedBy.firstName} ${registration.requestedBy.lastName}`,
            email: registration.requestedBy.email,
            date: StringHelpers.formatUTCDateString(registration.dateCreated),
            id: registration.uid,
          }
        }),
        page,
        // TODO
        totalCount: registrationsCount,
      }
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
    urlAllItems: urlUserRegistration,
  }
  return (
    <TableContextCount.Provider value={Number(registrationsCount)}>
      <TableContextSort.Provider value={sortDirection}>{children(childrenData)}</TableContextSort.Provider>
    </TableContextCount.Provider>
  )
}
// PROPTYPES
const { object, func } = PropTypes
WidgetRegistrationsData.propTypes = {
  children: func,
  columnRender: object,
}

export default WidgetRegistrationsData
