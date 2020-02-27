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
import {
  askToDisableWord,
  askToEnableWord,
  askToPublishWord,
  askToUnpublishWord,
  enableWord,
  disableWord,
  deleteWord,
  fetchWord,
  publishWord,
  unpublishWord,
} from 'providers/redux/reducers/fvWord'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import Tab from '@material-ui/core/Tab'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'

import withActions from 'views/hoc/view/with-actions'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * View word entry
 */

const { array, func, object, string } = PropTypes
export class DialectViewWord extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeDeleteWord: object.isRequired,
    computeLogin: object.isRequired,
    computeWord: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    askToDisableWord: func.isRequired,
    askToEnableWord: func.isRequired,
    askToPublishWord: func.isRequired,
    askToUnpublishWord: func.isRequired,
    changeTitleParams: func.isRequired,
    enableWord: func.isRequired,
    disableWord: func.isRequired,
    deleteWord: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchWord: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    publishWord: func.isRequired,
    pushWindowPath: func.isRequired,
    unpublishWord: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      computeWord: undefined,
      computeDialect2: undefined,
      computeEntities: undefined,
    }
  }

  async fetchData(newProps) {
    await newProps.fetchWord(this._getWordPath(newProps))
    await newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps)
    } else if (nextProps.routeParams.word !== this.props.routeParams.word) {
      this.fetchData(nextProps)
    }
    // else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
    //     this.fetchData(nextProps);
    // }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps /*, prevState*/) {
    const word = selectn('response', ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath()))
    const title = selectn('properties.dc:title', word)
    const uid = selectn('uid', word)
    if (title && selectn('pageTitleParams.word', this.props.properties) != title) {
      this.props.changeTitleParams({ word: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.word' })
    }

    const _state = {}
    if (prevProps.computeWord !== this.props.computeWord) {
      _state.computeWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath())
    }
    if (prevProps.computeDialect2 !== this.props.computeDialect2) {
      _state.computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    }
    if (prevProps.computeWord !== this.props.computeWord || prevProps.computeDialect2 !== this.props.computeDialect2) {
      _state.computeEntities = Immutable.fromJS([
        {
          id: this._getWordPath(),
          entity: this.props.computeWord,
        },
        {
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        },
      ])
    }

    if (_state.computeWord || _state.computeDialect2 || _state.computeEntities) {
      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState(_state)
    }
  }

  render() {
    const { computeEntities, computeWord, computeDialect2 } = this.state
    const dialectClassName = getDialectClassname(computeDialect2)
    const title = selectn('response.title', computeWord)

    /**
     * Generate definitions body
     */
    return (
      <DetailsViewWithActions
        labels={{ single: 'word' }}
        itemPath={this._getWordPath()}
        actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
        publishAction={this.props.publishWord}
        unpublishAction={this.props.unpublishWord}
        askToPublishAction={this.props.askToPublishWord}
        askToUnpublishAction={this.props.askToUnpublishWord}
        enableAction={this.props.enableWord}
        askToEnableAction={this.props.askToEnableWord}
        disableAction={this.props.disableWord}
        askToDisableAction={this.props.askToDisableWord}
        deleteAction={this.props.deleteWord}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computeWord}
        permissionEntry={computeDialect2}
        tabs={this._getTabs(computeWord)}
        computeEntities={computeEntities || Immutable.List()}
        {...this.props}
      >
        <div className="DialectViewWordPhrase" id="contentMain">
          <div className="DialectViewWordPhraseGroup">
            <div className="DialectViewWordPhraseContentPrimary">
              <div className="DialectViewWordPhraseTitleAudio">
                <h2 className={`DialectViewWordPhraseTitle ${dialectClassName}`}>
                  {title} {this._getAudio(computeWord)}
                </h2>
              </div>
              {this._getDefinitions(computeWord)}
              {this._getPhrases(computeWord)}
              {this._getCulturalNotes(computeWord)}
              {this._getLiteralTranslations(computeWord)}
              {this._getPronounciation(computeWord, computeDialect2)}
            </div>

            <aside className="DialectViewWordPhraseContentSecondary">
              {this._getPhotos(computeWord)}
              {this._getVideos(computeWord)}
              {this._getCategories(computeWord)}
              {this._getPartsOfSpeech(computeWord)}
              {this._getAcknowledgement(computeWord)}

              {/* <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseAdditionalInformation">
                <h4 className="DialectViewWordPhraseContentItemTitle">X Additional information</h4>
                <button>X Show additional information</button>
              </div> */}

              {/* METADATA PANEL */}
              {this._getMetadataPanel(computeWord)}
            </aside>
          </div>
        </div>
      </DetailsViewWithActions>
    )
  }
  _getMetadataPanel = (computeWord) => {
    return selectn('response', computeWord) ? (
      <MetadataPanel properties={this.props.properties} computeEntity={computeWord} />
    ) : null
  }
  _getAcknowledgement = (computeWord) => {
    const acknowledgement = selectn('response.properties.fv-word:acknowledgement', computeWord)
    if (acknowledgement && acknowledgement !== '') {
      return (
        <div className="DialectViewWordPhraseContentItem">
          <h4 className="DialectViewWordPhraseContentItemTitle">
            {intl.trans('acknowledgement', 'Acknowledgement', 'first')}
          </h4>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div>{acknowledgement}</div>
          </div>
        </div>
      )
    }
    return null
  }

  _getAudio = (computeWord) => {
    const audios = []
    ;(selectn('response.contextParameters.word.related_audio', computeWord) || []).map((audio) => {
      audios.push(
        <Preview
          key={selectn('uid', audio)}
          expandedValue={audio}
          optimal
          type="FVAudio"
          styles={{ padding: 0, display: 'inline' }}
        />
      )
    })
    return audios.length > 0 ? (
      <div data-testid="DialectViewWordPhraseAudio" className="DialectViewWordPhraseAudio">
        {audios}
      </div>
    ) : null
  }

  _getCategories = (computeWord) => {
    const _cat = selectn('response.contextParameters.word.categories', computeWord) || []
    const categories = _cat.map((category, key) => {
      return <li key={key}>{selectn('dc:title', category)}</li>
    })
    return categories.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCategory">
        <h4 className="DialectViewWordPhraseContentItemTitle">{intl.trans('categories', 'Categories', 'first')}</h4>
        <ul>{categories}</ul>
      </div>
    ) : null
  }

  _getCulturalNotes = (computeWord) => {
    const _cultNote = selectn('response.properties.fv:cultural_note', computeWord) || []
    const culturalNotes = _cultNote.map((culturalNote, key) => {
      return <div key={key}>{intl.searchAndReplace(culturalNote)}</div>
    })
    return culturalNotes.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCulturalNote">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          {intl.trans('views.pages.explore.dialect.learn.words.cultural_notes', 'Cultural Notes', 'first')}
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{culturalNotes}</div>
      </div>
    ) : null
  }

  _getDefinitions = (computeWord) => {
    const definitions = selectn('response.properties.fv:definitions', computeWord)

    let _definitions = []
    if (definitions) {
      const groupedDefinitions = this._groupBy(definitions)

      for (const property in groupedDefinitions) {
        if (groupedDefinitions.hasOwnProperty(property)) {
          const definition = groupedDefinitions[property]
          _definitions = definition.map((entry, index) => {
            return (
              <div key={index} className="DialectViewWordPhraseDefinitionSet">
                <h4 className="DialectViewWordPhraseDefinitionLanguage">{entry.language}</h4>
                <p className="DialectViewWordPhraseDefinitionEntry">{entry.translation}</p>
              </div>
            )
          })
        }
      }
    }
    return _definitions.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseDefinition">
        <div className="DialectViewWordPhraseContentItemGroup">{_definitions}</div>
      </div>
    ) : null
  }

  _getLiteralTranslations = (computeWord) => {
    const literalTranslations = selectn('response.properties.fv:literal_translation', computeWord)
    let _literalTranslations = []
    if (literalTranslations) {
      const groupedLiteralTranslations = this._groupBy(literalTranslations)

      for (const property in groupedLiteralTranslations) {
        if (groupedLiteralTranslations.hasOwnProperty(property)) {
          const literalTranslation = groupedLiteralTranslations[property]
          _literalTranslations = literalTranslation.map((entry, index) => {
            return (
              <div key={index} className="DialectViewWordPhraseLiteralTranslationSet">
                <h4 className="DialectViewWordPhraseLiteralTranslationLanguage">{entry.language}</h4>
                <p className="DialectViewWordPhraseLiteralTranslationEntry">{entry.translation}</p>
              </div>
            )
          })
        }
      }
    }
    return _literalTranslations.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseLiteralTranslation">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          {intl.trans('views.pages.explore.dialect.learn.words.literal_translations', 'Literal Translations', 'first')}
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{_literalTranslations}</div>
      </div>
    ) : null
  }

  _getPartsOfSpeech = (computeWord) => {
    const partOfSpeech = selectn('response.contextParameters.word.part_of_speech', computeWord)

    if (partOfSpeech) {
      return (
        <div className="DialectViewWordPhraseContentItem">
          <h4 className="DialectViewWordPhraseContentItemTitle">
            {intl.trans('part_of_speech', 'Part of Speech', 'first')}
          </h4>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div>{partOfSpeech}</div>
          </div>
        </div>
      )
    }
  }

  _getPhotos = (computeWord) => {
    const photos = []
    ;(selectn('response.contextParameters.word.related_pictures', computeWord) || []).map((picture, key) => {
      const image = {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
      photos.push(image)
    })

    return photos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhoto">
        <h4 className="DialectViewWordPhraseContentItemTitle">{intl.trans('photo_s', 'PHOTO(S)', 'first')}</h4>
        <MediaPanel type="FVPicture" items={photos} />
      </div>
    ) : null
  }

  _getPhrases = (computeWord) => {
    const phrases = []
    const siteTheme = this.props.routeParams.siteTheme
    ;(selectn('response.contextParameters.word.related_phrases', computeWord) || []).map((phrase, key) => {
      const phraseDefinitions = selectn('fv:definitions', phrase)
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')
      const phraseLink = (
        <a
          key={selectn('uid', phrase)}
          href={hrefPath}
          onClick={(e) => {
            e.preventDefault()
            NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
          }}
        >
          {selectn('dc:title', phrase)}
        </a>
      )

      if (phraseDefinitions.length === 0) {
        phrases.push(<p key={key}>{phraseLink}</p>)
      } else {
        phrases.push(
          <div key={key}>
            <p>
              {phraseLink}
              {phraseDefinitions.map((groupValue, innerKey) => {
                return (
                  <span key={innerKey} className="DialectViewRelatedPhrasesDefinition">
                    {groupValue.translation}
                  </span>
                )
              })}
            </p>
          </div>
        )
      }
    })
    return phrases.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          {intl.trans('related_phrases', 'Related Phrases', 'first')}
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{phrases}</div>
      </div>
    ) : null
  }

  _getPronounciation = (computeWord, computeDialect2) => {
    const pronunciation = selectn('response.properties.fv-word:pronunciation', computeWord)
    if (pronunciation && pronunciation !== '') {
      const dialectClassName = getDialectClassname(computeDialect2)
      return (
        <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePronounciation">
          <h3 className="DialectViewWordPhraseContentItemTitle">
            {intl.trans('pronunciation', 'Pronunciation', 'first')}
          </h3>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div className={dialectClassName}>{pronunciation}</div>
          </div>
        </div>
      )
    }
    return null
  }

  _getTabs = (computeWord) => {
    const tabs = []

    // Photos
    const photosThumbnails = []
    ;(selectn('response.contextParameters.word.related_pictures', computeWord) || []).map((picture) => {
      photosThumbnails.push(
        <img
          key={picture.uid}
          src={selectn('views[0].url', picture) || 'assets/images/cover.png'}
          alt={selectn('title', picture)}
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (photosThumbnails.length > 0) {
      tabs.push(
        <Tab key="pictures" label={intl.trans('pictures', 'Pictures', 'first')}>
          <div style={{ maxHeight: '400px' }}>{photosThumbnails}</div>
        </Tab>
      )
    }

    // Videos
    const videoThumbnails = []
    ;(selectn('response.contextParameters.word.related_videos', computeWord) || []).map((video) => {
      videoThumbnails.push(
        <video
          key={video.uid}
          src={NavigationHelpers.getBaseURL() + video.path}
          controls
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (videoThumbnails.length > 0) {
      tabs.push(
        <Tab key="videos" label={intl.trans('videos', 'Videos', 'first')}>
          <div>{videoThumbnails}</div>
        </Tab>
      )
    }

    // Audio
    const audios = []
    ;(selectn('response.contextParameters.word.related_audio', computeWord) || []).map((audio) => {
      audios.push(<Preview key={selectn('uid', audio)} expandedValue={audio} minimal type="FVAudio" />)
    })
    if (audios.length > 0) {
      tabs.push(
        <Tab key="audio" label={intl.trans('audio', 'Audio', 'first')}>
          <div>{audios}</div>
        </Tab>
      )
    }

    // Phrases
    const phrases = []
    const siteTheme = this.props.routeParams.siteTheme
    ;(selectn('response.contextParameters.word.related_phrases', computeWord) || []).map((phrase, key) => {
      const phraseDefinitions = selectn('fv:definitions', phrase)
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')
      const phraseLink = (
        // <Link key={selectn('uid', phrase)} href={NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')}>
        //   {selectn('dc:title', phrase)}
        // </Link>
        <a
          key={selectn('uid', phrase)}
          href={hrefPath}
          onClick={(e) => {
            e.preventDefault()
            NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
          }}
        >
          COPY
        </a>
      )
      if (phraseDefinitions.length === 0) {
        phrases.push(<p key={key}>{phraseLink}</p>)
      } else {
        phrases.push(
          <div key={key}>
            <p>{phraseLink}</p>{' '}
            <ul>
              {phraseDefinitions.map((groupValue, innerKey) => {
                return (
                  <li key={innerKey}>
                    {groupValue.translation} ({groupValue.language})
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }
    })
    if (phrases.length > 0) {
      tabs.push(
        <Tab key="phrases" label={intl.trans('phrases', 'Phrases', 'first')}>
          <div>{phrases}</div>
        </Tab>
      )
    }

    return tabs
  }

  _getVideos = (computeWord) => {
    const videos = []
    ;(selectn('response.contextParameters.word.related_videos', computeWord) || []).map((video, key) => {
      const vid = {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
      videos.push(vid)
    })
    return videos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseVideo">
        <h4 className="DialectViewWordPhraseContentItemTitle">{intl.trans('video_s', 'VIDEO(S)', 'first')}</h4>
        <MediaPanel type="FVVideo" items={videos} />
      </div>
    ) : null
  }

  _getWordPath = (props = this.props) => {
    if (StringHelpers.isUUID(props.routeParams.word)) {
      return props.routeParams.word
    }
    return props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(props.routeParams.word)
  }

  // Thanks: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby
  _groupBy = (arrOfObj, property = 'language') => {
    const _arrOfObj = [...arrOfObj]
    // eslint-disable-next-line
    return _arrOfObj.reduce((r, v, i, a, k = v[property]) => ((r[k] || (r[k] = [])).push(v), r), {})
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvWord, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDeleteWord, computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeDeleteWord,
    computeLogin,
    computeWord,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  askToDisableWord,
  askToEnableWord,
  askToPublishWord,
  askToUnpublishWord,
  changeTitleParams,
  enableWord,
  disableWord,
  deleteWord,
  fetchDialect2,
  fetchWord,
  overrideBreadcrumbs,
  publishWord,
  pushWindowPath,
  unpublishWord,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectViewWord)
