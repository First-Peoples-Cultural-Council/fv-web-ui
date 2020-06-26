import React from 'react'
import ListPresentation from 'components/List/ListPresentation'
import ListTasksData from './ListTasksData'

/**
 * @summary ListTasksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListTasksContainer() {
  return (
    <ListTasksData>
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
    </ListTasksData>
  )
}

export default ListTasksContainer
