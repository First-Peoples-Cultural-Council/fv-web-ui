import PropTypes from 'prop-types'

/**
 * @summary ActivityStreamData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ActivityStreamData({ children }) {
  return children({
    log: 'Output from ActivityStreamData',
  })
}
// PROPTYPES
const { func } = PropTypes
ActivityStreamData.propTypes = {
  children: func,
}

export default ActivityStreamData
