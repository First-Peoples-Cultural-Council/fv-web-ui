import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ListsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListsPresentation({ exampleProp }) {
  return <div className="Lists">ListsPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
ListsPresentation.propTypes = {
  exampleProp: string,
}

export default ListsPresentation
