import { useEffect } from 'react'
import PropTypes from 'prop-types'

import useNavigationHelpers from 'common/useNavigationHelpers'
import useUserGroupTasks from 'DataSource/useUserGroupTasks'

import { URL_QUERY_PLACEHOLDER } from 'common/Constants'

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
  const { getSearchObject, navigate, navigateReplace } = useNavigationHelpers()
  const { active } = getSearchObject()

  const { fetchMessage, isFetching, tasks } = useUserGroupTasks()
  useEffect(() => {
    if (active === URL_QUERY_PLACEHOLDER && tasks.length > 0) {
      navigateReplace(`${window.location.pathname}?active=${tasks[0].id}`)
    }
  }, [tasks])

  const onClose = () => {
    navigate(`${window.location.pathname}`)
  }
  const onOpen = (id) => {
    navigate(`${window.location.pathname}?active=${id ? id : URL_QUERY_PLACEHOLDER}`)
  }
  const columns = [
    { title: '[Icon]', field: 'itemType' },
    { title: 'Title', field: 'title' },
    { title: 'Requested By', field: 'initiator' },
    { title: 'Task Due Date', field: 'date' },
  ]
  return children({
    columns,
    fetchMessage,
    isFetching,
    listItems: tasks,
    onClose,
    onOpen,
    selectedTaskId: active,
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailTasksData.propTypes = {
  children: func,
}

export default DashboardDetailTasksData
