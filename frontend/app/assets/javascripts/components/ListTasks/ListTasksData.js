import PropTypes from 'prop-types'

/**
 * @summary ListTasksData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListTasksData({ children }) {
  return children({
    log: 'Output from ListTasksData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListTasksData.propTypes = {
  children: func,
}

export default ListTasksData
