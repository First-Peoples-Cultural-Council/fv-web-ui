import PropTypes from 'prop-types'

/**
 * @summary ShareData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ShareData({ children }) {
  return children({
    log: 'Output from ShareData',
  })
}
// PROPTYPES
const { func } = PropTypes
ShareData.propTypes = {
  children: func,
}

export default ShareData
