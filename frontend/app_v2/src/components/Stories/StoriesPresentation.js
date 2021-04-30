import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary StoriesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoriesPresentation({ exampleProp }) {
  return <div className="Stories">StoriesPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
StoriesPresentation.propTypes = {
  exampleProp: string,
}

export default StoriesPresentation
