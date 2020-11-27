import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import sanitize from 'common/Sanitize'
import NavigationHelpers from 'common/NavigationHelpers'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useDashboard from 'dataSources/useDashboard'
import useDocument from 'dataSources/useDocument'
import useIntl from 'dataSources/useIntl'
import ProviderHelpers from 'common/ProviderHelpers'
import { URL_QUERY_PLACEHOLDER } from 'common/Constants'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
import useTheme from 'dataSources/useTheme'
import { getBookData, getBookAudioVideo, getBookPictures } from 'components/SongStory/SongStoryUtility'
import StringHelpers from 'common/StringHelpers'

/**
 * @summary DashboardDetailTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {function} props.children Render prop
 *
 * @param {object} props.columnRender Object of functions to render cell data. Concession to maintain separation of concerns.
 *
 * @returns {object} Data for DashboardDetailTasksContainer (NOTE: no dedicated Presentation layer)
 */
function DashboardDetailTasksData({ children, columnRender }) {
  const { theme } = useTheme()
  const { intl } = useIntl()
  const [selectedItemData, setSelectedItemData] = useState({})
  const [selectedTaskData, setSelectedTaskData] = useState({})
  const { getSearchAsObject, navigate, navigateReplace } = useNavigationHelpers()
  const baseUrl = NavigationHelpers.getBaseURL()

  const { computeDocument, fetchDocumentSingleArg } = useDocument()
  const {
    count: tasksCount = 0,
    fetchTasksRemoteData,
    fetchTask,
    tasks = [],
    userId,
    resetTasks,
    processedTasks,
  } = useDashboard()

  const {
    item: queryItem,
    page: queryPage,
    pageSize: queryPageSize,
    sortBy: querySortBy,
    sortOrder: querySortOrder,
    task: queryTask,
  } = getSearchAsObject({
    defaults: {
      page: 1,
      pageSize: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    },
  })

  // Escape key binding
  const onKeyPressed = (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', onKeyPressed)
    return () => {
      document.removeEventListener('keydown', onKeyPressed)
    }
  }, [])

  const fetchTasksUsingQueries = () => {
    const _queryPage = Number(queryPage)
    fetchTasksRemoteData({
      pageIndex: _queryPage === 0 ? _queryPage : _queryPage - 1,
      pageSize: queryPageSize,
      sortBy: querySortBy,
      sortOrder: querySortOrder,
      userId,
    })
  }

  useEffect(() => {
    fetchTasksUsingQueries()
  }, [queryPage, queryPageSize, querySortBy, querySortOrder])

  // Redirect when http://...?task=[ID] and we have tasks + userId
  useEffect(() => {
    if (queryTask && tasks.length > 0) {
      if (queryTask === URL_QUERY_PLACEHOLDER) {
        navigateReplace(
          getUrlDetailView({
            task: selectn([0, 'id'], tasks),
            item: selectn([0, 'targetDocumentsIds'], tasks),
          })
        )
      } else if (queryItem === undefined) {
        // Task selected but no Item. So pick the first item....
        navigateReplace(
          getUrlDetailView({
            task: queryTask,
            item: selectn([0, 'targetDocumentsIds'], tasks),
          })
        )
      } else {
        navigateReplace(
          getUrlDetailView({
            task: queryTask,
            item: queryItem,
          })
        )
      }
    }
  }, [queryItem, queryTask, tasks, userId])

  // XHR #1: Get details of selected item
  useEffect(() => {
    if (queryItem) {
      fetchDocumentSingleArg({
        pathOrId: queryItem,
        headers: { 'enrichers.document': 'ancestry,word,phrase,book,permissions' },
      })
    }
  }, [queryItem])

  useEffect(() => {
    const extractComputeDocumentItem = ProviderHelpers.getEntry(computeDocument, queryItem)
    const _selectedItemData = selectn(['response'], extractComputeDocumentItem)
    const type = selectn('type', _selectedItemData)
    const uid = selectn(['uid'], _selectedItemData)
    const title = sanitize(selectn('title', _selectedItemData))
    const commonData = {
      culturalNotes: selectn('properties.fv:cultural_note', _selectedItemData) || [],
      generalNote: selectn('properties.fv:general_note', _selectedItemData),
      definitions: selectn('properties.fv:definitions', _selectedItemData),
      dialectPath: selectn('contextParameters.ancestry.dialect.path', _selectedItemData),
      id: uid,
      itemType: type,
      literalTranslations: selectn('properties.fv:literal_translation', _selectedItemData),
      state: selectn('state', _selectedItemData),
      title,
      metadata: { response: _selectedItemData },
      urlDialect: selectn('contextParameters.ancestry.dialect.path', _selectedItemData),
    }
    let itemTypeSpecificData = {}
    switch (type) {
      case 'FVPhrase':
        itemTypeSpecificData = {
          acknowledgement: selectn('properties.fv-phrase:acknowledgement', _selectedItemData),
          audio: selectn('contextParameters.phrase.related_audio', _selectedItemData) || [],
          categories: selectn('contextParameters.phrase.phrase_books', _selectedItemData) || [],
          partOfSpeech: selectn('contextParameters.phrase.part_of_speech', _selectedItemData),
          photos: selectn('contextParameters.phrase.related_pictures', _selectedItemData) || [],
          phrases: selectn('contextParameters.phrase.related_phrases', _selectedItemData) || [],
          pronunciation: selectn('properties.fv-phrase:pronunciation', _selectedItemData),
          relatedAssets: selectn('contextParameters.phrase.related_assets', _selectedItemData) || [],
          relatedToAssets: selectn('contextParameters.phrase.related_by', _selectedItemData) || [],
          videos: selectn('contextParameters.phrase.related_videos', _selectedItemData) || [],
        }
        break
      case 'FVBook': {
        const videosData = selectn('contextParameters.book.related_videos', _selectedItemData) || []
        const audioData = selectn('contextParameters.book.related_audio', _selectedItemData) || []
        const picturesData = selectn('contextParameters.book.related_pictures', _selectedItemData) || []
        itemTypeSpecificData = {
          book: _selectedItemData ? getBookData({ computeBookData: _selectedItemData, intl }) : {},
          audio: getBookAudioVideo({ data: audioData, type: 'FVAudio', baseUrl }),
          videos: getBookAudioVideo({ data: videosData, type: 'FVVideo', baseUrl }),
          pictures: getBookPictures({ data: picturesData }),
          metadata: undefined,
        }
        break
      }
      case 'FVWord':
        // FVWord
        itemTypeSpecificData = {
          acknowledgement: selectn('properties.fv-word:acknowledgement', _selectedItemData),
          audio: selectn('contextParameters.word.related_audio', _selectedItemData) || [],
          categories: selectn('contextParameters.word.categories', _selectedItemData) || [],
          partOfSpeech: selectn('contextParameters.word.part_of_speech', _selectedItemData),
          photos: selectn('contextParameters.word.related_pictures', _selectedItemData) || [],
          phrases: selectn('contextParameters.word.related_phrases', _selectedItemData) || [],
          pronunciation: selectn('properties.fv-word:pronunciation', _selectedItemData),
          relatedAssets: selectn('contextParameters.word.related_assets', _selectedItemData) || [],
          relatedToAssets: selectn('contextParameters.word.related_by', _selectedItemData) || [],
          videos: selectn('contextParameters.word.related_videos', _selectedItemData) || [],
        }
        break

      default:
        // Do nothing
        break
    }
    setSelectedItemData({ ...commonData, ...itemTypeSpecificData })
  }, [computeDocument, queryItem])

  // XHR #2: Get details of selected task
  useEffect(() => {
    if (queryTask && queryTask !== URL_QUERY_PLACEHOLDER) {
      fetchTask(queryTask).then((taskData) => {
        setSelectedTaskData(taskData)
      })
    }
  }, [queryTask])

  const onClose = () => {
    navigate(getUrlFullListView())
  }

  const onOpenNoId = () => {
    // Clear out old tasks data. Could be paged and so first entry won't necessarily be task 1 on page 1.
    resetTasks()

    // Update url with placeholder task id, reseting to page 1
    navigate(
      getUrlDetailView({
        task: URL_QUERY_PLACEHOLDER,
        page: 1,
      })
    )

    // Since we cleared out tasks, need to refetch data
    fetchTasksRemoteData({
      pageIndex: 0,
      pageSize: queryPageSize,
      sortBy: querySortBy,
      sortOrder: querySortOrder,
      userId,
    })
  }

  const onOpen = (id) => {
    let selectedTargetDocumentId
    if (tasks && tasks.length > 0) {
      const selectedTask = tasks.filter((task) => {
        return task.id === id
      })
      selectedTargetDocumentId = selectn([0, 'targetDocumentsIds'], selectedTask)
    }

    navigate(
      getUrlDetailView({
        task: id,
        item: selectedTargetDocumentId,
      })
    )
  }

  const getUrlDetailView = ({
    item = queryItem,
    page = queryPage,
    pageSize = queryPageSize,
    sortBy = querySortBy,
    sortOrder = querySortOrder,
    task = queryTask,
  } = {}) => {
    return `${window.location.pathname}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}${
      task ? `&task=${task}` : ''
    }${item ? `&item=${item}` : ''}`
  }

  const getUrlFullListView = ({
    page = queryPage,
    pageSize = queryPageSize,
    sortBy = querySortBy,
    sortOrder = querySortOrder,
  } = {}) => {
    return `${window.location.pathname}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  }

  const onRowClick = (event, { id }) => {
    onOpen(id)
  }
  const cellStyle = selectn(['widget', 'cellStyle'], theme) || {}
  const columns = [
    {
      title: '',
      field: 'itemType',
      render: columnRender.itemType,
      sorting: false,
      cellStyle,
    },
    {
      title: 'Entry title',
      field: 'titleItem',
      sorting: false,
      cellStyle,
    },
    {
      title: 'Visibility change requested',
      field: 'titleTask',
      render: columnRender.titleTask,
      cellStyle,
    },
    {
      title: 'Requested by',
      field: 'initiator',
      cellStyle,
    },
    {
      title: 'Date submitted',
      field: 'date',
      cellStyle,
    },
  ]
  const onOrderChange = (index) => {
    navigate(
      getUrlDetailView({
        sortBy: columns[index].field,
        sortOrder: querySortOrder === 'desc' ? 'asc' : 'desc',
        page: 1,
      })
    )
  }
  const onEditClick = (UID, itemTypePlural) => {
    window.open(`/explore${selectedItemData.urlDialect}/learn/${itemTypePlural}/${UID}/edit`)
  }
  const onViewClick = (UID, itemTypePlural) => {
    window.open(`/explore${selectedItemData.urlDialect}/learn/${itemTypePlural}/${UID}`)
  }
  // updates task data to set 'processed' related flags
  const setProcessedTasks = (taskData) => {
    return taskData.map((task) => {
      const isProcessed = processedTasks.find((processedTask) => {
        return processedTask.idTask === task.id
      })
      return {
        ...task,
        isProcessed: isProcessed !== undefined,
        processedWasSuccessful: selectn('isSuccess', isProcessed),
        processedMessage: selectn('message', isProcessed),
      }
    })
  }
  // updates selected item data to set 'processed' related flags
  const setProcessedItem = (itemData) => {
    const isProcessed = processedTasks.find((processedTask) => {
      return processedTask.idItem === itemData.id
    })
    return {
      ...itemData,
      isProcessed: isProcessed !== undefined,
      processedWasSuccessful: selectn('isSuccess', isProcessed),
      processedMessage: selectn('message', isProcessed),
    }
  }
  const setRequestChangesData = ({ task, itemState } = {}) => {
    const { visibilityChanged, itemTypeForUI, initiatorFullName, initiatorEmail } = task
    const initiator = initiatorFullName !== '' ? initiatorFullName : initiatorEmail
    const visText = StringHelpers.visibilityText({ visibility: itemState })
    return {
      ...task,
      requestChangesSubTitle:
        visText && itemTypeForUI
          ? `Currently the ${visText.toLowerCase()} can see this ${itemTypeForUI.toLowerCase()}.`
          : '',
      requestChangesSelectLabelText: visibilityChanged ? `${initiator} requested a change to:` : undefined,
    }
  }
  const childrenData = {
    columns: columns,
    // data: userId === 'Guest' ? [] : remoteData,
    data: setProcessedTasks(tasks),
    idSelectedItem: queryItem,
    idSelectedTask: queryTask !== URL_QUERY_PLACEHOLDER ? queryTask : undefined,
    listItems: setProcessedTasks(tasks),
    onClose,
    onEditClick,
    onOpen,
    onOpenNoId,
    onOrderChange,
    onRowClick,
    onViewClick,
    options: {
      pageSize: Number(queryPageSize),
      pageSizeOptions: [5, 10, 20],
      paging: true,
      sorting: true,
      emptyRowsWhenPaging: false,
    },
    pagination: {
      count: Number(tasksCount),
      page: Number(queryPage),
      pageSize: Number(queryPageSize),
      sortBy: querySortBy,
      sortOrder: querySortOrder,
    },
    selectedItemData: setProcessedItem(selectedItemData),
    selectedTaskData: setRequestChangesData({
      task: selectedTaskData,
      itemState: selectedItemData.state,
    }),
    sortDirection: querySortOrder,
  }
  return (
    <TableContextCount.Provider value={Number(tasksCount)}>
      <TableContextSort.Provider value={querySortOrder}>{children(childrenData)}</TableContextSort.Provider>
    </TableContextCount.Provider>
  )
}
// PROPTYPES
const { func, object } = PropTypes
DashboardDetailTasksData.propTypes = {
  children: func,
  columnRender: object,
}
DashboardDetailTasksData.defaultProps = {
  columnRender: {
    itemType: () => '',
  },
}

export default DashboardDetailTasksData
