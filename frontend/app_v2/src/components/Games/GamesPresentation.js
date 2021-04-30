import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary GamesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function GamesPresentation({ exampleProp }) {
  return <div className="Games">GamesPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
GamesPresentation.propTypes = {
  exampleProp: string,
}

export default GamesPresentation
