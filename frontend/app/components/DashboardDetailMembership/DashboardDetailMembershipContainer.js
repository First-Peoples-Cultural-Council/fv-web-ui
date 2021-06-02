import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailSidebar from 'components/DashboardDetail/DashboardDetailSidebar'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailSelectedItemTask from 'components/DashboardDetail/DashboardDetailSelectedItemTask'
import DashboardDetailNotes from 'components/DashboardDetail/DashboardDetailNotes'
import DashboardDetailMembershipData from 'components/DashboardDetailMembership/DashboardDetailMembershipData'
import Table from 'components/Table'
import { TABLE_FULL_WIDTH } from 'common/Constants'
import TablePagination from 'components/Table/TablePagination'
import ItemIcon from 'components/ItemIcon'
/**
 * @summary DashboardDetailMembershipContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailMembershipContainer() {
  return (
    <DashboardDetailMembershipData>
      {({
        columns,
        data,
        idSelectedTask,
        listItems,
        onChangeRowsPerPage,
        onClose,
        onOpen,
        onOpenNoId,
        onOrderChange,
        onRowClick,
        options,
        pagination = {},
        selectedItemData,
        selectedTaskData,
        sortDirection,
      }) => {
        const { page, pageSize, count } = pagination
        const {
          comments: taskComments,
          dateMDY: taskDate,
          isNew: taskIsNew,
          titleTaskDetail: taskTitle,
        } = selectedTaskData
        return (
          <DashboardDetail.Presentation
            childrenUnselected={
              <Table.Presentation
                columns={columns}
                data={data}
                onOrderChange={onOrderChange}
                onRowClick={onRowClick}
                options={options}
                sortDirection={sortDirection}
                variant={TABLE_FULL_WIDTH}
                onChangeRowsPerPage={onChangeRowsPerPage}
                componentsPagination={TablePagination}
              />
            }
            childrenSelectedSidebar={
              <DashboardDetailSidebar.Container
                selectedId={idSelectedTask}
                onClick={onOpen}
                listItems={listItems}
                title="Tasks"
                page={page}
                pageSize={pageSize}
                count={count}
              />
            }
            childrenSelectedDetail={
              <DashboardDetailSelectedItem.Presentation
                idTask={idSelectedTask}
                itemData={selectedItemData}
                childrenTaskSummary={
                  <DashboardDetailSelectedItemTask.Presentation
                    title={taskTitle}
                    date={taskDate}
                    icon={<ItemIcon.Presentation itemType={'membership'} isNew={taskIsNew} />}
                  />
                }
                childrenApprovalNotes={taskComments && <DashboardDetailNotes.Presentation comments={taskComments} />}
                childrenItemDetail={<div>Detail component</div>}
                childrenTaskApproval={<div>Action component</div>}
              />
            }
            onClose={onClose}
            onOpen={onOpenNoId}
            selectedId={idSelectedTask}
          />
        )
      }}
    </DashboardDetailMembershipData>
  )
}

export default DashboardDetailMembershipContainer
