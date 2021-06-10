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
    this._normalize = this._normalize.bind(this)
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

  /**
   * Do some basic normalizing until confusables are cleaned
   * Replace common types of single quotes, trim
   */
  _normalize(text) {
    if (text !== null) {
      return text.normalize('NFC').replace('’', "'").replace('`', "'").trim()
    }
    return null
  }

  _sortByCharLength() {

  }

  _getCharacterArray(word, characters) {
    if (word === null) {
      return [];
    }
    
    let iterations = 0;
    
    let processedWord = word;
    let customOrderArray = [];

    characters.sort((a, b) => b.title.length - a.title.length);

    while (processedWord.replaceAll("~", "").length > 0 && iterations < 5) {
      characters.map((char) => {
        let firstOccurence = processedWord.indexOf(char.title);
        if (firstOccurence !== -1) {
          customOrderArray[firstOccurence] = char.title;
          processedWord = processedWord.replace(char.title, '~'.repeat(char.title.length))
          return char.customOrder;
        }
      });
      
      ++iterations;
    }
    
    if (iterations === 5) {
      //console.warn("Exhausted iterations. Most likely a character not in the alphabet.");
      return [];
    }

    return customOrderArray;
  }

  /* Fetch list of characters */
  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    // We can fetch all characters since custom_order is done on the FE
    // Adding `AND fv:custom_order IS NOT NULL` will work as soon as all sites are computed
    // We need to filter edge cases where dc:title is null
    props.fetchCharacters(
      props.routeParams.dialect_path + '/Alphabet',
      ' AND dc:title IS NOT NULL' + // AND fv:custom_order IS NOT NULL
        '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )

    // Conditions for words:
    // 1) marked as available in childrens archive
    // 2) all letters have a recognized character in custom order (fv:custom_order NOT LIKE "~")
    // Note: #2 is currently not required since custom order is calculate on FE
    // 3) at least one photo exists
    // 4) at least one audio exists

    props.fetchWords(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1 AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +
        '/* IS NOT NULL AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        '&currentPageIndex=' +
        pageIndex +
        '&pageSize=50&sortBy=dc:created&sortOrder=DESC'
    )
  }

  /**
   * Render
   */
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

    const characterArray = (selectn('response.entries', computeCharacters) || []).map((char) => {
      return this._normalize(selectn('properties.dc:title', char))
    })

    const customOrderValues = (selectn('response.entries', computeCharacters) || []).map((char, index) => {
      const title = this._normalize(selectn('properties.dc:title', char))

      // Get custom order from BE
      //const customOrder = selectn('properties.fv:custom_order', char)

      // Calculate custom order on FE
      const customOrder = String.fromCharCode(32 + index)
      return { customOrder, title }
    })

    const formatWord = (word) => {
      let wordValue = selectn('properties.dc:title', word);
      // Create an array of the characters in the word
      // (done using fv:custom_order to avoid character splitting)
      // let containsCharacterNotInAlphabet = false
      // const customOrderArray = (selectn('properties.fv:custom_order', word) || '').split('')
      // const characters = customOrderArray.map((customOrder) => {
      //   const character = customOrderValues.find((obj) => {
      //     return obj.customOrder === customOrder
      //   })
      //   if (!character?.title) {
      //     containsCharacterNotInAlphabet = true
      //     return null
      //   }
      //   return character.title
      // })
      // // Don't include any words that contain characters not found in the alphabet
      // if (containsCharacterNotInAlphabet) {
      //   return { word: '' }
      // }

      let wordCharArray = this._getCharacterArray(wordValue, customOrderValues).filter((c) => c !== undefined)

      if (wordCharArray.length === 0) {
        return {word: ''}
      }

      return {
        word: wordValue, // Wordsearch requires that the casing of `characters` and `word` match. Using `.join` ensures this
        characters: wordCharArray,
        translation:
          selectn('properties.fv:literal_translation[0].translation', word) ||
          selectn('properties.fv:definitions[0].translation', word),
        audio: word.contextParameters?.word.related_audio[0].path
          ? `${NavigationHelpers.getBaseURL()}${word.contextParameters?.word.related_audio[0].path}?inline=true`
          : '',
        image: word.contextParameters?.word.related_pictures[0].path
          ? `${NavigationHelpers.getBaseURL()}${word.contextParameters?.word.related_pictures[0].path}?inline=true`
          : '',
      }
    }

    const wordArray = (selectn('response.entries', computeWords) || [])
      .map(function wordArrayMap(word) {
        return formatWord(word)
      })
      .filter((v) => v.word.length < 12 && v.word.length > 0)
    if (characterArray?.length < 5 || wordArray?.length < MIN_REQ_WORDS) {
      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          {characterArray?.length < 5 ? (
            <div>Game not available: An alphabet needs to be uploaded to FirstVoices for this game to function.</div>
          ) : (
            <div>
              Game not available: At least 5 words that meet the requirements with audio and an image are required for
              this game.
            </div>
          )}
        </PromiseWrapper>
      )
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          {/*<div className="col-xs-12">
            <pre>{JSON.stringify(characterArray, null, '\t')}</pre>
            <pre>{JSON.stringify(customOrderValues, null, '\t')}</pre>
            <pre>{JSON.stringify(wordArray, null, '\t')}</pre>
          </div>*/}
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
            <GameWrapper characters={[...characterArray]} words={wordArray} />
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
