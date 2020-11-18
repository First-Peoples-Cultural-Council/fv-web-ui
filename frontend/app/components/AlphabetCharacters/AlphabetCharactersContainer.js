import React from 'react'
// import PropTypes from 'prop-types'
import AlphabetCharactersPresentation from 'components/AlphabetCharacters/AlphabetCharactersPresentation'
import AlphabetCharactersData from 'components/AlphabetCharacters/AlphabetCharactersData'

/**
 * @summary AlphabetCharactersContainer
 * @version 2.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetCharactersContainer() {
  return (
    <AlphabetCharactersData>
      {({
        activeLetter,
        characters,
        generateAlphabetCharacterHref,
        letterClicked,
        dialectClassName,
        // v2
        // onClick,
        // queryLetter,
      }) => {
        return (
          <AlphabetCharactersPresentation
            activeLetter={activeLetter}
            characters={characters}
            dialectClassName={dialectClassName}
            generateAlphabetCharacterHref={generateAlphabetCharacterHref}
            letterClicked={letterClicked}
          />
        )
      }}
    </AlphabetCharactersData>
  )
}
// PROPTYPES
// const { string } = PropTypes
AlphabetCharactersContainer.propTypes = {
  //   something: string,
}

export default AlphabetCharactersContainer
