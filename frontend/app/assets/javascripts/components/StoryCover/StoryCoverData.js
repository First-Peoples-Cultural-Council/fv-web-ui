import PropTypes from 'prop-types'

/**
 * @summary StoryCoverData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function StoryCoverData({ children }) {
  return children({
    content: 'Output from StoryCoverData',
  })
}
// PROPTYPES
const { func } = PropTypes
StoryCoverData.propTypes = {
  children: func,
}

export default StoryCoverData
