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
 * @param {object} dialect expects the following object "{ compute: computeDialect2, update: updateDialect2 }"
 *
 * @returns {node} jsx markup
 */
function AlphabetContainer({ dialect, isPrint }) {
  return (
    <AlphabetData dialect={dialect}>
      {({
        characters,
        currentChar,
        dialectName,
        intl,
        isSections,
        onCharacterClick,
        onCharacterLinkClick,
        properties,
      }) => {
        return isPrint ? (
          <AlphabetPrintPresentation characters={characters} dialectName={dialectName} />
        ) : (
          <AlphabetPresentation
            characters={characters}
            currentChar={currentChar}
            dialect={dialect}
            dialectName={dialectName}
            intl={intl}
            isSections={isSections}
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
const { bool, object } = PropTypes
AlphabetContainer.propTypes = {
  dialect: object,
  isPrint: bool,
}

export default AlphabetContainer
