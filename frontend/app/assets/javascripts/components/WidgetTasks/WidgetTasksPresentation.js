import React from 'react'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import List from 'components/List'
import Link from 'views/components/Link'
import { CONTENT_FULL_WIDTH } from 'common/Constants'

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
function WidgetTasksPresentation({ columns, data, fetchMessage, isFetching, onRowClick, options }) {
  return (
    <Widget.Presentation
      title="List of Tasks"
      variant={CONTENT_FULL_WIDTH}
      childrenHeader={data.length !== 0 && <Link href={'/dashboard/tasks'}>See all tasks</Link>}
    >
      <List.Presentation
        variant={CONTENT_FULL_WIDTH}
        columns={columns}
        onRowClick={onRowClick}
        options={options}
        data={data}
        localization={{
          body: {
            emptyDataSourceMessage: isFetching ? fetchMessage : 'No tasks pending',
          },
        }}
      />
    </Widget.Presentation>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
WidgetTasksPresentation.propTypes = {
  columns: array,
  data: array,
  onRowClick: func,
  options: object,
  isFetching: bool,
  fetchMessage: string,
}

export default WidgetTasksPresentation
