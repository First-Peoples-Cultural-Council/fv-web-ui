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
import { fetchResources } from 'providers/redux/reducers/fvResources'
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

export class Jigsaw extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeResources: object.isRequired,
    computeWords: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchResources: func.isRequired,
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
    this.fetchData(this.props, 0)
  }

  _changeContent(pageIndex, pageCount) {
    let nextPage = pageIndex + 1

    if (pageIndex === pageCount - 1) {
      nextPage = 0
    }

    this.fetchData(this.props, nextPage)
  }

  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    props.fetchWords(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        '&currentPageIndex=' +
        pageIndex +
        '&pageSize=4' +
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
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeWords,
      },
    ])

    const _computeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    let words = (selectn('response.entries', _computeWords) || []).map((word) => {
      return {
        word: selectn('properties.dc:title', word),
        translation:
          selectn('properties.fv:literal_translation[0].translation', word) ||
          selectn('properties.fv:definitions[0].translation', word),
        audio:
          NavigationHelpers.getBaseURL() +
          selectn('contextParameters.word.related_audio[0].path', word) +
          '?inline=true',
        picture:
          NavigationHelpers.getBaseURL() +
          selectn('contextParameters.word.related_pictures[0].path', word) +
          '?inline=true',
      }
    })

    if (selectn('success', _computeWords)) {
      // If no words found, use placeholders.
      if (words.length === 0) {
        words = [
          {
            word: 'Bear',
            translation: 'Bear',
            audio: 'assets/games/fv-games-jigsaw/sounds/sample.mp3',
            picture: 'assets/games/fv-games-jigsaw/images/picture1.jpg',
          },
          {
            word: 'Totem',
            translation: 'Totem',
            audio: 'assets/games/fv-games-jigsaw/sounds/sample.mp3',
            picture: 'assets/games/fv-games-jigsaw/images/picture2.jpg',
          },
          {
            word: 'Fish',
            translation: 'Fish',
            audio: 'assets/games/fv-games-jigsaw/sounds/sample.mp3',
            picture: 'assets/games/fv-games-jigsaw/images/picture3.jpg',
          },
          {
            word: 'Fire',
            translation: 'Fire',
            audio: 'assets/games/fv-games-jigsaw/sounds/sample.mp3',
            picture: 'assets/games/fv-games-jigsaw/images/picture4.jpg',
          },
        ]
      }

      game = <Game words={words} />
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div className="col-xs-12" style={{ textAlign: 'center' }}>
            <a
              href="#"
              onClick={this._changeContent.bind(
                this,
                selectn('response.currentPageIndex', _computeWords),
                selectn('response.pageCount', _computeWords)
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
              &nbsp; {selectn('response.resultsCount', _computeWords)} &nbsp;
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
  const { fvResources, fvWord } = state

  const { computeResources } = fvResources
  const { computeWords } = fvWord

  return {
    computeResources,
    computeWords,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
  fetchWords,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Jigsaw)
