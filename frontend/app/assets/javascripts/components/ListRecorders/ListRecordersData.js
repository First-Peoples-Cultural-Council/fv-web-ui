import PropTypes from 'prop-types'

/**
 * @summary ListRecordersData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ListRecordersData({ children }) {
  return children({
    log: 'Output from ListRecordersData',
  })
}
// PROPTYPES
const { func } = PropTypes
ListRecordersData.propTypes = {
  children: func,
}

export default ListRecordersData
