import PropTypes from 'prop-types'

/**
 * @summary RecordersData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RecordersData({ children }) {
  return children({
    log: 'Output from RecordersData',
  })
}
// PROPTYPES
const { func } = PropTypes
RecordersData.propTypes = {
  children: func,
}

export default RecordersData
