import PropTypes from 'prop-types'

/**
 * @summary KidsData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function KidsData({ children }) {
  return children({
    log: 'Output from KidsData',
  })
}
// PROPTYPES
const { func } = PropTypes
KidsData.propTypes = {
  children: func,
}

export default KidsData
