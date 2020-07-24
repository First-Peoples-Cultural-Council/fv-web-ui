import { useState, useEffect } from 'react'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
/**
 * @summary useUserGroupTasks
 * @description Custom hook that returns user tasks
 * @version 1.0.1
 *
 * @component
 */
function useUserGroupTasks(fetchOnLoad = true) {
  // State Hooks
  const [userId, setUserId] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const [fetchMessage, setFetchMessage] = useState()
  const [page, setPage] = useState()
  const [totalCount, setTotalCount] = useState()
  const [tasks, setTasks] = useState([])

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { computeUserGroupTasks, fetchUserGroupTasks } = useTasks()

  const formatTasksData = (_tasks) => {
    return _tasks.map(({ uid: id, properties }) => {
      return {
        date: properties['nt:dueDate'],
        id,
        initiator: properties['nt:initiator'],
        title: properties['nt:name'],
      }
    })
  }
  const _userId = selectn('response.id', computeLogin)
  useEffect(() => {
    setUserId(_userId)
    if (fetchOnLoad) {
      fetchUserGroupTasks(_userId)
    }
  }, [_userId])

  useEffect(() => {
    if (userId) {
      const userGroupTasks = ProviderHelpers.getEntry(computeUserGroupTasks, userId)

      const _isFetching = selectn('isFetching', userGroupTasks)
      const _message = selectn('message', userGroupTasks)
      const _page = selectn('response.pageIndex', userGroupTasks)
      const _tasks = selectn('response.entries', userGroupTasks)
      const _totalCount = selectn('response.resultsCount', userGroupTasks)

      if (_tasks) {
        setTasks(formatTasksData(_tasks))
        setFetchMessage(_message)
        setIsFetching(_isFetching)
        setPage(_page)
        setTotalCount(_totalCount)
      }
    }
  }, [userId, computeUserGroupTasks])

  return {
    computeUserGroupTasks,
    fetchMessage,
    fetchUserGroupTasks,
    formatTasksData,
    hasTasks: tasks.length > 0,
    isFetching,
    page,
    tasks,
    totalCount,
    userId,
  }
}

export default useUserGroupTasks
