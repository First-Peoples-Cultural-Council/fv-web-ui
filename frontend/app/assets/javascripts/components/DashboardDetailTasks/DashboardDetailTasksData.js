import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import useDocument from 'DataSource/useDocument'
import ProviderHelpers from 'common/ProviderHelpers'
import { URL_QUERY_PLACEHOLDER } from 'common/Constants'
import StringHelpers from 'common/StringHelpers'
import { TableContextSort, TableContextCount } from 'components/Table/TableContext'
/**
 * @summary DashboardDetailTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardDetailTasksData({ children }) {
  // const [pageSize, setPageSize] = useState(10)
  // const [sortDirection, setSortDirection] = useState('desc')
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

  const { count: tasksCount, fetchUserGroupTasksRemoteData, tasks, userId } = useUserGroupTasks()

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

  useEffect(() => {
    const _queryPage = Number(queryPage)
    fetchUserGroupTasksRemoteData({
      pageIndex: _queryPage === 0 ? _queryPage : _queryPage - 1,
      pageSize: queryPageSize,
      sortBy: querySortBy,
      sortOrder: querySortOrder,
      userId,
    })
  }, [queryPage, queryPageSize, querySortBy, querySortOrder])

  // Redirect when http://...?task=[ID] and we have tasks + userId
  useEffect(() => {
    if (queryTask && tasks.length > 0) {
      navigateReplace(
        getUrlWithQuery({
          task: queryTask === URL_QUERY_PLACEHOLDER ? tasks[0].id : queryTask,
          item: queryItem ? queryItem : selectn([0, 'targetDocumentsIds', 0], tasks), // TODO: NOT SELECTING CORRECTLY?
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

    // General
    // const dialectClassName = getDialectClassname(computeDialect2) // TODO

    // const metadata = selectn('response', _selectedItemData) ? (
    //   <MetadataPanel properties={this.props.properties} computeEntity={_selectedItemData} />
    // ) : null  // TODO
    setSelectedItemData({
      acknowledgement: selectn('properties.fv-word:acknowledgement', _selectedItemData),
      audio: selectn('contextParameters.word.related_audio', _selectedItemData) || [],
      categories: selectn('contextParameters.word.categories', _selectedItemData) || [],
      culturalNotes: selectn('properties.fv:cultural_note', _selectedItemData) || [],
      definitions: selectn('properties.fv:definitions', _selectedItemData),
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
        date: selectn(['properties', 'nt:dueDate'], _selectedTaskData),
        id: selectn(['uid'], _selectedTaskData),
        initiator: selectn(['properties', 'nt:initiator'], _selectedTaskData),
        title: selectn(['properties', 'nt:name'], _selectedTaskData),
        itemType: selectedItemData.itemType,
        isNew: selectedItemData.isNew,
      })
    }
  }, [computeDocument, queryTask])

  const onClose = () => {
    navigate(`${window.location.pathname}`)
  }

  const onOpen = (id) => {
    let selectedTargetDocumentId
    if (tasks && tasks.length > 0) {
      const selectedTask = tasks.filter((task) => {
        return task.id === id
      })
      selectedTargetDocumentId = selectn([0, 'targetDocumentsIds', 0], selectedTask)
    }

    const url =
      id === undefined
        ? `/dashboard/tasks?task=${URL_QUERY_PLACEHOLDER}`
        : getUrlWithQuery({
            task: id,
            item: selectedTargetDocumentId,
          })

    navigate(url)
  }

  const getUrlWithQuery = ({
    item = queryItem,
    page = queryPage,
    pageSize = queryPageSize,
    sortBy = querySortBy,
    sortOrder = querySortOrder,
    task = queryTask,
  }) => {
    return `${window.location.pathname}?task=${task}&item=${item}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  }

  const onRowClick = (event, { id }) => {
    onOpen(id)
  }

  const onOrderChange = () => {
    navigate(
      getUrlWithQuery({
        sortOrder: querySortOrder === 'desc' ? 'asc' : 'desc',
      })
    )
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  // const remoteData = (data = {}) => {
  //   const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize: _pageSize } = data

  //   const { field: sortBy } = orderBy

  //   return fetchUserGroupTasksRemoteData({
  //     pageIndex,
  //     pageSize: _pageSize,
  //     sortBy,
  //     sortOrder,
  //     userId,
  //   })
  // }

  // const onChangeRowsPerPage = (_pageSize) => {
  //   navigate(
  //     getUrlWithQuery({
  //       pageSize: _pageSize,
  //     })
  //   )
  // }
  return (
    <TableContextCount.Provider value={Number(tasksCount)}>
      <TableContextSort.Provider value={querySortOrder}>
        {children({
          columns: [
            {
              title: '',
              field: 'icon',
              render: () => {
                return '[~]'
              },
              sorting: false,
            },
            {
              title: 'Entry title',
              field: 'title',
            },
            {
              title: 'Requested by',
              field: 'initiator',
            },
            {
              title: 'Date submitted',
              field: 'date',
              render: ({ date }) => StringHelpers.formatUTCDateString(new Date(date)),
            },
          ],
          // data: userId === 'Guest' ? [] : remoteData,
          data: tasks,
          idSelectedItem: queryItem,
          idSelectedTask: queryTask !== URL_QUERY_PLACEHOLDER ? queryTask : undefined,
          listItems: tasks,
          // onChangeRowsPerPage,
          onClose,
          onOpen,
          onOrderChange,
          onRowClick,
          options: {
            pageSize: Number(queryPageSize),
            pageSizeOptions: [5, 10, 20],
            paging: true,
            sorting: true,
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
        })}
      </TableContextSort.Provider>
    </TableContextCount.Provider>
  )
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailTasksData.propTypes = {
  children: func,
}

export default DashboardDetailTasksData
