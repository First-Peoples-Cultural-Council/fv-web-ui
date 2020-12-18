import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import FVLabel from 'components/FVLabel'
import './AlphabetCharacters.css'

/**
 * @summary AlphabetCharactersPresentation
 * @version 2.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetCharactersPresentation({ characters, dialectClassName, onClick }) {
  return (
    <div className="AlphabetCharacters" data-testid="AlphabetCharacters">
      <h2>
        <FVLabel
          transKey="views.pages.explore.dialect.learn.words.find_by_alphabet"
          defaultStr="Browse Alphabetically"
          transform="words"
        />
      </h2>
      {characters === undefined && (
        <div className="AlphabetCharacters__loading">
          <CircularProgress className="AlphabetCharacters__loadingSpinner" color="secondary" mode="indeterminate" />
          <Typography className="AlphabetCharacters__loadingText" variant="caption">
            Loading characters
          </Typography>
        </div>
      )}
      {characters.length === 0 && (
        <Typography className="AlphabetCharacters__noCharacters" variant="caption">
          Characters are unavailable at this time
        </Typography>
      )}
      {characters && characters.length > 0 && (
        <div className={`AlphabetCharactersTiles ${dialectClassName}`}>
          {characters.map(({ title, href, isActiveCharacter }, index) => {
            return (
              <a
                href={href}
                className={`AlphabetCharactersTile ${isActiveCharacter ? 'AlphabetCharactersTile--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  onClick(href)
                }}
                key={index}
              >
                {title}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

// PropTypes
const { array, func, string } = PropTypes
AlphabetCharactersPresentation.propTypes = {
  characters: array,
  dialectClassName: string,
  onClick: func,
}
AlphabetCharactersPresentation.defaultProps = {
  onClick: () => {},
  dialectClassName: '',
}

export default AlphabetCharactersPresentation
