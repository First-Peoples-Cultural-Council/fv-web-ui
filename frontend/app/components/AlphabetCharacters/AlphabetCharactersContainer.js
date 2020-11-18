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
      {({ characters, dialectClassName, onClick }) => {
        return (
          <AlphabetCharactersPresentation
            characters={characters}
            dialectClassName={dialectClassName}
            onClick={onClick}
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
