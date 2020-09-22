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
 * @summary useDashboard
 * @description Custom hook that returns user tasks
 * @version 1.0.1
 *
 * @component
 */
function useDashboard() {
  // State Hooks
  const [userId, setUserId] = useState()
  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState()

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { getSimpleTasks, getSimpleTask, processedTasks } = useTasks()

  const _userId = selectn('response.id', computeLogin)
  useEffect(() => {
    setUserId(_userId)
  }, [_userId])

  const formatTasksData = (_tasks) => {
    const formatDate = (date) => StringHelpers.formatLocalDateString(date)
    const formatInitator = ({ email, firstName, lastName }) => {
      const fullName = `${firstName ? firstName : ''} ${lastName ? lastName : ''}`
      return `${email}${fullName.trim() !== '' ? ` - ${fullName}` : ''}`
    }

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
    return _tasks.map(({ uid: id, dateCreated, requestedBy = {}, targetDoc, requestedVisibility }) => {
      return {
        date: formatDate(dateCreated),
        id,
        initiator: formatInitator({
          email: requestedBy.email,
          firstName: requestedBy.firstName,
          lastName: requestedBy.lastName,
        }),
        targetDocumentsIds: targetDoc.uid,
        itemType: formatItemType(targetDoc.type),
        isNew: targetDoc.isNew,
        titleTask: formatTitleTask(requestedVisibility),
        titleItem: formatTitleItem(targetDoc.title),
      }
    })
  }

  const fetchTasksRemoteData = ({ pageIndex = 0, pageSize = 100, sortBy = 'date', sortOrder = 'desc' }) => {
    // NOTE: The component consumes data that isn't a 1:1 match of the server's output
    // It is meant to limit coupling between the server & FE and make working with the
    // data easier in the FE. The following `friendlyNamePropertyNameLookup` converts
    // component names back to the server names
    const friendlyNamePropertyNameLookup = {
      date: 'dc:created',
      id: 'uid',
      initiator: 'nt:initiator', // aka requested by person's email
      titleTask: 'nt:directive', // aka requested visibility
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

  const fetchTask = (taskId) => {
    return getSimpleTask(taskId)
      .then((data) => {
        return formatTasksData([data])
      })
      .then((tasksArray) => {
        return tasksArray.length ? tasksArray[0] : {}
      })
  }

  const resetTasks = () => {
    setTasks([])
  }

  return {
    fetchTasksRemoteData,
    fetchTask,
    tasks,
    userId,
    count,
    resetTasks,
    processedTasks,
  }
}

export default useDashboard
