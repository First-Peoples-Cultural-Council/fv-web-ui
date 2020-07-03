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
      {({
        actions,
        columns,
        data,
        detailPanel,
        onChangeColumnHidden,
        onChangePage,
        onChangeRowsPerPage,
        onColumnDragged,
        onGroupRemoved,
        onOrderChange,
        onRowClick,
        onSearchChange,
        onSelectionChange,
        onTreeExpandChange,
        options,
        title,
      }) => {
        // eslint-disable-next-line
        console.log('WidgetTasksData LIMINAL', {
          actions,
          columns,
          data,
          detailPanel,
          onChangeColumnHidden,
          onChangePage,
          onChangeRowsPerPage,
          onColumnDragged,
          onGroupRemoved,
          onOrderChange,
          onRowClick,
          onSearchChange,
          onSelectionChange,
          onTreeExpandChange,
          options,
          title,
        })
        return (
          <WidgetTasksPresentation
            actions={actions}
            columns={columns}
            data={data}
            detailPanel={detailPanel}
            onChangeColumnHidden={onChangeColumnHidden}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onColumnDragged={onColumnDragged}
            onGroupRemoved={onGroupRemoved}
            onOrderChange={onOrderChange}
            onRowClick={onRowClick}
            onSearchChange={onSearchChange}
            onSelectionChange={onSelectionChange}
            onTreeExpandChange={onTreeExpandChange}
            options={options}
            title={title}
          />
        )
      }}
    </WidgetTasksData>
  )
}

export default WidgetTasksContainer
