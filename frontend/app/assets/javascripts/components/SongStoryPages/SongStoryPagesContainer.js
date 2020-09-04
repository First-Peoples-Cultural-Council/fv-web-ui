import React from 'react'
import PropTypes from 'prop-types'
import SongStoryPagesPresentation from 'components/SongStoryPages/SongStoryPagesPresentation'
import SongStoryPagesData from 'components/SongStoryPages/SongStoryPagesData'

/**
 * @summary SongStoryPagesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} items the response from fetchBookEntries/computeBookEntries
 * @param {string} defaultLanguage the default language for translation/definition of the dialect
 *
 * @returns {node} jsx markup
 */
function SongStoryPagesContainer({ bookEntries, closeBookAction, defaultLanguage }) {
  return (
    <SongStoryPagesData bookEntries={bookEntries} defaultLanguage={defaultLanguage}>
      {({ bookPages }) => {
        return <SongStoryPagesPresentation bookPages={bookPages} closeBookAction={closeBookAction} />
      }}
    </SongStoryPagesData>
  )
}
// PROPTYPES
const { array, func, string } = PropTypes
SongStoryPagesContainer.propTypes = {
  bookEntries: array,
  defaultLanguage: string,
  closeBookAction: func,
}

export default SongStoryPagesContainer
