import { useState, useEffect } from 'react'
import selectn from 'selectn'

import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
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

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { /*computeUserGroupTasks, */ fetchUserGroupTasks } = useTasks()

  const _userId = selectn('response.id', computeLogin)
  useEffect(() => {
    setUserId(_userId)
  }, [_userId])

  const formatTasksData = (_tasks) => {
    return _tasks.map(({ uid: id, properties }) => {
      return {
        date: properties['nt:dueDate'],
        id,
        initiator: properties['nt:initiator'],
        targetDocumentsIds: properties['nt:targetDocumentsIds'],
        title: properties['nt:name'],
      }
    })
  }

  // Note: Material-Table has a `sort` bug when using the `remote data` feature
  // see: https://github.com/mbrn/material-table/issues/2177
  const fetchUserGroupTasksRemoteData = ({
    pageIndex = 0,
    pageSize = 100,
    sortBy = 'date',
    sortOrder,
    userId: _id,
  }) => {
    const friendlyNamePropertyNameLookup = {
      date: 'nt:dueDate',
      id: 'uid',
      initiator: 'nt:initiator',
      title: 'nt:name',
    }

    return fetchUserGroupTasks(_id, {
      currentPageIndex: pageIndex,
      pageSize,
      sortBy: friendlyNamePropertyNameLookup[sortBy],
      sortOrder,
    }).then(({ entries, resultsCount, pageIndex: _pageIndex }) => {
      const data = formatTasksData(entries)
      setTasks(data)
      return {
        data,
        page: _pageIndex,
        totalCount: resultsCount,
      }
    })
  }

  return {
    fetchUserGroupTasksRemoteData,
    tasks,
    userId,
  }
}

export default useUserGroupTasks
