// NOTE: This TableContainer file is just an example
// NOTE: We are using the `Table/TablePresentation` file in other Table* components
import React from 'react'
import TablePresentation from './TablePresentation'
import TableData from './TableData'

/**
 * @summary TableContainer
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function TableContainer() {
  return (
    <TableData>
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
        return (
          <TablePresentation
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
    </TableData>
  )
}

export default TableContainer
