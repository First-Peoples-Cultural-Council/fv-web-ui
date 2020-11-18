import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import FVLabel from 'components/FVLabel'
import '!style-loader!css-loader!./AlphabetCharacters.css'

/**
 * @summary AlphabetCharactersPresentation
 * @version 2.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetCharactersPresentation({
  activeLetter,
  characters = [],
  dialectClassName,
  generateAlphabetCharacterHref,
  letterClicked,
}) {
  const componentHasContent = () => {
    const charactersMarkup = characters.map((value, index) => {
      const currentLetter = value.title
      const href = generateAlphabetCharacterHref(currentLetter)
      return (
        <a
          href={href}
          className={`AlphabetCharactersTile ${activeLetter === currentLetter ? 'AlphabetCharactersTile--active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            letterClicked({ letter: currentLetter, href })
          }}
          key={index}
        >
          {currentLetter}
        </a>
      )
    })
    return charactersMarkup.length > 0 ? (
      <div className={`AlphabetCharactersTiles ${dialectClassName}`}>{charactersMarkup}</div>
    ) : null
  }

  const componentHasNoContent = () => {
    return (
      <Typography className="AlphabetCharacters__noCharacters" variant="caption">
        Characters are unavailable at this time
      </Typography>
    )
  }

  const componentIsLoading = () => {
    return (
      <div className="AlphabetCharacters__loading">
        <CircularProgress className="AlphabetCharacters__loadingSpinner" color="secondary" mode="indeterminate" />
        <Typography className="AlphabetCharacters__loadingText" variant="caption">
          Loading characters
        </Typography>
      </div>
    )
  }
  return (
    <div className="AlphabetCharacters" data-testid="AlphabetCharacters">
      <h2>
        <FVLabel
          transKey="views.pages.explore.dialect.learn.words.find_by_alphabet"
          defaultStr="Browse Alphabetically"
          transform="words"
        />
      </h2>
      {() => {
        if (characters === undefined) {
          return componentIsLoading()
        }
        if (characters.length === 0) {
          return componentHasNoContent()
        }
        return componentHasContent()
      }}
    </div>
  )
}

// PropTypes
const { array, func, string } = PropTypes
AlphabetCharactersPresentation.propTypes = {
  characters: array,
  dialectClassName: string,
  generateAlphabetCharacterHref: func,
  letterClicked: func,
  activeLetter: string,
}
AlphabetCharactersPresentation.defaultProps = {
  letterClicked: () => {},
  fetchCharacters: () => {},
}

export default AlphabetCharactersPresentation
