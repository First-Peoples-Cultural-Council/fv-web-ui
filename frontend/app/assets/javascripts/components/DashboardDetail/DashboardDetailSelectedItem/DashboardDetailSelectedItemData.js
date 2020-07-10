import PropTypes from 'prop-types'

/**
 * @summary DashboardDetailSelectedItemData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DashboardDetailSelectedItemData({ children }) {
  return children({
    log: 'Output from DashboardDetailSelectedItemData',
  })
}
// PROPTYPES
const { func } = PropTypes
DashboardDetailSelectedItemData.propTypes = {
  children: func,
}

export default DashboardDetailSelectedItemData
