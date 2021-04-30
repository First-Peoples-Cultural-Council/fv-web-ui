import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary StoryPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPresentation({ exampleProp }) {
  return <div className="Story">StoryPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
StoryPresentation.propTypes = {
  exampleProp: string,
}

export default StoryPresentation
