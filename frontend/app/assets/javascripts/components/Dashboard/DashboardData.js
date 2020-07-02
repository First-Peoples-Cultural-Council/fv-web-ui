import PropTypes from 'prop-types'

/**
 * @summary DashboardData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardData({ children }) {
  return children({
    log: 'Output from DashboardData',
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardData.propTypes = {
  children: func,
}

export default DashboardData
