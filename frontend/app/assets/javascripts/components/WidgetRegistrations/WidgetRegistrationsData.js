import React, { useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useRegistrations from 'DataSource/useRegistrations'
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
  const { count: registrationsCount, fetchRegistrations, userId, dialectId } = useRegistrations()

  // User Registration URL:
  // https://dev.firstvoices.com/tasks/users/07d51b18-f6a3-4ba0-9e44-3e557fc30a07
  const urlUserRegistration = `/tasks/users/${dialectId}`

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  const remoteData = (data) => {
    const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize: _pageSize } = data

    const { field: _sortBy = 'date' } = orderBy

    /* eslint-disable */
    console.log('remoteData', {
      sortOrder,
      sortBy: _sortBy,
      pageIndex,
      pageSize: _pageSize,
    })
    /* eslint-enable */

    return fetchRegistrations({
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
        field: 'icon',
        render: columnRender.icon,
        sorting: false,
        cellStyle,
      },
      {
        title: 'Name',
        field: 'name',
        sorting: false,
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
