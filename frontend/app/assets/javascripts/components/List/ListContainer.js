// NOTE: This ListContainer file is just an example
// NOTE: We are using the `List/ListPresentation` file in other List* components
import React from 'react'
import ListPresentation from './ListPresentation'
import ListData from './ListData'

/**
 * @summary ListContainer
 * @version 1.0.1
 * @component
 *
 * @returns {node} jsx markup
 */
function ListContainer() {
  return (
    <ListData>
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
          <ListPresentation
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
    </ListData>
  )
}

export default ListContainer
