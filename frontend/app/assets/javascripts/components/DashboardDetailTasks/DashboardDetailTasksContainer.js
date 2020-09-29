import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailSidebar from 'components/DashboardDetail/DashboardDetailSidebar'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailSelectedItemTask from 'components/DashboardDetail/DashboardDetailSelectedItemTask'
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
          titleTask: taskTitle,
          initiator: taskInitiator,
          date: taskDate,
          itemType: taskItemType,
          isNew: taskIsNew,
          id: taskId,
        } = selectedTaskData
        const {
          acknowledgement,
          audio,
          book,
          categories,
          culturalNotes,
          definitions,
          dialectPath: itemDialectPath,
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
        if (itemType === 'FVBook') {
          childrenItemDetail = (
            <DetailSongStoryPresentation
              // openBookAction={openBookAction}
              // pageCount={pageCount}
              audio={audio}
              book={book}
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
              culturalNotes={culturalNotes}
              definitions={definitions}
              title={itemTitle}
              literalTranslations={literalTranslations}
              onEditClick={onEditClick}
              onViewClick={onViewClick}
              partOfSpeech={partOfSpeech}
              photos={photos}
              phrases={phrases}
              pronunciation={pronunciation}
              relatedAssets={relatedAssets}
              relatedToAssets={relatedToAssets}
              metadata={metadata}
              videos={videos}
              docType={itemType}
              idSelectedItem={idSelectedItem}
            />
          )
        }
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
                    initiator={taskInitiator}
                    date={taskDate}
                    icon={<ItemIcon.Presentation itemType={taskItemType} isNew={taskIsNew} />}
                  />
                }
                // TODO: future feature
                /*
                childrenActivityStream={(
                  <ActivityStream.Presentation
                    className="DashboardDetailSelectedItem__ActivityStream"
                    id={idSelectedTask}
                  />
                )}
                */
                // TODO: future feature
                /*
                childrenApprovalNotes={(
                  <ApprovalNotes.Presentation
                    className="DashboardDetailSelectedItem__Notes"
                    id={idSelectedTask}
                  />
                )}
                */
                childrenItemDetail={childrenItemDetail}
                childrenTaskApproval={
                  <RequestChanges.Container
                    docId={itemId}
                    taskId={taskId}
                    docState={docState}
                    docDialectPath={itemDialectPath}
                    key={itemId}
                    requestChangesText="Reject"
                    processedWasSuccessful={itemProcessedWasSuccessful}
                    processedMessage={itemProcessedMessage}
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
