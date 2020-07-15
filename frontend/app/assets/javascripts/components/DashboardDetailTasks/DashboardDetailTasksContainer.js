import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import DashboardDetailList from 'components/DashboardDetail/DashboardDetailList'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailTasksData from 'components/DashboardDetailTasks/DashboardDetailTasksData'
import Table from 'components/Table'

import { CONTENT_FULL_WIDTH } from 'common/Constants'
/**
 * @summary DashboardDetailTasksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailTasksContainer() {
  return (
    <DashboardDetailTasksData>
      {({ columns, fetchMessage, isFetching, listItems, onClose, onOpen, selectedTaskId }) => {
        const filteredData = listItems.filter(({ id }) => id === selectedTaskId)
        const selectedData = filteredData.length > 0 ? { ...filteredData[0] } : {}
        return (
          <DashboardDetail.Presentation
            childrenUnselected={
              <Table.Presentation
                variant={CONTENT_FULL_WIDTH}
                columns={columns}
                data={listItems}
                onRowClick={(event, { id }) => {
                  onOpen(id)
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: isFetching ? fetchMessage : 'No tasks pending',
                  },
                }}
              />
            }
            childrenSelectedSidebar={
              <DashboardDetailList.Container
                selectedId={selectedTaskId}
                onClick={onOpen}
                listItems={listItems}
                title="Tasks"
              />
            }
            childrenSelectedDetail={
              <DashboardDetailSelectedItem.Presentation
                title={selectedData.title}
                initiator={selectedData.initiator}
                date={selectedData.date}
                icon={<DashboardDetailIcon.Presentation itemType={selectedData.itemType} isNew={selectedData.isNew} />}
              />
            }
            onClose={onClose}
            onOpen={() => {
              onOpen()
            }}
            selectedId={selectedTaskId}
          />
        )
      }}
    </DashboardDetailTasksData>
  )
}

export default DashboardDetailTasksContainer
