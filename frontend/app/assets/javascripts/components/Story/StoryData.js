import PropTypes from 'prop-types'

/**
 * @summary StoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function StoryData({ children }) {
  return children({
    content: 'Output from StoryData',
  })
}
// PROPTYPES
const { func } = PropTypes
StoryData.propTypes = {
  children: func,
}

export default StoryData
