import React from 'react'
// import PropTypes from 'prop-types'
import StoryPresentation from 'components/Story/StoryPresentation'
import StoryData from 'components/Story/StoryData'

/**
 * @summary StoryContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryContainer() {
  const { exampleOutput } = StoryData({ exampleInput: 'passedInToData' })
  return <StoryPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
StoryContainer.propTypes = {
  //   something: string,
}

export default StoryContainer
