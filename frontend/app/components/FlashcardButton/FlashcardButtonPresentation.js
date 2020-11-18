import React from 'react'
import PropTypes from 'prop-types'
import FVButton from 'components/FVButton'
import '!style-loader!css-loader!./FlashcardButton.css'
/**
 * @summary FlashcardButtonPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function FlashcardButtonPresentation({ queryFlashcard, onClickDisable, onClickEnable }) {
  return queryFlashcard ? (
    <FVButton variant="contained" color="primary" className="WordsList__viewModeButton" onClick={onClickDisable}>
      Cancel flashcard view
    </FVButton>
  ) : (
    <FVButton variant="contained" className="WordsList__viewModeButton" onClick={onClickEnable}>
      Flashcard view
    </FVButton>
  )
}
// PROPTYPES
const { func, oneOfType, string, number } = PropTypes
FlashcardButtonPresentation.propTypes = {
  queryFlashcard: oneOfType([string, number]),
  onClickDisable: func,
  onClickEnable: func,
}

export default FlashcardButtonPresentation
