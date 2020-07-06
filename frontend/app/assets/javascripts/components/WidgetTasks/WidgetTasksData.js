import { useState, useEffect } from 'react'
import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import useNavigationHelpers from 'common/useNavigationHelpers'

/**
 * @summary WidgetTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 *
 */
function WidgetTasksData({ children }) {
  // State Hooks
  const [userId, setUserId] = useState()

  // Custom Hooks
  const { navigate } = useNavigationHelpers()
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

  const onRowClick = (event, { taskUid }) => {
    navigate(`/dashboard/tasks?taskId=${taskUid}`)
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
        if (tasks.length === 5) {
          break
        }

        const task = userGroupTasksEntries[i]

        if (task) {
          const { uid: taskUid, properties } = task
          // Push if relevant:
          if (properties['nt:directive'] !== 'org.nuxeo.ecm.platform.publisher.task.CoreProxyWithWorkflowFactory') {
            tasks.push({
              requestedBy: properties['nt:initiator'],
              title: properties['nt:name'],
              startDate: properties['dc:created'],
              taskUid,
            })
          }
        }
      }
    }
    hasTasks = (tasks || []).length > 0
  }

  return children({
    columns: [
      {
        title: '',
        field: 'icon',
        render: () => {
          return '[~]'
        },
      },
      {
        title: 'Entry title',
        field: 'title',
      },
      {
        title: 'Requested by',
        field: 'requestedBy',
      },
      {
        title: 'Date submitted',
        field: 'startDate',
        render: ({ startDate }) => StringHelpers.formatUTCDateString(new Date(startDate)),
      },
    ],
    hasTasks,
    onRowClick,
    options: { actionsColumnIndex: -1 },
    data: tasks,
    isFetching,
    fetchMessage,
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
