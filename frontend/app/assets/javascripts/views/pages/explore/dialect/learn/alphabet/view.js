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
import Immutable, { Map } from 'immutable'
import '!style-loader!css-loader!./view.css'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacter, publishCharacter } from 'providers/redux/reducers/fvCharacter'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { deleteWord } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import UIHelpers from 'common/UIHelpers'
import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'

import FVTab from 'views/components/FVTab'
import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation'
import FVLabel from 'views/components/FVLabel/index'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import { WORKSPACES } from 'common/Constants'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'
import LiteralUnicodePresentation from './LiteralUnicode/LiteralUnicodePresentation'
import LiteralUnicodeData from './LiteralUnicode/LiteralUnicodeData'

/**
 * View character entry
 */

const { array, func, object, string } = PropTypes
export class AlphabetView extends Component {
  static propTypes = {
    // REDUX: reducers/state
    computeCharacter: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    deleteWord: func.isRequired,
    fetchCharacter: func.isRequired,
    fetchDialect2: func.isRequired,
    publishCharacter: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  state = {
    deleteDialogOpen: false,
    tabValue: 0,
  }

  // Refetch data on URL change
  async componentDidUpdate(prevProps) {
    const dialectChanged = this.props.routeParams.dialect_path !== prevProps.routeParams.dialect_path
    const wordChanged = this.props.routeParams.word !== prevProps.routeParams.word
    if (dialectChanged || wordChanged) {
      await this.fetchData()
    }
  }

  // Fetch data on initial render
  async componentDidMount() {
    await this.fetchData()
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getCharacterPath(),
        entity: this.props.computeCharacter,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeCharacter = ProviderHelpers.getEntry(this.props.computeCharacter, this._getCharacterPath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const character = selectn('response.title', computeCharacter)

    // Generate photos
    const photosMap = selectn('response.contextParameters.word.related_pictures', computeCharacter) || []
    const photos = photosMap.map((picture, key) => {
      return {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
    })

    // Generate videos
    const videosMap = selectn('response.contextParameters.word.related_videos', computeCharacter) || []
    const videos = videosMap.map((video, key) => {
      return {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
    })

    // Clean character to make it NXQL friendly
    const searchByAlphabetValue = StringHelpers.clean(character, CLEAN_NXQL) || ''

    // Set filter
    const currentAppliedFilter = new Map({
      currentAppliedFilter: new Map({
        startsWith: " AND ( dc:title ILIKE '" + searchByAlphabetValue + "%' )",
      }),
    })

    let pageToolbar = null
    if (this.props.routeParams.area === WORKSPACES) {
      if (selectn('response', computeCharacter)) {
        pageToolbar = (
          <PageToolbar
            label={this.props.intl.trans('character', 'Character', 'first')}
            handleNavigateRequest={this._onNavigateRequest}
            computeEntity={computeCharacter}
            computePermissionEntity={computeDialect2}
            computeLogin={this.props.computeLogin}
            actions={['edit', 'publish']}
            publishChangesAction={this._publishChangesAction}
            {...this.props}
          />
        )
      }
    }

    let relatedWords = null
    if (selectn('response.contextParameters.character.related_words.length', computeCharacter) > 0) {
      const relatedWordsContentMap =
        selectn('response.contextParameters.character.related_words', computeCharacter) || []

      const relatedWordsContent = relatedWordsContentMap.map((word, key) => {
        const wordItem =
          selectn('fv:definitions.length', word) > 0
            ? selectn('fv:definitions', word)
            : selectn('fv:literal_translation', word)

        const hrefPath = NavigationHelpers.navigate(
          '/explore' + selectn('path', word).replace('/Dictionary/', '/learn/words/'),
          null,
          true
        )

        return (
          <SubViewTranslation key={key} group={wordItem} groupByElement="language" groupValue="translation">
            <p>
              <a
                key={selectn('uid', word)}
                href={hrefPath}
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                {selectn('dc:title', word)}
              </a>
            </p>
          </SubViewTranslation>
        )
      })

      relatedWords = (
        <div className="AlphabetViewRowItem">
          <h3>
            <FVLabel transKey="related_words" defaultStr="Related Words" transform="words" />:
          </h3>
          {relatedWordsContent}
        </div>
      )
    }
    const hasMedia = photos.length !== 0 || videos.length !== 0
    /**
     * Generate definitions body
     */
    return (
      <PromiseWrapper computeEntities={computeEntities}>
        {pageToolbar}

        <div className="row">
          <div className="col-xs-12">
            <div>
              <Card>
                <FVTab
                  tabItems={[
                    { label: this.props.intl.trans('definition', 'Definition', 'first') },
                    {
                      label: UIHelpers.isViewSize('xs')
                        ? this.props.intl.trans('words', 'Words', 'first')
                        : this.props.intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.words_starting_with_x',
                            'Words Starting with ' + character,
                            'words',
                            [character]
                          ),
                      id: 'find_words',
                      className: 'fontAboriginalSans',
                    },
                    {
                      label: UIHelpers.isViewSize('xs')
                        ? this.props.intl.trans('phrases', 'Phrases', 'first')
                        : this.props.intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x',
                            'Phrases Starting with ' + character,
                            'words',
                            [character]
                          ),
                      id: 'find_phrases',
                      className: 'fontAboriginalSans',
                    },
                  ]}
                  tabsValue={this.state.tabValue}
                  tabsOnChange={(e, tabValue) => this.setState({ tabValue })}
                />

                {/* TAB: DEFINITION */}
                {this.state.tabValue === 0 && (
                  <Typography component="div">
                    <CardContent>
                      <div className={`${hasMedia ? 'col-xs-8' : ''} fontAboriginalSans`}>
                        <div className="AlphabetViewRow">
                          <div className="AlphabetViewRowItem">
                            <Typography component="h2" variant="h5">
                              {character}
                            </Typography>
                          </div>
                        </div>

                        <div className="AlphabetViewRow">
                          {this._getAudio()}

                          {relatedWords}

                          {character && (
                            <LiteralUnicodeData character={character}>
                              {(literalUnicode) => (
                                <LiteralUnicodePresentation
                                  literalUnicode={literalUnicode}
                                  className="AlphabetViewRowItem"
                                />
                              )}
                            </LiteralUnicodeData>
                          )}
                        </div>
                      </div>

                      {hasMedia && (
                        <div className="col-xs-4">
                          <MediaPanel
                            label={this.props.intl.trans('photo_s', 'Photo(s)', 'first')}
                            type="FVPicture"
                            items={photos}
                          />
                          <MediaPanel
                            label={this.props.intl.trans('video_s', 'Video(s)', 'first')}
                            type="FVVideo"
                            items={videos}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Typography>
                )}

                {/* TAB: WORDS */}
                {this.state.tabValue === 1 && (
                  <Typography component="div" style={{ padding: 8 * 3 }}>
                    <div className="fontAboriginalSans">
                      <CardContent>
                        <h2>
                          <FVLabel
                            transKey="views.pages.explore.dialect.learn.alphabet.words_starting_with_x"
                            defaultStr={'Words Starting with ' + character}
                            transform="words"
                            params={[character]}
                          />
                        </h2>
                        <div className="row">
                          <WordListView
                            filter={currentAppliedFilter}
                            routeParams={this.props.routeParams}
                            disableClickItem={false}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Typography>
                )}

                {this.state.tabValue === 2 && (
                  <Typography component="div" style={{ padding: 8 * 3 }}>
                    <div className="fontAboriginalSans">
                      <CardContent>
                        <h2>
                          <FVLabel
                            transKey="views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x"
                            defaultStr={'Phrases Starting with ' + character}
                            transform="words"
                            params={[character]}
                          />
                        </h2>
                        <div className="row">
                          <PhraseListView
                            dialect={selectn('response', computeDialect2)}
                            filter={currentAppliedFilter}
                            routeParams={this.props.routeParams}
                            disableClickItem={false}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Typography>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  fetchData = async () => {
    await this.props.fetchCharacter(this._getCharacterPath(this.props))
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)
  }
  _getAudio = () => {
    const computeCharacter = ProviderHelpers.getEntry(this.props.computeCharacter, this._getCharacterPath())
    const noAudioMessage =
      selectn('response.contextParameters.character.related_audio.length', computeCharacter) === 0 ? (
        <span>
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.no_audio_yet"
            defaultStr="No audio is available yet"
            transform="first"
          />
          .
        </span>
      ) : null
    const audioPreviewMap = selectn('response.contextParameters.character.related_audio', computeCharacter) || []
    const audioPreview = audioPreviewMap.map((audio) => {
      return <Preview styles={{ maxWidth: '350px' }} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />
    })
    if (audioPreview.length > 0 || noAudioMessage !== null) {
      return (
        <div className="AlphabetViewRowItem">
          <h3>
            <FVLabel transKey="audio" defaultStr="Audio" transform="first" />
          </h3>
          <div>
            {noAudioMessage}
            {audioPreview}
          </div>
        </div>
      )
    }
    return null
  }
  _getCharacterPath = (props = null) => {
    const _props = props === null ? this.props : props

    return `${_props.routeParams.dialect_path}/Alphabet/${_props.routeParams.character}`
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }

  _handleConfirmDelete = (item /*, event*/) => {
    this.props.deleteWord(item.uid)
    this.setState({ deleteDialogOpen: false })
  }

  /**
   * Publish changes
   */
  _publishChangesAction = () => {
    this.props.publishCharacter(
      this._getCharacterPath(),
      null,
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.learn.alphabet.character_published_success',
        'Character published successfully!',
        'first'
      )
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCharacter, fvDialect, navigation, nuxeo, windowPath, locale } = state
  const { properties, route } = navigation
  const { computeCharacter } = fvCharacter
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeCharacter,
    computeDialect2,
    computeLogin,
    properties,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  deleteWord,
  fetchCharacter,
  fetchDialect2,
  publishCharacter,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetView)
