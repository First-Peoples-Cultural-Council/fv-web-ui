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
import useLogin from 'dataSources/useLogin'
import useTasks from 'dataSources/useTasks'

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
    const formatDateMDY = (date) => StringHelpers.formatLocalDateStringMDY(date)
    const formatInitator = ({ email, firstName, lastName }) => {
      const fullName = formatInitatorFullName({ firstName, lastName })
      return `${email}${fullName !== '' ? ` ${fullName}` : ''}`
    }
    const formatInitatorFullName = ({ firstName, lastName }) => {
      return `${firstName ? firstName : ''} ${lastName ? lastName : ''}`.trim()
    }

    const formatTitleTask = ({ visibility }) => {
      return StringHelpers.visibilityText({ visibility })
    }
    const formatTitleTaskDetail = ({ firstName, lastName, type, email }) => {
      let item
      switch (type) {
        case 'FVWord':
          item = 'Word'
          break
        case 'FVPhrase':
          item = 'Phrase'
          break
        case 'FVBook':
          item = 'Song/story'
          break
        default:
          item = 'A'
      }
      const fullName = formatInitatorFullName({ firstName, lastName })
      return `${item} review requested by ${fullName !== '' ? fullName : email}`
    }
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
    const formatItemTypeForUI = (type) => {
      switch (type) {
        case 'FVWord':
          return 'Word'
        case 'FVPhrase':
          return 'Phrase'
        case 'FVBook':
          return 'Book'
        default:
          return 'Item'
      }
    }
    return _tasks.map(
      ({ comments, uid: id, dateCreated, requestedBy = {}, targetDoc, requestedVisibility, visibilityChanged }) => {
        const { email, firstName, lastName } = requestedBy
        return {
          comments: comments && comments.length > 0 ? comments : undefined,
          date: formatDate(dateCreated),
          dateMDY: formatDateMDY(dateCreated),
          id,
          initiator: formatInitator({
            email,
            firstName,
            lastName,
          }),
          initiatorEmail: email,
          initiatorFullName: formatInitatorFullName({
            firstName,
            lastName,
          }),
          isNew: targetDoc.isNew,
          itemType: formatItemType(targetDoc.type),
          itemTypeForUI: formatItemTypeForUI(targetDoc.type),
          targetDocumentsIds: targetDoc.uid,
          titleItem: formatTitleItem(targetDoc.title),
          titleTaskDetail: formatTitleTaskDetail({
            type: targetDoc.type,
            firstName: requestedBy.firstName,
            lastName: requestedBy.lastName,
            email: requestedBy.email,
          }),
          titleTask: formatTitleTask({ visibility: requestedVisibility }),
          visibilityChanged,
          requestedVisibility,
        }
      }
    )
  }

  const fetchTasksRemoteData = ({ pageIndex = 0, pageSize = 100, sortBy = 'date', sortOrder = 'desc' }) => {
    // NOTE: The component consumes data that isn't a 1:1 match of the server's output
    // It is meant to limit coupling between the server & FE and make working with the
    // data easier in the FE. The following `friendlyNamePropertyNameLookup` converts
    // component names back to the server names
    const friendlyNamePropertyNameLookup = {
      date: 'dc:created',
      id: 'uid',
      initiatorFullName: 'nt:initiator',
      initiator: 'nt:initiator', // aka requested by person's email
      initiatorEmail: 'nt:initiator',
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
