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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { fetchWords } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import FVLabel from 'views/components/FVLabel/index'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import Game from './wrapper'

/**
 * Play games
 */

const { func, object } = PropTypes
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
    // Fetch fetch data
    this.fetchData(this.props, 0)
  }

  _changeContent(pageIndex, pageCount) {
    let nextPage = pageIndex + 1

    if (pageIndex == pageCount - 1) {
      nextPage = 0
    }

    this.fetchData(this.props, nextPage)
  }

  /**
   * Fetch list of characters
   */
  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    props.fetchCharacters(
      props.routeParams.dialect_path + '/Alphabet',
      '&currentPageIndex=0' + '&pageSize=100' + '&sortOrder=asc' + '&sortBy=fvcharacter:alphabet_order'
    )

    props.fetchWords(
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
        '&pageSize=10' +
        '&sortBy=dc:created' +
        '&sortOrder=DESC'
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

    const alphabet_array = (selectn('response.entries', computeCharacters) || []).map((char) => {
      return selectn('properties.dc:title', char)
    })
    const word_array = (selectn('response.entries', computeWords) || [])
      .map(function wordArrayMap(word) {
        return {
          word: selectn('properties.dc:title', word),
          translation:
            selectn('properties.fv:literal_translation[0].translation', word) ||
            selectn('properties.fv:definitions[0].translation', word),
          audio:
            NavigationHelpers.getBaseURL() +
            selectn('contextParameters.word.related_audio[0].path', word) +
            '?inline=true',
          image:
            NavigationHelpers.getBaseURL() +
            selectn('contextParameters.word.related_pictures[0].path', word) +
            '?inline=true',
        }
      })
      .filter((v) => v.word.length < 12)

    // const word_obj_array = selectn('response.entries', computeWords)

    //Since the alphabet isn't complete, we need fill in the rest
    const character_string = word_array.map((word) => word.word).join('')
    const unique_characters = Array.from(new Set(character_string.split(/(?!$)/u)))

    if (word_array.length > 0) {
      game = <Game characters={[...alphabet_array, ...unique_characters]} words={word_array} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wordsearch)
