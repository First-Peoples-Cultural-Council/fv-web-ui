import { useState, useEffect } from 'react'
import useLogin from 'DataSource/useLogin'
import useTasks from 'DataSource/useTasks'
import useUser from 'DataSource/useUser'
import useIntl from 'DataSource/useIntl'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'

/**
 * @summary ListTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children Render prop technique
 * @param {object} [props.columnRender = undefined] Object that customizes how cell data is rendered. Prop names need to match values in columns[#].field
 *
 */
function ListTasksData({ children, columnRender }) {
  // State Hooks
  const [userId, setUserId] = useState()
  const [isActingOnATask, setIsActingOnATask] = useState(false)

  // Custom Hooks
  const { computeLogin } = useLogin()
  const { intl } = useIntl()
  const { computeUserDialects, fetchUserDialects } = useUser()
  const {
    approveTask,
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
    computeUserTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
    fetchUserTasks,
    rejectTask,
  } = useTasks()

  useEffect(() => {
    fetchData()
  }, [
    computeLogin,
    computeUserTasksApprove,
    computeUserTasksReject,
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
  ])

  const fetchData = () => {
    const _userId = selectn('response.id', computeLogin)
    if (_userId) {
      setUserId(_userId)
      fetchUserTasks(_userId)
      ProviderHelpers.fetchIfMissing(_userId, fetchUserDialects, computeUserDialects)
    }
  }

  const generateUserRegistrationTasks = (computeUserDialectsResponseEntries = []) => {
    return computeUserDialectsResponseEntries.map((dialect = {}) => {
      const uid = selectn('uid', dialect)
      return {
        href: uid ? `/tasks/users/${uid}` : '#',
        dialectName: selectn(['properties', 'dc:title'], dialect),
      }
    })
  }

  const onTaskApprove = ({ id, comment = '' }) => {
    setIsActingOnATask(true)
    approveTask(
      id,
      {
        comment,
        status: 'validate',
      },
      null,
      intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
    )
    setIsActingOnATask(false)
  }

  const onTaskReject = ({ id, comment = '' }) => {
    setIsActingOnATask(true)
    rejectTask(
      id,
      {
        comment,
        status: 'reject',
      },
      null,
      intl.trans('views.pages.tasks.request_rejected', 'Request Rejected Successfully', 'words')
    )
    setIsActingOnATask(false)
  }

  let hasTasks
  let hasRegistrationTasks
  let userRegistrationTasks = []
  let tasks = []
  if (userId) {
    const _computeUserTasks = ProviderHelpers.getEntry(computeUserTasks, userId)
    const _computeUserDialects = ProviderHelpers.getEntry(computeUserDialects, userId)

    userRegistrationTasks = generateUserRegistrationTasks(selectn('response.entries', _computeUserDialects))
    tasks = selectn('response', _computeUserTasks)
    hasTasks = (tasks || []).length > 0
    hasRegistrationTasks = userRegistrationTasks.length > 0
  }

  return children({
    columns: [
      { title: 'Document Title', field: 'documentTitle', render: columnRender.documentTitle },
      { title: 'Task Type', field: 'taskName', render: columnRender.taskName },
      { title: 'Task Due Date', field: 'dueDate', render: columnRender.dueDate },
    ],
    hasRegistrationTasks,
    hasTasks,
    isActingOnATask,
    onTaskApprove,
    onTaskReject,
    options: { actionsColumnIndex: 2 },
    tasks,
    userRegistrationTasks,
  })
}
// PROPTYPES
const { func, object } = PropTypes
ListTasksData.propTypes = {
  children: func,
  columnRender: object,
}

export default ListTasksData
