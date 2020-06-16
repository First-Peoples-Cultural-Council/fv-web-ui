import PropTypes from 'prop-types'

/**
 * @summary TasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function TasksData({ children }) {
  return children({
    log: 'Output from TasksData',
  })
}
// PROPTYPES
const { func } = PropTypes
TasksData.propTypes = {
  children: func,
}

export default TasksData
