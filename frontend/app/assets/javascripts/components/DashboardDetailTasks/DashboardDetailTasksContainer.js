import React from 'react'
import DashboardDetail from 'components/DashboardDetail'
import DashboardDetailIcon from 'components/DashboardDetail/DashboardDetailIcon'
import DashboardDetailList from 'components/DashboardDetail/DashboardDetailList'
import DashboardDetailSelectedItem from 'components/DashboardDetail/DashboardDetailSelectedItem'
import DashboardDetailTasksData from 'components/DashboardDetailTasks/DashboardDetailTasksData'
import Table from 'components/Table'
import DashboardDetailListItem from 'components/DashboardDetail/DashboardDetailListItem'
import DetailWordPhrase from 'components/DetailWordPhrase'
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
      {({ columns, fetchMessage, idSelectedTask, isFetching, listItems, onClose, onOpen, selectedItemData }) => {
        const filteredData = listItems.filter(({ id }) => id === idSelectedTask)
        const selectedTaskData = filteredData.length > 0 ? { ...filteredData[0] } : {}
        const { title, initiator, date, itemType, isNew } = selectedTaskData
        const {
          culturalNotes,
          definitions,
          title: itemTitle,
          literalTranslations,
          acknowledgement,
          audio,
          categories,
          partOfSpeech,
          photos,
          phrases,
          pronunciation,
          relatedAssets,
          relatedToAssets,
          videos,
        } = selectedItemData
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
                selectedId={idSelectedTask}
                onClick={onOpen}
                listItems={listItems}
                title="Tasks"
              />
            }
            childrenSelectedDetail={
              <DashboardDetailSelectedItem.Presentation
                idTask={idSelectedTask}
                childrenTaskSummary={
                  <DashboardDetailListItem.Presentation
                    component="div"
                    title={title}
                    initiator={initiator}
                    date={date}
                    icon={<DashboardDetailIcon.Presentation itemType={itemType} isNew={isNew} />}
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
              />
            }
            onClose={onClose}
            onOpen={() => {
              onOpen()
            }}
            selectedId={idSelectedTask}
          />
        )
      }}
    </DashboardDetailTasksData>
  )
}

export default DashboardDetailTasksContainer
