import PropTypes from 'prop-types'

/**
 * @summary HeaderData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function HeaderData({ children }) {
  return children({
    log: 'Output from HeaderData',
  })
}
// PROPTYPES
const { func } = PropTypes
HeaderData.propTypes = {
  children: func,
}

export default HeaderData
