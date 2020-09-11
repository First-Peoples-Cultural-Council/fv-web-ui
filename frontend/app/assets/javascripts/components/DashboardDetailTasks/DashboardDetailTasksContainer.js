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
      }}
    >
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
        } = selectedItemData

        let childrenItemDetail = null
        if (itemType === 'FVBook') {
          childrenItemDetail = (
            <DetailSongStoryPresentation
              book={book}
              // openBookAction={openBookAction}
              // pageCount={pageCount}
              audio={audio}
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
              partOfSpeech={partOfSpeech}
              photos={photos}
              phrases={phrases}
              pronunciation={pronunciation}
              relatedAssets={relatedAssets}
              relatedToAssets={relatedToAssets}
              metadata={metadata}
              videos={videos}
              docType={itemType}
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
                  // TODO: NEED TO SET `docState`
                  <RequestChanges.Container
                    docId={itemId}
                    taskId={taskId}
                    docState={docState}
                    docDialectPath={itemDialectPath}
                    key={itemId}
                    refreshData={refreshData}
                    requestChangesText="Reject"
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
