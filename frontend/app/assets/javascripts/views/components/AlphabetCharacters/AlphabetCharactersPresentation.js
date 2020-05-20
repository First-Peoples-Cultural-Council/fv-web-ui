import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import FVLabel from '../FVLabel/index'
import '!style-loader!css-loader!./AlphabetCharacters.css'

export class AlphabetCharactersPresentation extends Component {
  render() {
    let content = null
    if (this.props.characters === undefined) {
      content = this.componentIsLoading()
    } else {
      if (this.props.characters.length === 0) {
        content = this.componentHasNoContent()
      } else {
        content = this.componentHasContent()
      }
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
        {content}
      </div>
    )
  }

  componentHasContent = () => {
    const { characters = [], generateAlphabetCharacterHref } = this.props
    const { activeLetter } = this.props
    const charactersMarkup = characters.map((value, index) => {
      const currentLetter = value.title
      const href = generateAlphabetCharacterHref(currentLetter)
      return (
        <a
          href={href}
          className={`AlphabetCharactersTile ${activeLetter === currentLetter ? 'AlphabetCharactersTile--active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            this.props.letterClicked({ letter: currentLetter, href })
          }}
          key={index}
        >
          {currentLetter}
        </a>
      )
    })
    let content = null
    if (charactersMarkup.length > 0) {
      content = <div className={`AlphabetCharactersTiles ${this.props.dialectClassName}`}>{charactersMarkup}</div>
    }
    return content
  }

  componentHasNoContent = () => {
    return (
      <Typography className="AlphabetCharacters__noCharacters" variant="caption">
        Characters are unavailable at this time
      </Typography>
    )
  }

  componentIsLoading = () => {
    return (
      <div className="AlphabetCharacters__loading">
        <CircularProgress className="AlphabetCharacters__loadingSpinner" color="secondary" mode="indeterminate" />
        <Typography className="AlphabetCharacters__loadingText" variant="caption">
          Loading characters
        </Typography>
      </div>
    )
  }
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
