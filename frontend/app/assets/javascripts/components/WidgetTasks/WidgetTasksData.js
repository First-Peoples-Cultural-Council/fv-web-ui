import { useState, useEffect } from 'react'
import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
import useUser from 'DataSource/useUser'
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
  const { computeUserDialects, fetchUserDialects } = useUser()
  const {
    // computeUserTasks,
    computeUserGroupTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
    fetchUserTasks,
    fetchUserGroupTasks,
  } = useTasks()

  useEffect(() => {
    fetchData()
  }, [computeLogin, computeUserTasksApprove, computeUserTasksReject])

  const fetchData = () => {
    const _userId = selectn('response.id', computeLogin)
    if (_userId) {
      setUserId(_userId)
      fetchUserTasks(_userId)
      fetchUserGroupTasks(_userId)
      ProviderHelpers.fetchIfMissing(_userId, fetchUserDialects, computeUserDialects)
    }
  }

  const onRowClick = (event, { taskUid }) => {
    navigate(`/dashboard/tasks?taskId=${taskUid}`)
  }

  let hasTasks
  const tasks = []
  if (userId) {
    // const _computeUserTasks = ProviderHelpers.getEntry(computeUserTasks, userId)

    const userGroupTasks = ProviderHelpers.getEntry(computeUserGroupTasks, userId)
    const userGroupTasksEntries = selectn('response.entries', userGroupTasks)

    if (userGroupTasksEntries) {
      for (let i = 0; i < userGroupTasksEntries.length; i++) {
        if (tasks.length === 5) {
          break
        }

        const task = userGroupTasksEntries[i]

        if (task) {
          const { uid: taskUid, properties } = task
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
          // console.log('Icon', {rowData})
          return '[~]'
        },
      },
      {
        title: 'Entry title',
        field: 'title' /* render: ({title}) => {
        console.log('Title', {rowData})
        return 'TODO'
      }*/,
      },
      {
        title: 'Requested by',
        field:
          'requestedBy' /* render: (rowData) => {
        console.log('Requested by', {rowData})
        return 'TODO'
      } */,
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
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetTasksData.propTypes = {
  children: func,
}

export default WidgetTasksData
