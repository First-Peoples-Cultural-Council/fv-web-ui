import PropTypes from 'prop-types'
import StringHelpers from 'common/StringHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'

import useUserGroupTasks from 'DataSource/useUserGroupTasks'

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
  // Custom Hooks
  const { fetchMessage, hasTasks, isFetching, tasks } = useUserGroupTasks(5)
  const { navigate } = useNavigationHelpers()

  const onRowClick = (event, { id }) => {
    navigate(`/dashboard/tasks?active=${id}`)
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
        field: 'initiator',
      },
      {
        title: 'Date submitted',
        field: 'date',
        render: ({ date }) => StringHelpers.formatUTCDateString(new Date(date)),
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
