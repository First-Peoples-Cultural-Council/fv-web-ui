import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'
import useDocument from 'DataSource/useDocument'
import ProviderHelpers from 'common/ProviderHelpers'
import { URL_QUERY_PLACEHOLDER } from 'common/Constants'
import StringHelpers from 'common/StringHelpers'
import TableContextSort from 'components/Table/TableContextSort'
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
  const [pageSize, setPageSize] = useState(5)
  const [sortDirection, setSortDirection] = useState('desc')
  const idSelectedItem = useRef()
  const [selectedItemData, setSelectedItemData] = useState({})
  const { getSearchObject, navigate /*, navigateReplace*/ } = useNavigationHelpers()
  const { computeDocument, fetchDocument } = useDocument()
  const { active } = getSearchObject()

  const { fetchUserGroupTasksRemoteData, userId, tasks } = useUserGroupTasks()
  useEffect(() => {
    if (active === URL_QUERY_PLACEHOLDER && tasks.length > 0) {
      // navigateReplace(`${window.location.pathname}?active=${tasks[0].id}`)
    }
  }, [])

  useEffect(() => {
    if (active && active !== URL_QUERY_PLACEHOLDER && tasks.length > 0) {
      const selectedTask = tasks.filter(({ id }) => {
        return id === active
      })
      const firstTargetDocumentId = selectn([0, 'targetDocumentsIds', 0], selectedTask)
      idSelectedItem.current = firstTargetDocumentId
      fetchDocument(idSelectedItem.current)
    }
  }, [active, tasks])

  useEffect(() => {
    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, idSelectedItem.current)
    const _selectedItemData = selectn(['response'], extractComputeDocument)
    // General
    // const dialectClassName = getDialectClassname(computeDialect2)

    // const metadata = selectn('response', _selectedItemData) ? (
    //   <MetadataPanel properties={this.props.properties} computeEntity={_selectedItemData} />
    // ) : null
    setSelectedItemData({
      itemType: selectn('type', _selectedItemData),
      culturalNotes: selectn('properties.fv:cultural_note', _selectedItemData) || [],
      definitions: selectn('properties.fv:definitions', _selectedItemData),
      title: selectn('title', _selectedItemData),
      literalTranslations: selectn('properties.fv:literal_translation', _selectedItemData),
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
    })
  }, [computeDocument])

  const onClose = () => {
    navigate(`${window.location.pathname}`)
  }

  const onOpen = (id) => {
    navigate(`${window.location.pathname}?active=${id ? id : URL_QUERY_PLACEHOLDER}`)
  }

  const onRowClick = (event, { id }) => {
    onOpen(id)
  }

  const onOrderChange = (/*columnId, orderDirection*/) => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const remoteData = (data) => {
    const { orderBy = {}, orderDirection: sortOrder, page: pageIndex, pageSize: _pageSize } = data

    const { field: sortBy } = orderBy

    return fetchUserGroupTasksRemoteData({
      pageIndex,
      pageSize: _pageSize,
      sortBy,
      sortOrder,
      userId,
    })
  }

  return (
    <TableContextSort.Provider value={sortDirection}>
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
        idSelectedItem: idSelectedItem.current,
        idSelectedTask: active !== URL_QUERY_PLACEHOLDER ? active : undefined,
        listItems: tasks,
        onClose,
        onOpen,
        selectedItemData,
        // NEW
        data: userId === 'Guest' ? [] : remoteData,
        onChangeRowsPerPage: (_pageSize) => {
          setPageSize(_pageSize)
        },
        onOrderChange,
        onRowClick,
        options: {
          pageSize,
          pageSizeOptions: [5, 10, 20],
          paging: true,
          sorting: true,
        },
        sortDirection,
      })}
    </TableContextSort.Provider>
  )
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailTasksData.propTypes = {
  children: func,
}

export default DashboardDetailTasksData
