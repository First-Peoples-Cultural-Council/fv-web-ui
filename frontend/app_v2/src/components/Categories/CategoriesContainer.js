import React from 'react'
// import PropTypes from 'prop-types'
import CategoriesPresentation from 'components/Categories/CategoriesPresentation'
import CategoriesData from 'components/Categories/CategoriesData'

/**
 * @summary CategoriesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoriesContainer() {
  const { exampleOutput } = CategoriesData({ exampleInput: 'passedInToData' })
  return <CategoriesPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
CategoriesContainer.propTypes = {
  //   something: string,
}

export default CategoriesContainer
