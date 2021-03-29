import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ListPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListPresentation({ exampleProp }) {
  return <div className="List">ListPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
ListPresentation.propTypes = {
  exampleProp: string,
}

export default ListPresentation
