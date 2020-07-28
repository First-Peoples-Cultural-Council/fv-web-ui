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
function DashboardDetailSelectedItemData({ children, id }) {
  return children({
    log: 'Output from DashboardDetailSelectedItemData',
    id,
  })
}
// PROPTYPES
const { func, string } = PropTypes
DashboardDetailSelectedItemData.propTypes = {
  children: func,
  id: string,
}

export default DashboardDetailSelectedItemData
