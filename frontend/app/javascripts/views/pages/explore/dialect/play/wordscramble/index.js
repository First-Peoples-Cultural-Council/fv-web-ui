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
import Immutable, { List } from 'immutable'

import { green, red } from '@material-ui/core/colors'
import AVPlayArrow from '@material-ui/icons/PlayArrow'
import AVStop from '@material-ui/icons/Stop'
import FVButton from 'views/components/FVButton'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import IconButton from '@material-ui/core/IconButton'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'

import classNames from 'classnames'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchPhrases } from 'providers/redux/reducers/fvPhrase'

import selectn from 'selectn'
import FVLabel from 'views/components/FVLabel/index'

const containerStyle = {
  background: 'url(/assets/games/fv-games-wordscramble/images/background.png)',
  backgroundSize: 'cover',
  minHeight: '600px',
  padding: '40px 0',
  margin: '0 -15px',
}

const titleStyle = {
  textAlign: 'center',
  color: '#FFF',
  margin: '30px 0',
  textShadow: '1px 1px 1px #000',
}

const titleLogoStyle = {
  display: 'block',
  overflow: 'hidden',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  height: '87px',
  background: 'transparent url(/assets/games/fv-games-wordscramble/images/word_scramble_title.png) 0 0 no-repeat',
  textIndent: '-9000px',
  backgroundSize: 'contain',
  backgroundPosition: 'center center',
  margin: 'auto',
}

/**
 * Play games
 */

const { any, func, object } = PropTypes
export class Wordscramble extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computePhrases: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchPhrases: func.isRequired,
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context)

    this._changeContent = this._changeContent.bind(this)
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.fetchData(this.props, 0)
  }

  _changeContent(pageIndex, pageCount) {
    let nextPage = pageIndex + 1

    if (pageIndex == pageCount - 1) {
      nextPage = 0
    }

    this.fetchData(this.props, nextPage)
  }

  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    props.fetchPhrases(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        //' AND fv-word:available_in_games = 1' +
        '&currentPageIndex=' +
        pageIndex +
        '&pageSize=5' +
        '&sortBy=dc:created' +
        '&sortOrder=DESC'
    )
  }

  /**
   * Render
   */
  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computePhrases,
      },
    ])

    const computePhrases = ProviderHelpers.getEntry(
      this.props.computePhrases,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    return (
      <PromiseWrapper
        renderOnError
        computeEntities={computeEntities}
        className="wordscramble-game"
        style={containerStyle}
      >
        <h1 style={{ ...titleStyle, ...titleLogoStyle }}>Word Scramble</h1>
        <p style={{ textAlign: 'center' }}>
          <a
            href="#"
            onClick={this._changeContent.bind(
              this,
              selectn('response.currentPageIndex', computePhrases),
              selectn('response.pageCount', computePhrases)
            )}
          >
            Load More Words!
          </a>
        </p>
        {(selectn('response.entries', computePhrases) || [])
          .filter((phrase) => selectn('properties.dc:title', phrase).indexOf(' ') > 0)
          .map((phrase, i) => {
            return (
              <Scramble
                key={i}
                sentence={{
                  original: new List(selectn('properties.dc:title', phrase).split(' ')),
                  translation: selectn('properties.fv:definitions[0].translation', phrase),
                  audio: selectn('contextParameters.phrase.related_audio[0].path', phrase),
                  picture: selectn('contextParameters.phrase.related_pictures[0]', phrase),
                }}
              />
            )
          })}
      </PromiseWrapper>
    )
  }
}

/**
 * Word Scramble
 */
export class Scramble extends Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props)
    this.state = this.getDefaultState()
  }
  static propTypes = {
    sentence: any, // TODO: SET PROPTYPE
  }

  /**
   * Get default state (allows for reset)
   */
  getDefaultState() {
    const scrambledSentence = this.props.sentence.original.sortBy(() => Math.random())

    return {
      scrambledSentence: scrambledSentence,
      selected: [],
      complete: false,
      incorrect: false,
      nowPlaying: null,
    }
  }

  /**
   * Reset Scrambled word
   */
  reset() {
    this.setState(this.getDefaultState())
  }

  /**
   * Select a word
   */
  selectWord(word) {
    const selectedWords = [...this.state.selected, word]
    this.setState({ selected: selectedWords, incorrect: false })
  }

  /**
   * Unselect a word
   */
  unSelectWord(word, index) {
    const selectedWords = [...this.state.selected]
    selectedWords.splice(index, 1)
    this.setState({ selected: selectedWords })
  }

  /**
   * Check if answer is correct
   */
  checkAnswer() {
    if (this.state.selected.join(' ') === this.props.sentence.original.toJS().join(' ')) {
      this.setState({ complete: true })
    } else {
      this.setState({ incorrect: true })
    }
  }

  render() {
    let audioIcon
    let audioCallback = null

    const audio = this.props.sentence.audio

    const containerStyles = {
      padding: '10px',
      display: 'block',
      border: '7px solid #040000',
      background: '#fafafa',
      marginBottom: '20px',
      position: 'relative',
      maxWidth: '700px',
      margin: 'auto',
    }

    if (audio) {
      const stateFunc = (state) => {
        this.setState(state)
      }

      audioIcon =
        decodeURIComponent(selectn('src', this.state.nowPlaying)) !== NavigationHelpers.getBaseURL() + audio ? (
          <AVPlayArrow style={{ marginRight: '10px' }} />
        ) : (
          <AVStop style={{ marginRight: '10px' }} />
        )

      audioCallback =
        decodeURIComponent(selectn('src', this.state.nowPlaying)) !== NavigationHelpers.getBaseURL() + audio
          ? UIHelpers.playAudio.bind(this, this.state, stateFunc, NavigationHelpers.getBaseURL() + audio)
          : UIHelpers.stopAudio.bind(this, this.state, stateFunc)
    }

    return (
      <div style={{ marginTop: '15px' }}>
        <div className="scrambled-sentence" style={containerStyles}>
          <div
            style={{
              fontSize: '1.4em',
              padding: '5px',
              lineHeight: '244%',
              fontStyle: 'italic',
              color: '#3f8b53',
            }}
          >
            <img
              style={{ marginRight: '10px' }}
              src={UIHelpers.getThumbnail(this.props.sentence.picture, 'Thumbnail')}
            />{' '}
            {this.props.sentence.translation}{' '}
            {this.state.complete ? <IconButton onClick={audioCallback}>{audioIcon}</IconButton> : ''}
          </div>
          <div style={{ minHeight: '50px', borderBottom: '1px solid #CCC', marginBottom: '16px' }}>
            {this.state.selected.map((word, index) => {
              return (
                <FVButton
                  variant="contained"
                  key={index}
                  style={{ backgroundColor: '#a7fba5' }}
                  onMouseUp={this.unSelectWord.bind(this, word, index)}
                >
                  {word}
                </FVButton>
              )
            })}
            {this.state.complete ? (
              <CheckBoxIcon
                className="material-icons"
                style={{
                  color: green.A200,
                  fontSize: '50px',
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                }}
              />
            ) : (
              false
            )}
            {this.state.incorrect ? (
              <IndeterminateCheckBoxIcon
                className="material-icons"
                style={{
                  color: red[600],
                  fontSize: '50px',
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                }}
              />
            ) : (
              false
            )}
          </div>
          {this.state.scrambledSentence.map((word, index) => {
            let disabled = false

            if (this.state.selected.includes(word)) {
              disabled = true
            }
            return (
              <FVButton
                variant="contained"
                disabled={disabled}
                key={index}
                onMouseUp={this.selectWord.bind(this, word)}
              >
                {word}
              </FVButton>
            )
          })}
          {this.state.complete ? (
            <FVButton variant="contained" color="primary" onMouseUp={this.reset.bind(this)}>
              <FVLabel
                transKey="reset"
                defaultStr="Reset"
                transform="first"
              />
            </FVButton>
          ) : (
            false
          )}
          <FVButton
            variant="contained"
            className={classNames({ invisible: this.state.complete })}
            style={{ margin: '0 5px' }}
            disabled={this.state.complete ? true : false}
            color="secondary"
            onMouseUp={this.checkAnswer.bind(this)}
          >
            <FVLabel
              transKey="check"
              defaultStr="Check"
              transform="first"
            />
          </FVButton>
          {this.state.complete ? (
            false
          ) : (
            <FVButton variant="contained" color="primary" onMouseUp={this.reset.bind(this)}>
              <FVLabel
                transKey="reset"
                defaultStr="Reset"
                transform="first"
              />
            </FVButton>
          )}
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPhrase } = state

  const { computePhrases } = fvPhrase

  return {
    computePhrases,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchPhrases,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wordscramble)
