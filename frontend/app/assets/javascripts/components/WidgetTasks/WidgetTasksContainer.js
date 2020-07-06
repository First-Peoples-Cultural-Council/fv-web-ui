import React from 'react'
import WidgetTasksPresentation from 'components/WidgetTasks/WidgetTasksPresentation'
import WidgetTasksData from 'components/WidgetTasks/WidgetTasksData'

/**
 * @summary WidgetTasksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetTasksContainer() {
  return (
    <WidgetTasksData>
      {({ columns, data, onRowClick, options, isFetching, fetchMessage }) => {
        return (
          <WidgetTasksPresentation
            columns={columns}
            data={data}
            fetchMessage={fetchMessage}
            isFetching={isFetching}
            onRowClick={onRowClick}
            options={options}
          />
        )
      }}
    </WidgetTasksData>
  )
}

export default WidgetTasksContainer
