import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import DashboardDetailList from 'components/DashboardDetail/DashboardDetailList'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailSelectedItemTask from 'components/DashboardDetail/DashboardDetailSelectedItemTask'
import DashboardDetailTasksData from 'components/DashboardDetailTasks/DashboardDetailTasksData'
import Table from 'components/Table'
import DetailWordPhrase from 'components/DetailWordPhrase'
import { TABLE_FULL_WIDTH } from 'common/Constants'
import TablePagination from 'components/Table/TablePagination'
import RequestChanges from 'components/RequestChanges'
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
        refreshData,
        options,
        pagination = {},
        selectedItemData,
        selectedTaskData,
        sortDirection,
      }) => {
        const { page, pageSize, count } = pagination
        const {
          title: taskTitle,
          initiator: taskInitiator,
          date: taskDate,
          itemType: taskItemType,
          isNew: taskIsNew,
          id: taskId,
        } = selectedTaskData
        const {
          acknowledgement,
          audio,
          categories,
          culturalNotes,
          definitions,
          dialectPath: itemDialectPath,
          id: itemId,
          literalTranslations,
          partOfSpeech,
          photos,
          phrases,
          pronunciation,
          relatedAssets,
          relatedToAssets,
          state: docState,
          title: itemTitle,
          videos,
        } = selectedItemData
        return (
          <DashboardDetail.Presentation
            childrenUnselected={
              <Table.Presentation
                columns={columns}
                data={data}
                // localization={{
                //   body: {
                //     emptyDataSourceMessage: isFetching ? fetchMessage : 'No tasks pending',
                //   },
                // }}
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
              <DashboardDetailList.Container
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
                childrenTaskSummary={
                  <DashboardDetailSelectedItemTask.Presentation
                    title={taskTitle}
                    initiator={taskInitiator}
                    date={taskDate}
                    icon={<DashboardDetailIcon.Presentation itemType={taskItemType} isNew={taskIsNew} />}
                  />
                }
                // TODO:
                /*
                childrenActivityStream={(
                  <ActivityStream.Presentation
                    className="DashboardDetailSelectedItem__ActivityStream"
                    id={idSelectedTask}
                  />
                )}
                */
                // TODO:
                /*
                childrenApprovalNotes={(
                  <ApprovalNotes.Presentation
                    className="DashboardDetailSelectedItem__Notes"
                    id={idSelectedTask}
                  />
                )}
                */
                childrenItemDetail={
                  <DetailWordPhrase.Presentation
                    acknowledgement={acknowledgement}
                    audio={audio}
                    categories={categories}
                    culturalNotes={culturalNotes}
                    definitions={definitions}
                    title={itemTitle}
                    literalTranslations={literalTranslations}
                    partOfSpeech={partOfSpeech}
                    photos={photos}
                    phrases={phrases}
                    pronunciation={pronunciation}
                    relatedAssets={relatedAssets}
                    relatedToAssets={relatedToAssets}
                    videos={videos}
                  />
                }
                childrenTaskApproval={
                  // TODO: NEED TO SET `docState`
                  <RequestChanges.Container
                    docId={itemId}
                    taskId={taskId}
                    docState={docState}
                    docDialectPath={itemDialectPath}
                    key={itemId}
                    refreshData={refreshData}
                  />
                }
              />
            }
            onClose={onClose}
            onOpen={onOpenNoId}
            selectedId={idSelectedTask}
          />
        )
      }}
    </DashboardDetailTasksData>
  )
}

export default DashboardDetailTasksContainer
