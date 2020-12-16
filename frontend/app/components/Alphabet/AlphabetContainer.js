import React from 'react'
import PropTypes from 'prop-types'
import AlphabetPresentation from 'components/Alphabet/AlphabetPresentation'
import AlphabetPrintPresentation from 'components/Alphabet/AlphabetPrintPresentation'
import AlphabetData from 'components/Alphabet/AlphabetData'

/**
 * @summary AlphabetContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} dialectName
 * @param {boolean} isPrint
 * @returns {node} jsx markup
 */
function AlphabetContainer({ dialectName, isPrint }) {
  return (
    <AlphabetData>
      {({ characters, currentChar, intl, onCharacterClick, onCharacterLinkClick, properties }) => {
        return isPrint ? (
          <AlphabetPrintPresentation characters={characters} dialectName={dialectName} />
        ) : (
          <AlphabetPresentation
            characters={characters}
            currentChar={currentChar}
            dialectName={dialectName}
            intl={intl}
            onCharacterClick={onCharacterClick}
            onCharacterLinkClick={onCharacterLinkClick}
            properties={properties}
          />
        )
      }}
    </AlphabetData>
  )
}
// PROPTYPES
const { bool, string } = PropTypes
AlphabetContainer.propTypes = {
  dialectName: string,
  isPrint: bool,
}

export default AlphabetContainer
