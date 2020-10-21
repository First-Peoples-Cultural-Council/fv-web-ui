import React from 'react'
import WidgetTasksPresentation from 'components/WidgetTasks/WidgetTasksPresentation'
import WidgetTasksData from 'components/WidgetTasks/WidgetTasksData'
import ItemIcon from 'components/ItemIcon'
import Typography from '@material-ui/core/Typography'

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
    <WidgetTasksData
      columnRender={{
        itemType: ItemIcon.Presentation,
        titleItem: ({ titleItem }) => {
          return (
            <Typography variant="body1" className="Widget__cellTitle" component="div" noWrap>
              {titleItem}
            </Typography>
          )
        },
        titleTask: ({ titleTask, visibilityChanged }) => {
          return visibilityChanged ? titleTask : ''
        },
      }}
    >
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
        )
      }}
    </WidgetTasksData>
  )
}

export default WidgetTasksContainer
