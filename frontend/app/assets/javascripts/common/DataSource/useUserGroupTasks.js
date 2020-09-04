import { useState, useEffect } from 'react'
import selectn from 'selectn'
import {
  UNKNOWN,
  WORD,
  PHRASE,
  BOOK,
  // SONG,
  // STORY,
} from 'common/Constants'
import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'

import StringHelpers from 'common/StringHelpers'
/**
 * @summary useUserGroupTasks
 * @description Custom hook that returns user tasks
 * @version 1.0.1
 *
 * @component
 */
function useUserGroupTasks() {
  // State Hooks
  const [userId, setUserId] = useState()
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState()

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { /*computeUserGroupTasks, */ getSimpleTasks } = useTasks()

  const _userId = selectn('response.id', computeLogin)
  useEffect(() => {
    setUserId(_userId)
  }, [_userId])

  const formatTasksData = (_tasks) => {
    /*

"entries":

[{
    "entity-type":"simple-task",
    "uid":"3bc2a9f5-8a41-4667-aabb-d1ca9060fffe",
    "targetDoc":{
        "uid":"f0e2abeb-46d9-4559-b525-57067ccd420e",
        "title":"Word",
        "type":"FVWord",
        "isNew":true
    },
    "dateCreated":"2020-09-04T20:53:02.289Z",
    "requestedVisibility":"members",
    "visibilityChanged":true,
    "requestedBy":{
        "firstName":"Dialect",
        "lastName":"recorder_approval",
        "email":"chad.oakenfold+1@gmail.com"
    }
}]
*/
    const formatDate = (date) => StringHelpers.formatUTCDateString(date)
    const formatInitator = ({ firstName, lastName }) => `${firstName} ${lastName}`

    const formatTitleTask = (requestedVisibility) => `Requests visibility set to "${requestedVisibility}"`
    const formatTitleItem = (title = '-') => title

    const formatItemType = (type) => {
      switch (type) {
        case 'FVWord':
          return WORD
        case 'FVPhrase':
          return PHRASE
        case 'FVBook':
          return BOOK
        default:
          return UNKNOWN
      }
    }
    return _tasks.map(({ uid: id, dateCreated, requestedBy, targetDoc, requestedVisibility }) => {
      return {
        date: formatDate(dateCreated),
        id,
        initiator: formatInitator({ firstName: requestedBy.firstName, lastName: requestedBy.lastName }),
        targetDocumentsIds: targetDoc.uid,
        itemType: formatItemType(targetDoc.type),
        isNew: targetDoc.isNew,
        titleTask: formatTitleTask(requestedVisibility),
        titleItem: formatTitleItem(targetDoc.title),
      }
    })
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const fetchUserGroupTasksRemoteData = ({ pageIndex = 0, pageSize = 100, sortBy = 'date', sortOrder = 'desc' }) => {
    const friendlyNamePropertyNameLookup = {
      date: 'nt:dueDate',
      id: 'uid',
      initiator: 'nt:initiator',
      title: 'nt:name',
    }

    return getSimpleTasks({
      currentPageIndex: pageIndex,
      pageSize,
      sortBy: friendlyNamePropertyNameLookup[sortBy],
      sortOrder: sortOrder === '' ? 'desc' : sortOrder,
    }).then((response) => {
      const { entries, resultsCount, pageIndex: _pageIndex } = response
      const data = formatTasksData(entries)
      setTasks(data)
      setCount(resultsCount)
      return {
        data,
        page: _pageIndex,
        totalCount: resultsCount,
      }
    })
  }

  const resetTasks = () => {
    setTasks([])
  }

  return {
    fetchUserGroupTasksRemoteData,
    tasks,
    userId,
    count,
    resetTasks,
  }
}

export default useUserGroupTasks
