import React from 'react'
// import PropTypes from 'prop-types'
import StoryPagePresentation from 'components/StoryPage/StoryPagePresentation'
import StoryPageData from 'components/StoryPage/StoryPageData'

/**
 * @summary StoryPageContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPageContainer() {
  return (
    <StoryPageData>
      {({ content }) => {
        return <StoryPagePresentation content={content} />
      }}
    </StoryPageData>
  )
}
// PROPTYPES
// const { object } = PropTypes
StoryPageContainer.propTypes = {
  //   something: object,
}

export default StoryPageContainer
