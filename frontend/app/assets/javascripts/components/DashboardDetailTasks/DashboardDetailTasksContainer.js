import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailSidebar from 'components/DashboardDetail/DashboardDetailSidebar'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailSelectedItemTask from 'components/DashboardDetail/DashboardDetailSelectedItemTask'
import DashboardDetailNotes from 'components/DashboardDetail/DashboardDetailNotes'
import DashboardDetailTasksData from 'components/DashboardDetailTasks/DashboardDetailTasksData'
import DetailSongStoryPresentation from 'components/DetailSongStory/DetailSongStoryPresentation'
import Table from 'components/Table'
import DetailWordPhrase from 'components/DetailWordPhrase'
import { TABLE_FULL_WIDTH } from 'common/Constants'
import TablePagination from 'components/Table/TablePagination'
import RequestChanges from 'components/RequestChanges'
import ItemIcon from 'components/ItemIcon'
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
    <DashboardDetailTasksData
      columnRender={{
        itemType: ItemIcon.Presentation,
        titleTask: ({ titleTask, visibilityChanged }) => {
          return visibilityChanged ? titleTask : ''
        },
      }}
    >
      {({
        columns,
        data,
        idSelectedTask,
        listItems,
        onChangeRowsPerPage,
        onClose,
        onEditClick,
        onOpen,
        onOpenNoId,
        onOrderChange,
        onRowClick,
        onViewClick,
        options,
        pagination = {},
        selectedItemData,
        selectedTaskData,
        sortDirection,
        idSelectedItem,
      }) => {
        const { page, pageSize, count } = pagination
        const {
          comments: taskComments,
          dateMDY: taskDate,
          id: taskId,
          isNew: taskIsNew,
          itemType: taskItemType,
          requestChangesSelectLabelText,
          requestChangesSubTitle,
          requestedVisibility,
          titleTaskDetail: taskTitle,
          initiatorEmail: taskInitiatorEmail,
          initiatorFullName: taskInitiatorFullName,
        } = selectedTaskData
        const {
          acknowledgement,
          audio,
          book,
          categories,
          culturalNotes,
          definitions,
          dialectPath: itemDialectPath,
          generalNote,
          id: itemId,
          itemType,
          literalTranslations,
          metadata,
          partOfSpeech,
          photos,
          pictures,
          phrases,
          pronunciation,
          relatedAssets,
          relatedToAssets,
          state: docState,
          title: itemTitle,
          videos,
          processedWasSuccessful: itemProcessedWasSuccessful,
          processedMessage: itemProcessedMessage,
        } = selectedItemData

        let childrenItemDetail = null
        const childrenDisplayButtons = true
        if (itemType === 'FVBook') {
          childrenItemDetail = (
            <DetailSongStoryPresentation
              book={book}
              audio={audio}
              childrenDisplayButtons={childrenDisplayButtons}
              onEditClick={onEditClick}
              onViewClick={onViewClick}
              pictures={pictures}
              videos={videos}
            />
          )
        }
        if (itemType === 'FVPhrase' || itemType === 'FVWord') {
          childrenItemDetail = (
            <DetailWordPhrase.Presentation
              acknowledgement={acknowledgement}
              audio={audio}
              categories={categories} // NOTE: also handles phrase books
              childrenDisplayButtons={childrenDisplayButtons}
              culturalNotes={culturalNotes}
              definitions={definitions}
              docType={itemType}
              generalNote={generalNote}
              idSelectedItem={idSelectedItem}
              literalTranslations={literalTranslations}
              metadata={metadata}
              onEditClick={onEditClick}
              onViewClick={onViewClick}
              partOfSpeech={partOfSpeech}
              photos={photos}
              phrases={phrases}
              pronunciation={pronunciation}
              relatedAssets={relatedAssets}
              relatedToAssets={relatedToAssets}
              title={itemTitle}
              videos={videos}
            />
          )
        }
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
                childrenTaskSummary={
                  <DashboardDetailSelectedItemTask.Presentation
                    title={taskTitle}
                    date={taskDate}
                    icon={<ItemIcon.Presentation itemType={taskItemType} isNew={taskIsNew} />}
                  />
                }
                childrenApprovalNotes={taskComments && <DashboardDetailNotes.Presentation comments={taskComments} />}
                childrenItemDetail={childrenItemDetail}
                childrenTaskApproval={
                  <RequestChanges.Container
                    docDialectPath={itemDialectPath}
                    docId={itemId}
                    docState={docState}
                    key={itemId}
                    processedMessage={itemProcessedMessage}
                    processedWasSuccessful={itemProcessedWasSuccessful}
                    requestedVisibility={requestedVisibility}
                    selectLabelText={requestChangesSelectLabelText}
                    subTitle={requestChangesSubTitle}
                    taskId={taskId}
                    taskInitiator={taskInitiatorFullName || taskInitiatorEmail}
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
