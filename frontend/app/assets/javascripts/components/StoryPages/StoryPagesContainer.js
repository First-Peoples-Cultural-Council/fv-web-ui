import React from 'react'
import PropTypes from 'prop-types'
import StoryPagesPresentation from 'components/StoryPages/StoryPagesPresentation'
import StoryPagesData from 'components/StoryPages/StoryPagesData'

/**
 * @summary StoryPagesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} items the response from fetchBookEntries/computeBookEntries
 * @param {string} defaultLanguage the default language for translation/definition of the dialect
 *
 * @returns {node} jsx markup
 */
function StoryPagesContainer({ bookEntries, closeBookAction, defaultLanguage }) {
  return (
    <StoryPagesData bookEntries={bookEntries} defaultLanguage={defaultLanguage}>
      {({ bookPages }) => {
        return <StoryPagesPresentation bookPages={bookPages} closeBookAction={closeBookAction} />
      }}
    </StoryPagesData>
  )
}
// PROPTYPES
const { array, func, string } = PropTypes
StoryPagesContainer.propTypes = {
  bookEntries: array,
  defaultLanguage: string,
  closeBookAction: func,
}

export default StoryPagesContainer
