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
import Immutable from 'immutable'
import selectn from 'selectn'
import { connect } from 'react-redux'

// FPCC
import { fetchCharacters } from 'reducers/fvCharacter'
import { fetchWords } from 'reducers/fvWord'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import FVLabel from 'components/FVLabel'
import GameWrapper from 'components/Games/wordsearch/GameWrapper'

const { func, object } = PropTypes

const MIN_REQ_WORDS = 5
export class Wordsearch extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeCharacters: object.isRequired,
    computeWords: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchCharacters: func.isRequired,
    fetchWords: func.isRequired,
  }
  constructor(props, context) {
    super(props, context)

    this._changeContent = this._changeContent.bind(this)
  }
  componentDidMount() {
    this.fetchData(this.props, 0)
  }

  _changeContent(pageIndex, pageCount) {
    let nextPage = pageIndex + 1
    if (pageIndex === pageCount - 1) {
      nextPage = 0
    }
    this.fetchData(this.props, nextPage)
  }

  /* Fetch list of characters */
  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    props.fetchCharacters(
      props.routeParams.dialect_path + '/Alphabet',
      'AND fv:custom_order IS NOT NULL' +
        '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )

    props.fetchWords(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1 AND fv:custom_order IS NOT NULL AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +
        '/* IS NOT NULL AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        '&currentPageIndex=' +
        pageIndex +
        '&pageSize=10&sortBy=dc:created&sortOrder=DESC'
    )
  }

  /**
   * Render
   */
  render() {
    let game = ''

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path + '/Alphabet',
        entity: this.props.computeCharacters,
      },
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeWords,
      },
    ])

    const computeCharacters = ProviderHelpers.getEntry(
      this.props.computeCharacters,
      this.props.routeParams.dialect_path + '/Alphabet'
    )
    const computeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    if (selectn('response.resultsCount', computeWords) < MIN_REQ_WORDS) {
      return (
        <div>
          Game not available: At least 5 words that meet the requirements with audio and an image are required for this
          game... Found <strong>{selectn('response.resultsCount', computeWords)}</strong> words.
        </div>
      )
    }

    if ((selectn('response.entries', computeCharacters) || []).length < 5) {
      return <div>Game not available: An alphabet needs to be uploaded to FirstVoices for this game to function.</div>
    }

    const characterArray = (selectn('response.entries', computeCharacters) || []).map((char) => {
      return selectn('properties.dc:title', char)
    })

    const customOrderValues = (selectn('response.entries', computeCharacters) || []).map((char) => {
      const title = selectn('properties.dc:title', char)
      const customOrder = selectn('properties.fv:custom_order', char)
      return { customOrder, title }
    })

    const wordArray = (selectn('response.entries', computeWords) || [])
      .map(function wordArrayMap(word) {
        // Create array of characters for word
        const customOrderArray = (selectn('properties.fv:custom_order', word) || '').split('')
        const characters = customOrderArray.map((customOrder) => {
          const character = customOrderValues.find((obj) => {
            return obj.customOrder === customOrder
          })
          return character.title
        })

        const audio = word.contextParameters?.word.related_audio[0].path
          ? `${NavigationHelpers.getBaseURL()}${word.contextParameters?.word.related_audio[0].path}?inline=true`
          : ''
        const image = word.contextParameters?.word.related_pictures[0].path
          ? `${NavigationHelpers.getBaseURL()}${word.contextParameters?.word.related_pictures[0].path}?inline=true`
          : ''

        return {
          word: selectn('properties.dc:title', word),
          characters,
          translation:
            selectn('properties.fv:literal_translation[0].translation', word) ||
            selectn('properties.fv:definitions[0].translation', word),
          audio,
          image,
        }
      })
      .filter((v) => v.word.length < 12)

    if (wordArray.length > 0 && characterArray.length > 5) {
      game = <GameWrapper characters={[...characterArray]} words={wordArray} />
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className="col-xs-12" style={{ textAlign: 'center' }}>
            <a
              href="#"
              onClick={this._changeContent.bind(
                this,
                selectn('response.currentPageIndex', computeWords),
                selectn('response.pageCount', computeWords)
              )}
            >
              Load More Words!
            </a>
            {game}
            <small>
              <FVLabel
                transKey="views.pages.explore.dialect.play.archive_contains"
                defaultStr="Archive contains"
                transform="first"
              />
              &nbsp; {selectn('response.resultsCount', computeWords)} &nbsp;
              <FVLabel
                transKey="views.pages.explore.dialect.play.words_that_met_game_requirements"
                defaultStr="words that met game requirements."
              />
            </small>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCharacter, fvWord } = state

  const { computeCharacters } = fvCharacter
  const { computeWords } = fvWord

  return {
    computeCharacters,
    computeWords,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCharacters,
  fetchWords,
}

export default connect(mapStateToProps, mapDispatchToProps)(Wordsearch)
