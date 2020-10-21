import React from 'react'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import Table from 'components/Table'
import Link from 'components/Link'

import { TABLE_FULL_WIDTH, WIDGET_WORKSPACE, URL_QUERY_PLACEHOLDER } from 'common/Constants'
/**
 * @summary WidgetTasksPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.columns Data for header/columns
 * @param {array} props.data Data for rows
 * @param {array} props.fetchMessage any fetch message from the server
 * @param {array} props.isFetching flag for in-progress server request
 * @param {function} props.onRowClick
 * @param {object} props.options Mat-table options
 *
 * @returns {node} jsx markup
 */

function WidgetTasksPresentation({
  columns,
  data,
  fetchMessage,
  isFetching,
  onChangePage,
  onOrderChange,
  onRowClick,
  options,
  sortDirection,
}) {
  return (
    <Widget.Presentation
      title="List of Tasks"
      variant={TABLE_FULL_WIDTH}
      childrenHeader={
        <Link
          className="Widget__headerLink"
          href={`/dashboard/tasks?task=${URL_QUERY_PLACEHOLDER}&page=1&pageSize=10&sortBy=date&sortOrder=desc`}
        >
          View full list
        </Link>
      }
    >
      <Table.Presentation
        columns={columns}
        data={data}
        localization={{
          body: {
            emptydataSourcesMessage: isFetching ? fetchMessage : 'No tasks pending',
          },
        }}
        onChangePage={onChangePage}
        onOrderChange={onOrderChange}
        onRowClick={onRowClick}
        options={options}
        sortDirection={sortDirection}
        variant={WIDGET_WORKSPACE}
      />
    </Widget.Presentation>
  )
}
// PROPTYPES
const { array, bool, func, object, string, oneOfType } = PropTypes
WidgetTasksPresentation.propTypes = {
  columns: array,
  data: oneOfType([array, func]),
  fetchMessage: string,
  isFetching: bool,
  onChangePage: func,
  onChangeRowsPerPage: func,
  onRowClick: func,
  onOrderChange: func,
  options: object,
  sortDirection: string,
}

export default WidgetTasksPresentation
