import PropTypes from 'prop-types'

/**
 * @summary TEMPLATEData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function TEMPLATEData({ children }) {
  return children({
    log: 'Output from TEMPLATEData',
  })
}
// PROPTYPES
const { func } = PropTypes
TEMPLATEData.propTypes = {
  children: func,
}

export default TEMPLATEData
