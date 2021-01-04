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
import Immutable, { List, Map } from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchWords } from 'reducers/fvWord'

import selectn from 'selectn'

import PromiseWrapper from 'components/PromiseWrapper'
import FVLabel from 'components/FVLabel'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import UIHelpers from 'common/UIHelpers'

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

/**
 * Play games
 */

const { func, object } = PropTypes
export class Picturethis extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeWords: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchWords: func.isRequired,
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedTheme: false,
      selectedWordInPicture: false,
      selectedWordInList: false,
      foundWordKeys: new List(),
      nowPlaying: null,
    }

    this.config = {
      themes: [
        {
          image: 'assets/games/fv-games-picture-this/images/01animals.png',
          name: 'Animals',
          words: Map({
            Bird: {
              locationInt: 0,
              location: { x: 13, y: 59 },
            },
            Word1: {
              locationInt: 1,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 2,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 3,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/02backyard.png',
          name: 'Backyard',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/03bedroom.png',
          name: 'Bedroom',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/04camping.png',
          name: 'Camping',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/05classroom.png',
          name: 'Classroom',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/06feast.png',
          name: 'Feast',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/07garage_sale.png',
          name: 'Garage Sale',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/08kitchen.png',
          name: 'Kitchen',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/09medical_center.png',
          name: 'Medical Center',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/10pow_wow.png',
          name: 'Pow Wow',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/11travel.png',
          name: 'Travel',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
        {
          image: 'assets/games/fv-games-picture-this/images/12village.png',
          name: 'Village',
          words: Map({
            Word1: {
              locationInt: 0,
              location: { x: 100, y: 59 },
            },
            Word2: {
              locationInt: 1,
              location: { x: 200, y: 59 },
            },
            Word3: {
              locationInt: 2,
              location: { x: 300, y: 59 },
            },
          }),
        },
      ],
    }
  }

  fetchData(props, theme) {
    if (theme.words.size > 0) {
      const lowerCaseKeys = theme.words.map((v, k) => k.toLowerCase())
      const wordKeys = theme.words.keySeq().concat(lowerCaseKeys)

      // eslint-disable-next-line
      const translationsJoin = wordKeys.join(',').replace(/\,/g, "','")

      props.fetchWords(
        props.routeParams.dialect_path + '/Dictionary',
        //' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +'/* IS NOT NULL' +
        //' AND fv-word:available_in_games = 1' +
        " AND fv:literal_translation/*/translation IN ('" +
          translationsJoin +
          "')" +
          '&sortBy=dc:title' +
          '&sortOrder=ASC'
      )
    }
  }

  /**
   * Select Theme
   */
  selectTheme(theme) {
    window.scrollTo(0, 0) //@todo remove this, / find a better way

    this.resetTheme(theme)

    this.setState({
      selectedTheme: theme,
    })

    this.fetchData(this.props, theme)
  }

  resetTheme(/*theme*/) {
    this.setState({ foundWordKeys: new List(), selectedWordInList: false })
  }

  renderThemeList() {
    const imageTileStyle = {
      border: '1px solid #666',
      borderRadius: '16px',
      boxShadow: '1px 1px 1px #666',
    }

    return (
      <div className="picturethis-game">
        <div className="flex-container">
          <div className="grid">
            {this.config.themes.map((theme, index) => {
              return (
                <div
                  key={index}
                  className="cell"
                  style={{ cursor: 'pointer' }}
                  onMouseUp={this.selectTheme.bind(this, theme)}
                >
                  <img className="responsive-image" src={`${theme.image}`} style={imageTileStyle} />
                  <div style={{ fontSize: '22px', textAlign: 'center' }}>{theme.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  selectWordOrMatch(word, inPicture) {
    if (this.state.selectedWordInPicture === false && inPicture) {
      this.setState({ selectedWordInPicture: word }, this.checkMatch.bind(this))
    } else if (this.state.selectedWordInList === false && inPicture === false) {
      this.setState({ selectedWordInList: word }, this.checkMatch.bind(this))
    }
  }

  checkMatch() {
    const wordInList = this.state.selectedWordInList
    const wordInPicture = this.state.selectedWordInPicture

    if (wordInList !== false && wordInPicture !== false) {
      if (selectn('locationInt', wordInPicture) === selectn('locationInt', wordInList) && wordInPicture !== undefined) {
        if (selectn('audio', wordInList)) {
          UIHelpers.playAudio(
            this.state,
            function playAudioSetState(state) {
              this.setState(state)
            }.bind(this),
            NavigationHelpers.getBaseURL() + selectn('audio', wordInList)
          )
        }

        this.setState({
          selectedWordInList: false,
          selectedWordInPicture: false,
          foundWordKeys: this.state.foundWordKeys.push(
            this.state.selectedTheme.name + '-' + selectn('locationInt', wordInList)
          ),
        })
      } else {
        this.setState({ selectedWordInList: false, selectedWordInPicture: false })
      }
    }
  }

  renderGame(words) {
    let warning = ''
    let remoteWords = new Map()

    // Merge remote words with state words
    ;(selectn('response.entries', words) || []).map(
      function wordsData(word /*, wordKey*/) {
        const literal_translation = selectn('properties.fv:literal_translation', word)

        literal_translation.map(
          function literalTranslation(v) {
            // Convert to title case (e.g. bird -> Bird)
            const translationTitleCase = StringHelpers.toTitleCase(selectn('translation', v))

            // Only add to words if exists in theme words
            if (this.state.selectedTheme.words.has(translationTitleCase)) {
              remoteWords = remoteWords.set(
                translationTitleCase,
                Object.assign({}, this.state.selectedTheme.words.get(translationTitleCase) || {}, {
                  word: selectn('properties.dc:title', word),
                  translation: v,
                  audio: selectn('contextParameters.word.related_audio[0].path', word),
                })
              )
            }
          }.bind(this)
        )
      }.bind(this)
    )

    if (remoteWords.size != this.state.selectedTheme.words.size) {
      warning = this.props.intl.trans(
        'views.pages.explore.dialect.play.picture_this.warning',
        'Note: This archive does not contain all of the words required for this game. Placeholders will be used.'
      )
    }

    // Combine the two lists
    remoteWords = this.state.selectedTheme.words.concat(remoteWords)

    // const defaultAssetsPath = 'assets/games/picturethis/assets'
    const theme = this.state.selectedTheme

    const tableCellStyle = {
      display: 'inline-block',
      width: '25%',
      padding: '10px',
    }

    const tableStyle = {
      width: '700px',
      margin: '20px 0',
      border: ' 1px solid #000',
      borderRadius: '12px',
    }

    const tableHeader = {
      background: '#CCC',
      borderRadius: '10px 11px 0 0',
      borderBottom: '2px solid #000',
      fontSize: '17px',
      fontWeight: 'bold',
    }

    const locationNumberStyle = {
      borderRadius: '30px',
      display: 'inline-block',
      width: '37px',
      height: '37px',
      lineHeight: '36px',
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
      border: '1px solid #00bcd4',
      boxShadow: '0 0 1px #555',
      color: '#000',
    }

    const unknownLocation = {
      position: 'absolute',
      width: '37px',
      height: '37px',
      lineHeight: '37px',
      border: '1px solid #FFF',
      boxShadow: '0 0 1px #555',
      background: '#FFF',
      borderRadius: '20px',
      cursor: 'pointer',
    }

    const foundLocation = {
      background: 'rgb(9, 189, 64)',
      transition: 'background-color 900ms linear',
      border: '1px solid #FFFFFF',
      color: '#FFFFFF',
    }

    const highlightLocation = {
      border: '2px solid #000000',
      background: '#00bcd4',
    }

    return (
      <div className="game">
        <h2>{theme.name}</h2>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            className="responsive-image"
            style={{ borderRadius: '30px', border: '1px solid #000' }}
            src={`${theme.image}`}
          />
          {remoteWords.map((word) => {
            let highlight = {}

            if (selectn('locationInt', this.state.selectedWordInPicture) === selectn('locationInt', word)) {
              highlight = highlightLocation
            }
            let dot = false

            if (this.state.foundWordKeys.includes(theme.name + '-' + selectn('locationInt', word))) {
              dot = (
                <div
                  style={{
                    ...unknownLocation,
                    ...locationNumberStyle,
                    ...foundLocation,
                    top: selectn('location.y', word) + 'px',
                    left: selectn('location.x', word) + 'px',
                  }}
                  onMouseUp={this.selectWordOrMatch.bind(this, word, true)}
                >
                  {word.locationInt + 1}
                </div>
              )
            } else {
              dot = (
                <div
                  style={{
                    ...unknownLocation,
                    ...highlight,
                    top: selectn('location.y', word) + 'px',
                    left: selectn('location.x', word) + 'px',
                  }}
                  onMouseUp={this.selectWordOrMatch.bind(this, word, true)}
                />
              )
            }

            return <div key={word.locationInt}>{dot}</div>
          })}
        </div>
        <div style={tableStyle}>
          <div style={tableHeader}>
            <div style={tableCellStyle}>
              <FVLabel transKey="location" defaultStr="Location" transform="first" />
            </div>
            <div style={tableCellStyle}>
              <FVLabel transKey="word" defaultStr="Word" transform="first" />
            </div>
            <div style={tableCellStyle}>
              <FVLabel transKey="translation" defaultStr="Translation" transform="first" />
            </div>
            <div style={tableCellStyle}>
              <FVLabel transKey="audio" defaultStr="Audio" transform="first" />
            </div>
          </div>
          {remoteWords.map((word, key) => {
            let dotStyle = locationNumberStyle

            let dotAction = false

            if (!this.state.foundWordKeys.includes(theme.name + '-' + selectn('locationInt', word))) {
              dotAction = this.selectWordOrMatch.bind(this, word, false)
            } else {
              dotStyle = { ...dotStyle, ...foundLocation }
            }

            if (selectn('locationInt', this.state.selectedWordInList) === selectn('locationInt', word)) {
              dotStyle = { ...locationNumberStyle, ...highlightLocation }
            }

            return (
              <div key={word.locationInt}>
                <div style={tableCellStyle}>
                  <div style={dotStyle} onMouseUp={dotAction}>
                    {word.locationInt + 1}
                  </div>
                </div>
                <div style={tableCellStyle}>{word.word || key}</div>
                <div style={tableCellStyle}>{selectn('translation.translation', word) || key}</div>
                <div style={tableCellStyle}>
                  {word.audio ? (
                    <audio controls style={{ verticalAlign: 'middle' }}>
                      <source src={NavigationHelpers.getBaseURL() + word.audio} type="audio/mpeg" />
                    </audio>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <small>{warning}</small>
        </div>
      </div>
    )
  }

  /**
   * Render
   */
  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeWords,
      },
    ])

    const computeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-7', 'col-md-offset-1')}>
            {this.state.selectedTheme === false ? false : this.renderGame(computeWords)}
          </div>

          <div
            className={classNames('col-xs-12', {
              'col-md-12': !this.state.selectedTheme,
              'col-md-4': this.state.selectedTheme,
            })}
          >
            {this.renderThemeList()}
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvWord, locale } = state

  const { computeWords } = fvWord
  const { intlService } = locale

  return {
    computeWords,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchWords,
}

export default connect(mapStateToProps, mapDispatchToProps)(Picturethis)
