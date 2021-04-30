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
import { connect } from 'react-redux'
import selectn from 'selectn'

// FPCC
import { fetchCharacters } from 'reducers/fvCharacter'
import { fetchWords } from 'reducers/fvWord'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import ParachuteGame from 'components/Games/parachute/ParachuteGame'
import PromiseWrapper from 'components/PromiseWrapper'

const PUZZLES = 25
const MIN_REQ_WORDS = 5

const { func, object } = PropTypes
export class Parachute extends Component {
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

    this.state = {
      currentPuzzleIndex: 0,
    }

    this.newPuzzle = this.newPuzzle.bind(this)
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  randomIntBetween(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min)
  }

  //TO DO: Improve the fetch data such that the PageIndex can no longer be the same twice in a row if there are multiple possiblities
  async fetchData(props /*, pageIndex, pageSize, sortOrder, sortBy*/) {
    await props.fetchCharacters(
      props.routeParams.dialect_path + '/Alphabet',
      'AND fv:custom_order IS NOT NULL' +
        '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )
    //First we make a guess about the word results
    await props.fetchWords(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1 AND fv:custom_order IS NOT NULL AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        '&currentPageIndex=' +
        this.randomIntBetween(0, Math.ceil(this.state.resultCount / PUZZLES) || 10) +
        '&pageSize=' +
        PUZZLES
    )

    const queryResult = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    const resultCount = selectn(['response', 'resultsCount'], queryResult)

    if (resultCount / PUZZLES < 10 && this.state.resultCount === undefined) {
      //We refine our intial query/guess based on the first one
      //This should only happen once
      this.setState({ resultCount: resultCount })
      await props.fetchWords(
        props.routeParams.dialect_path + '/Dictionary',
        ' AND fv:available_in_childrens_archive = 1 AND fv:custom_order IS NOT NULL AND ' +
          ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
          '/* IS NOT NULL' +
          '&currentPageIndex=' +
          this.randomIntBetween(0, Math.ceil(resultCount / PUZZLES)) +
          '&pageSize=' +
          PUZZLES
      )
    }
    //Will trigger re-render
  }

  newPuzzle() {
    const computeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    if (this.state.currentPuzzleIndex < (this.state.resultCount % PUZZLES) - 1) {
      this.setState({
        currentPuzzleIndex: this.state.currentPuzzleIndex + 1,
      })
      //This is for when we could potentially run out of words, but we are not sure
    } else if (this.state.currentPuzzleIndex < PUZZLES - 1) {
      if (this.state.resultCount < PUZZLES * (selectn('response.pageIndex', computeWords) + 1)) {
        this.fetchData(this.props)
        this.setState({
          currentPuzzleIndex: 0,
        })
      } else {
        this.setState({
          currentPuzzleIndex: this.state.currentPuzzleIndex + 1,
        })
      }
    } else {
      this.fetchData(this.props)
      this.setState({
        currentPuzzleIndex: 0,
      })
    }
  }

  render() {
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

    const alphabetArray = (selectn('response.entries', computeCharacters) || []).map((char) => {
      const title = selectn('properties.dc:title', char)
      const customOrder = selectn('properties.fv:custom_order', char)
      return { customOrder, title }
    })

    const words = (selectn('response.entries', computeWords) || []).map((word) => {
      const customOrderArray = (selectn('properties.fv:custom_order', word) || '').split('')
      const puzzleParts = customOrderArray.map((customOrder) => {
        const character = alphabetArray.find((obj) => {
          return obj.customOrder === customOrder
        })
        if (!character?.title) {
          return null
        }
        return character.title
      })
      const audio = selectn('contextParameters.word.related_audio[0].path', word)
        ? `${NavigationHelpers.getBaseURL()}${word.contextParameters?.word.related_audio[0].path}?inline=true`
        : ''

      return {
        puzzle: selectn('properties.dc:title', word),
        puzzleParts: puzzleParts,
        translation:
          selectn('properties.fv:literal_translation[0].translation', word) ||
          selectn('properties.fv:definitions[0].translation', word),
        audio: audio,
      }
    })

    if (alphabetArray?.length < 1 || words?.length < 1) {
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="parachute-game" style={{ textAlign: 'center', padding: '10px' }}>
            <h1>Parachute</h1>
            <h3>Game not available</h3>
            {alphabetArray?.length < 5 ? (
              <p>An alphabet needs to be uploaded to FirstVoices for this game to function.</p>
            ) : null}
            {words?.length < MIN_REQ_WORDS ? (
              <p>
                At least 5 words that meet the requirements with audio and an image are required for this game... Found{' '}
                <strong>{selectn('response.resultsCount', computeWords)}</strong> words.
              </p>
            ) : null}
          </div>
        </PromiseWrapper>
      )
    }

    // words[this.state.currentPuzzleIndex].alphabet = alphabetArray

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="parachute-game">
          <ParachuteGame
            newPuzzle={this.newPuzzle}
            alphabet={alphabetArray}
            word={words[this.state.currentPuzzleIndex]}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(Parachute)
