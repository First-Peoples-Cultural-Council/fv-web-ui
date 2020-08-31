import React from 'react'
import WidgetRegistrationsPresentation from 'components/WidgetRegistrations/WidgetRegistrationsPresentation'
import WidgetRegistrationsData from 'components/WidgetRegistrations/WidgetRegistrationsData'
import Person from '@material-ui/icons/AccountCircle'

/**
 * @summary WidgetRegistrationsContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetRegistrationsContainer() {
  return (
    <WidgetRegistrationsData
      columnRender={{
        icon: () => {
          return (
            <div className="WidgetRegistrations__nameIconContainer">
              <Person className="WidgetRegistrations__nameIcon" />
            </div>
          )
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
        urlAllItems,
      }) => {
        return (
          <WidgetRegistrationsPresentation
            columns={columns}
            data={data}
            fetchMessage={fetchMessage}
            isFetching={isFetching}
            onChangePage={onChangePage}
            onOrderChange={onOrderChange}
            onRowClick={onRowClick}
            options={options}
            sortDirection={sortDirection}
            urlAllItems={urlAllItems}
          />
        )
      }}
    </WidgetRegistrationsData>
  )
}

export default WidgetRegistrationsContainer
