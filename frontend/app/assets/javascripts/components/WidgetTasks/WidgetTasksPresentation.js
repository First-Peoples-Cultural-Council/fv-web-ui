import React from 'react'
import Widget from 'components/Widget'
import List from 'components/List'
import Link from 'views/components/Link'

/**
 * @summary WidgetTasksPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetTasksPresentation({ columns, onRowClick, options, data }) {
  return (
    <Widget.Presentation
      title="List of Tasks [variant]"
      variant={1}
      childrenHeader={<Link href={'/dashboard/tasks'}>See all tasks</Link>}
    >
      <List.Presentation variant={1} columns={columns} onRowClick={onRowClick} options={options} data={data} />
    </Widget.Presentation>
  )
}
// PROPTYPES
// const { string } = PropTypes
WidgetTasksPresentation.propTypes = {
  //   something: string,
}

export default WidgetTasksPresentation
