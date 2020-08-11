import PropTypes from 'prop-types'

/**
 * @summary DetailStoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailStoryData({ children }) {
  return children({
    content: 'Output from DetailStoryData',
  })
}
// PROPTYPES
const { func } = PropTypes
DetailStoryData.propTypes = {
  children: func,
}

export default DetailStoryData
