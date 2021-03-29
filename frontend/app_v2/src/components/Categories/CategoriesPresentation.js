import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary CategoriesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoriesPresentation({ exampleProp }) {
  return <div className="Categories">CategoriesPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
CategoriesPresentation.propTypes = {
  exampleProp: string,
}

export default CategoriesPresentation
