import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary GamePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function GamePresentation({ exampleProp }) {
  return <div className="Game">GamePresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
GamePresentation.propTypes = {
  exampleProp: string,
}

export default GamePresentation
