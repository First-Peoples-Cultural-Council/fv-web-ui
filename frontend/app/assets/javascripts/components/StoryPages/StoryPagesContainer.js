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
function StoryPagesContainer({ items, defaultLanguage }) {
  return (
    <StoryPagesData bookEntries={items} defaultLanguage={defaultLanguage}>
      {({ bookPages }) => {
        return <StoryPagesPresentation bookPages={bookPages} />
      }}
    </StoryPagesData>
  )
}
// PROPTYPES
const { array, string } = PropTypes
StoryPagesContainer.propTypes = {
  items: array,
  defaultLanguage: string,
}

export default StoryPagesContainer
