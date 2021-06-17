/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

/* eslint-disable */
/* Game libraries
============================================================
Note: using the inline format for expose-loader so we
don't have to configure an entry bundle just for games

https://github.com/webpack-contrib/expose-loader#inline
*/
import pixi from 'expose-loader?exposes[]=PIXI!pixi'
import p2 from 'expose-loader?exposes[]=p2!p2'
// IMPORTANT: Phaser is last
import Phaser from 'expose-loader?exposes[]=Phaser!phaser'
/* END: Game libraries
============================================================ */
/* eslint-enable */

const borderStyle = {
  border: '1px solid #CCC',
}

const spotStyle = {
  display: 'inline-block',
  fontSize: '30px',
  lineHeight: '19px',
  margin: '5px',
  padding: '10px',
  height: '40px',
  minWidth: '40px',
  color: '#35b3ad',
  position: 'relative',
  overflow: 'hidden',
}

/**
 * Play games
 */
export default class ParachuteGame extends Component {
  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context)

    this.audio = React.createRef()

    //Get default start
    this.state = this.getDefaultState()

    //Prebind functions
    this.restart = this.restart.bind(this)
  }

  /**
   * Get Default State
   */
  getDefaultState(props = this.props) {
    return {
      puzzle: this.preparePuzzle(props),
      guessesLeft: 7,
      alphabet: props.alphabet,
      guessedLetters: [],
      succeeded: false,
      failed: false,
      startTime: Date.now(),
    }
  }

  /**
   * Retart with same puzzle
   */
  restart() {
    this.setState(this.getDefaultState())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.puzzle !== this.props.puzzle) {
      this.setState(this.getDefaultState(nextProps))
    }
  }

  /**
   * Prepare puzzle
   * breaks up puzzle into letters
   */
  escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }
  preparePuzzle(props) {
    const puzzle = props.puzzle
    const letters = props.alphabet
    const letterCount = letters.length
    let letterRegexStr = ''

    for (let i = 0; i < letterCount; i++) {
      letterRegexStr += '(' + this.escapeRegExp(letters[i]) + ')|'
    }

    const letterRegex = new RegExp(letterRegexStr, 'g')

    const puzzleParts = puzzle.split(letterRegex).filter((l) => {
      return l !== undefined && l.length !== 0
    })

    let word = []

    const words = []

    puzzleParts.map((letter, index, parts) => {
      if (letter === ' ') {
        words.push(word)
        word = []
      } else {
        word.push({ letter, found: false })
      }
      if (index === parts.length - 1) {
        words.push(word)
      }
    })

    return words
  }

  /**
   * Prepare Alphabet
   */
  prepareAlphabet(props) {
    return props.alphabet.map((letter) => {
      return letter.toUpperCase()
    })
  }

  /**
   * Guess letter
   */
  guessLetter = (letter) => {
    let guessesLeft = this.state.guessesLeft

    const guessedLetters = this.state.guessedLetters

    let succeeded = this.state.succeeded

    if (guessesLeft > 0 && succeeded === false) {
      const puzzle = this.state.puzzle

      if (guessedLetters.indexOf(letter) === -1) {
        guessedLetters.push(letter)

        let letterFound = false

        succeeded = true

        puzzle.forEach((word) => {
          word.forEach((part) => {
            if (part.letter === letter) {
              letterFound = true
              part.found = true
            }
            if (part.found === false) {
              succeeded = false
            }
          })
        })

        if (letterFound === false) {
          guessesLeft = guessesLeft - 1
        }

        let failed = false

        if (guessesLeft <= 0) {
          failed = true
        }

        if (succeeded) {
          this.audio.current.play()
        }
        this.setState({ guessedLetters, puzzle, guessesLeft, succeeded, failed })
      }
    }
  }

  renderKeyboard() {
    const guessedLetters = this.state.guessedLetters

    return (
      <div className="keyboard" style={{ width: '100%', maxWidth: '530px', margin: 'auto' }}>
        {this.state.alphabet.map((letter, index) => {
          let guessed = false

          if (guessedLetters.indexOf(letter) !== -1) {
            guessed = true
          }

          return (
            <Letter
              key={index}
              guessed={guessed}
              letter={letter}
              onClick={() => {
                this.guessLetter(letter)
              }}
            />
          )
        })}
      </div>
    )
  }

  renderSuccess() {
    const timeDiff = (Date.now() - this.state.startTime) / 1000
    const timeToSolve = seconds2time(timeDiff)
    return (
      <div className="success">
        <h3>
          <FVLabel
            transKey="views.pages.explore.dialect.play.parachute.you_win"
            defaultStr="You win!, You solved it in"
          />
          {timeToSolve}
        </h3>
      </div>
    )
  }

  renderFailure() {
    return (
      <div className="failure">
        <h4>
          <FVLabel
            transKey="views.pages.explore.dialect.play.parachute.oh_no"
            defaultStr="Oh no! You're out of guesses. Don't quit now! Try again!"
          />
        </h4>
      </div>
    )
  }

  /**
   * Render
   */
  render() {
    return (
      <div className="parachute-game" style={{ textAlign: 'center' }}>
        <h1>
          <FVLabel
            transKey="views.pages.explore.dialect.play.parachute.parachute"
            defaultStr="Parachute"
            transform="first"
          />
        </h1>

        <div>
          <FVLabel
            transKey="views.pages.explore.dialect.play.parachute.guess_puzzle_to_make_it_to_the_beach"
            defaultStr="Guess the puzzle to make it to the beach"
            transform="first"
          />
        </div>

        <img
          src={`/assets/games/fv-games-parachute/images/${this.state.guessesLeft}.png`}
          style={{ width: '100%', maxWidth: '750px' }}
        />

        <div>
          {this.state.puzzle.map((word, index) => {
            const wordStyle = { display: 'inline-block' }
            if (index !== 0) {
              wordStyle.marginLeft = '50px'
            }
            return (
              <div style={wordStyle} key={index}>
                {word.map((letter, index2) => {
                  return (
                    <div key={index2} className="spot" style={{ ...spotStyle, ...borderStyle }}>
                      <div className="letter">{letter.found ? letter.letter : false}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div>Hint: {this.props.translation} </div>

        <audio style={{ maxWidth: '350px' }} ref={this.audio} src={this.props.audio} controls />

        <div />

        {this.state.succeeded || this.state.failed ? false : this.renderKeyboard()}
        {this.state.succeeded ? this.renderSuccess() : false}
        {this.state.failed ? this.renderFailure() : false}

        <div style={{ margin: '15px 0' }}>
          <FVButton
            variant="contained"
            color="secondary"
            onClick={this.props.newPuzzle}
            style={{ marginRight: '10px' }}
          >
            <FVLabel
              transKey="views.pages.explore.dialect.play.parachute.new_puzzle"
              defaultStr="New Puzzle"
              transform="words"
            />
          </FVButton>
          <FVButton variant="contained" color="primary" onMouseDown={this.restart}>
            <FVLabel
              transKey="views.pages.explore.dialect.play.parachute.restart"
              defaultStr="Restart"
              transform="words"
            />
          </FVButton>
        </div>
      </div>
    )
  }
}

const letterStyle = {
  backgroundColor: 'WhiteSmoke',
  textAlign: 'center',
  fontSize: '25px',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'silver',
  display: 'inline-block',
  padding: '0 15px',
  borderRadius: '5px',
  lineHeight: '45px',
  margin: '5px',
}

const letterHoverStyle = {
  backgroundColor: '#CCCCCC',
  cursor: 'pointer',
}

const guessedStyle = {
  border: '1px solid #000',
  color: '#35b3ad',
  backgroundColor: '#FFFFFF',
}

class Letter extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      hovering: false,
    }

    this.onOver = this.onOver.bind(this)
    this.onOut = this.onOut.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.onClick()
  }

  onOver() {
    this.setState({ hovering: true })
  }

  onOut() {
    this.setState({ hovering: false })
  }

  render() {
    let style = { ...letterStyle }

    let action = false

    if (this.state.hovering) {
      style = { ...style, ...letterHoverStyle }
    }

    if (this.props.guessed === false) {
      action = this.onClick
    } else {
      style = { ...style, ...guessedStyle }
    }

    return (
      <div className="letter" onMouseOver={this.onOver} onMouseOut={this.onOut} onClick={action} style={style}>
        {this.props.letter}
      </div>
    )
  }
}

const seconds2time = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds - hours * 3600) / 60)
  const _seconds = seconds - hours * 3600 - minutes * 60
  let time = ''

  if (hours !== 0) {
    time = hours + ':'
  }
  if (minutes !== 0 || time !== '') {
    minutes = minutes < 10 && time !== '' ? '0' + minutes : String(minutes)
    time += minutes + ':'
  }
  if (time === '') {
    time = _seconds + 's'
  } else {
    time += _seconds < 10 ? '0' + _seconds : String(_seconds)
  }
  return time
}

// PROPTYPES
const { any, bool, func, string } = PropTypes
ParachuteGame.propTypes = {
  puzzle: string,
  translation: any,
  audio: string,
  newPuzzle: func,
}

Letter.propTypes = {
  onClick: func,
  guessed: bool,
  letter: string,
}
