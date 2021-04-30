import React from 'react'
// import PropTypes from 'prop-types'
import StoriesPresentation from 'components/Stories/StoriesPresentation'
import StoriesData from 'components/Stories/StoriesData'

/**
 * @summary StoriesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoriesContainer() {
  const { exampleOutput } = StoriesData({ exampleInput: 'passedInToData' })
  return <StoriesPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
StoriesContainer.propTypes = {
  //   something: string,
}

export default StoriesContainer
