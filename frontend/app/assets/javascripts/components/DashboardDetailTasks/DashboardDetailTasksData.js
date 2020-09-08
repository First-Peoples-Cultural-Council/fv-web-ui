import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useDashboard from 'DataSource/useDashboard'
import useDocument from 'DataSource/useDocument'
import ProviderHelpers from 'common/ProviderHelpers'
import { URL_QUERY_PLACEHOLDER } from 'common/Constants'
import StringHelpers from 'common/StringHelpers'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
import useTheme from 'DataSource/useTheme'
/**
 * @summary DashboardDetailTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardDetailTasksData({ children, columnRender }) {
  const { theme } = useTheme()
  const [selectedItemData, setSelectedItemData] = useState({})
  const [selectedTaskData, setSelectedTaskData] = useState({})
  const { getSearchObject, navigate, navigateReplace } = useNavigationHelpers()
  const { computeDocument, fetchDocument } = useDocument()
  const {
    item: queryItem,
    page: queryPage = 1,
    pageSize: queryPageSize = 10,
    sortBy: querySortBy = 'date',
    sortOrder: querySortOrder = 'desc',
    task: queryTask,
  } = getSearchObject()

  const { count: tasksCount = 0, fetchTasksRemoteData, tasks = [], userId, resetTasks } = useDashboard()

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
      navigateReplace(
        getUrlDetailView({
          task: queryTask === URL_QUERY_PLACEHOLDER ? selectn([0, 'id'], tasks) : queryTask,
          item: queryTask === URL_QUERY_PLACEHOLDER ? selectn([0, 'targetDocumentsIds', 0], tasks) : queryItem, // TODO: NOT SELECTING CORRECTLY?
        })
      )
    }
  }, [queryItem, queryTask, tasks, userId])

  // Get Item Details
  useEffect(() => {
    if (queryItem) {
      fetchDocument(queryItem)
    }
  }, [queryItem])

  // TODO: Curently only handling words
  useEffect(() => {
    const extractComputeDocumentItem = ProviderHelpers.getEntry(computeDocument, queryItem)
    const _selectedItemData = selectn(['response'], extractComputeDocumentItem)

    // TODO: Should we be getting dialectClassName? Perhaps a different location?
    // const dialectClassName = getDialectClassname(computeDialect2)

    // TODO: Handle metadata
    // const metadata = selectn('response', _selectedItemData) ? (
    //   <MetadataPanel properties={this.props.properties} computeEntity={_selectedItemData} />
    // ) : null
    setSelectedItemData({
      state: selectn('state', _selectedItemData),
      acknowledgement: selectn('properties.fv-word:acknowledgement', _selectedItemData),
      audio: selectn('contextParameters.word.related_audio', _selectedItemData) || [],
      categories: selectn('contextParameters.word.categories', _selectedItemData) || [],
      culturalNotes: selectn('properties.fv:cultural_note', _selectedItemData) || [],
      definitions: selectn('properties.fv:definitions', _selectedItemData),
      dialectPath: selectn('contextParameters.ancestry.dialect.path', _selectedItemData),
      id: selectn(['uid'], _selectedItemData),
      itemType: selectn('type', _selectedItemData),
      literalTranslations: selectn('properties.fv:literal_translation', _selectedItemData),
      partOfSpeech: selectn('contextParameters.word.part_of_speech', _selectedItemData),
      photos: selectn('contextParameters.word.related_pictures', _selectedItemData) || [],
      phrases: selectn('contextParameters.word.related_phrases', _selectedItemData) || [],
      pronunciation: selectn('properties.fv-word:pronunciation', _selectedItemData),
      relatedAssets: selectn('contextParameters.word.related_assets', _selectedItemData) || [],
      relatedToAssets: selectn('contextParameters.word.related_by', _selectedItemData) || [],
      title: selectn('title', _selectedItemData),
      videos: selectn('contextParameters.word.related_videos', _selectedItemData) || [],
    })
  }, [computeDocument, queryItem])

  // Get Task Details
  useEffect(() => {
    if (queryTask && queryTask !== URL_QUERY_PLACEHOLDER) {
      fetchDocument(queryTask)
    }
  }, [queryTask])

  useEffect(() => {
    const extractComputeDocumentTask = ProviderHelpers.getEntry(computeDocument, queryTask)
    const _selectedTaskData = selectn(['response'], extractComputeDocumentTask)
    if (_selectedTaskData) {
      setSelectedTaskData({
        // Note: this comes directly from the server so need to do the date formatting step
        date: StringHelpers.formatUTCDateString(selectn(['properties', 'nt:dueDate'], _selectedTaskData)),
        id: selectn(['uid'], _selectedTaskData),
        initiator: selectn(['properties', 'nt:initiator'], _selectedTaskData),
        title: selectn(['properties', 'nt:name'], _selectedTaskData),
        itemType: selectedItemData.itemType,
        isNew: selectedItemData.isNew,
      })
    }
  }, [computeDocument, queryTask])

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
      selectedTargetDocumentId = selectn([0, 'targetDocumentsIds', 0], selectedTask)
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

  const onOrderChange = () => {
    navigate(
      getUrlDetailView({
        sortOrder: querySortOrder === 'desc' ? 'asc' : 'desc',
        page: 1,
      })
    )
  }

  const refreshData = () => {
    // Refreshes list in the sidebar
    fetchTasksUsingQueries()
    // TODO: May need to do something with any opened detail panel
  }
  const cellStyle = selectn(['widget', 'cellStyle'], theme) || {}
  const childrenData = {
    columns: [
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
        cellStyle,
      },
      {
        title: 'Change requested',
        field: 'titleTask',
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
    ],
    // data: userId === 'Guest' ? [] : remoteData,
    data: tasks,
    idSelectedItem: queryItem,
    idSelectedTask: queryTask !== URL_QUERY_PLACEHOLDER ? queryTask : undefined,
    listItems: tasks,
    refreshData,
    onClose,
    onOpen,
    onOpenNoId,
    onOrderChange,
    onRowClick,
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
    selectedItemData,
    selectedTaskData,
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
