import React from 'react'
// import PropTypes from 'prop-types'
import StoryPagesPresentation from 'components/StoryPage/StoryPagePresentation'
import StoryPagesData from 'components/StoryPage/StoryPagesData'

/**
 * @summary StoryPagesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPagesContainer({ bookEntries, defaultLanguage }) {
  return (
    <StoryPagesData bookEntries={bookEntries} defaultLanguage={defaultLanguage}>
      {({ bookPages }) => {
        return <StoryPagesPresentation bookPages={bookPages} />
      }}
    </StoryPagesData>
  )
}
// PROPTYPES
// const { object } = PropTypes
StoryPagesContainer.propTypes = {
  //   something: object,
}

export default StoryPagesContainer
