import React from 'react'
import WidgetTasksPresentation from 'components/WidgetTasks/WidgetTasksPresentation'
import WidgetTasksData from 'components/WidgetTasks/WidgetTasksData'
import TableContextSort from 'components/Table/TableContextSort'

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
      {({
        columns,
        data,
        fetchMessage,
        isFetching,
        onChangePage,
        onOrderChange,
        onRowClick,
        options,
        sortDirection,
      }) => {
        return (
          <TableContextSort.Provider value={sortDirection}>
            <WidgetTasksPresentation
              columns={columns}
              data={data}
              fetchMessage={fetchMessage}
              isFetching={isFetching}
              onChangePage={onChangePage}
              onOrderChange={onOrderChange}
              onRowClick={onRowClick}
              options={options}
              sortDirection={sortDirection}
            />
          </TableContextSort.Provider>
        )
      }}
    </WidgetTasksData>
  )
}

export default WidgetTasksContainer
