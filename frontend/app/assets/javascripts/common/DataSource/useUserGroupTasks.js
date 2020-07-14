import { useState, useEffect } from 'react'
import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
/**
 * @summary useUserGroupTasks
 * @description Custom hook that returns user tasks
 * @version 1.0.1
 *
 * @component
 */
function useUserGroupTasks(limit) {
  // State Hooks
  const [userId, setUserId] = useState()

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { computeUserGroupTasks, fetchUserGroupTasks } = useTasks()

  useEffect(() => {
    fetchData()
  }, [computeLogin])

  const fetchData = () => {
    const _userId = selectn('response.id', computeLogin)
    if (_userId) {
      setUserId(_userId)
      fetchUserGroupTasks(_userId)
    }
  }

  let hasTasks
  let isFetching = false
  let fetchMessage
  const tasks = []
  if (userId) {
    const userGroupTasks = ProviderHelpers.getEntry(computeUserGroupTasks, userId)
    isFetching = userGroupTasks.isFetching

    if (userGroupTasks.message !== '') {
      fetchMessage = userGroupTasks.message
    }
    const userGroupTasksEntries = selectn('response.entries', userGroupTasks)

    if (userGroupTasksEntries) {
      for (let i = 0; i < userGroupTasksEntries.length; i++) {
        if (limit && tasks.length === limit) {
          break
        }

        const task = userGroupTasksEntries[i]

        if (task) {
          const { uid: id, properties } = task
          tasks.push({
            initiator: properties['nt:initiator'],
            title: properties['nt:name'],
            date: properties['dc:created'],
            id,
          })
        }
      }
    }
    hasTasks = (tasks || []).length > 0
  }

  return {
    tasks,
    hasTasks,
    isFetching,
    fetchMessage,
  }
}

export default useUserGroupTasks
