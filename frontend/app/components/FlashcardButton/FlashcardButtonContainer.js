import React from 'react'
import FlashcardButtonPresentation from 'components/FlashcardButton/FlashcardButtonPresentation'
import FlashcardButtonData from 'components/FlashcardButton/FlashcardButtonData'

/**
 * @summary FlashcardButtonContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function FlashcardButtonContainer() {
  return (
    <FlashcardButtonData>
      {({ queryFlashcard, onClickDisable, onClickEnable }) => {
        return (
          <FlashcardButtonPresentation
            queryFlashcard={queryFlashcard}
            onClickDisable={onClickDisable}
            onClickEnable={onClickEnable}
          />
        )
      }}
    </FlashcardButtonData>
  )
}

export default FlashcardButtonContainer
