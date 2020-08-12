import PropTypes from 'prop-types'

/**
 * @summary StoryPageData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function StoryPageData({ children }) {
  return children({
    content: 'Output from StoryPageData',
  })
}
// PROPTYPES
const { func } = PropTypes
StoryPageData.propTypes = {
  children: func,
}

export default StoryPageData
