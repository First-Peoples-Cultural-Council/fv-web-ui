import PropTypes from 'prop-types'

/**
 * @summary DialectHeaderData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DialectHeaderData({ children }) {
  return children({
    log: 'Output from DialectHeaderData',
  })
}
// PROPTYPES
const { func } = PropTypes
DialectHeaderData.propTypes = {
  children: func,
}

export default DialectHeaderData
