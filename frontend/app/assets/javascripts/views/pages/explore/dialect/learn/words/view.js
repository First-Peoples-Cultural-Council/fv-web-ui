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
import FVLabel from 'views/components/FVLabel/index'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'

import withActions from 'views/hoc/view/with-actions'
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
        tabsData={this._getTabs(computeWord)}
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
              {this._getRelatedAssets(computeWord)}
              {this._getRelatedToAssets(computeWord)}
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
            <FVLabel transKey="acknowledgement" defaultStr="Acknowledgement" transform="first" />
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
    const audiosData = selectn('response.contextParameters.word.related_audio', computeWord) || []
    const audios = audiosData.map((audio) => {
      return (
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
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="categories" defaultStr="Categories" transform="first" />
        </h4>
        <ul>{categories}</ul>
      </div>
    ) : null
  }

  _getCulturalNotes = (computeWord) => {
    const _cultNote = selectn('response.properties.fv:cultural_note', computeWord) || []
    const culturalNotes = _cultNote.map((culturalNote, key) => {
      return <div key={key}>{this.props.intl.searchAndReplace(culturalNote)}</div>
    })
    return culturalNotes.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCulturalNote">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.cultural_notes"
            defaultStr="Cultural Notes"
            transform="first"
          />
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
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.literal_translations"
            defaultStr="Literal Translations"
            transform="first"
          />
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
            <FVLabel transKey="part_of_speech" defaultStr="Part of Speech" transform="first" />
          </h4>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div>{partOfSpeech}</div>
          </div>
        </div>
      )
    }
  }

  _getPhotos = (computeWord) => {
    const photosData = selectn('response.contextParameters.word.related_pictures', computeWord) || []
    const photos = photosData.map((picture, key) => {
      return {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
    })

    return photos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhoto">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="photo_s" defaultStr="PHOTO(S)" transform="first" />
        </h4>
        <MediaPanel type="FVPicture" items={photos} />
      </div>
    ) : null
  }

  _getPhrases = (computeWord) => {
    const phrasesData = selectn('response.contextParameters.word.related_phrases', computeWord) || []
    const siteTheme = this.props.routeParams.siteTheme
    const phrases = phrasesData.map((phrase, key) => {
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
        return <p key={key}>{phraseLink}</p>
      }
      return (
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
    })
    return phrases.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="related_phrases" defaultStr="Related Phrases" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{phrases}</div>
      </div>
    ) : null
  }

  _getRelations = (assetData) => {
    const siteTheme = this.props.routeParams.siteTheme
    return assetData.map((asset) => {
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, asset, 'words')
      return (
        <a key={selectn('uid', asset)} href={hrefPath}>
          <li>{selectn('dc:title', asset)}</li>
        </a>
      )
    })
  }

  _getRelatedAssets = (computeWord) => {
    const assetData = selectn('response.contextParameters.word.related_assets', computeWord) || []
    const assets = this._getRelations(assetData)
    return assets.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          {/* When change from Related Words -> Related Assets change label below */}
          <FVLabel transKey="related_assets" defaultStr="Related Words" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">
          <ul>{assets}</ul>
        </div>
      </div>
    ) : null
  }

  _getRelatedToAssets = (computeWord) => {
    const relatedToAssetData = selectn('response.contextParameters.word.related_by', computeWord) || []
    const assets = this._getRelations(relatedToAssetData)
    return assets.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhrasePhrase">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="related_by_assets" defaultStr="See Also" transform="first" />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">
          <ul>{assets}</ul>
        </div>
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
            <FVLabel transKey="pronunciation" defaultStr="Pronunciation" transform="first" />
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
    const photoThumbnailsData = selectn('response.contextParameters.word.related_pictures', computeWord) || []
    const photosThumbnails = photoThumbnailsData.map((picture) => {
      return (
        <img
          key={picture.uid}
          src={selectn('views[0].url', picture) || 'assets/images/cover.png'}
          alt={selectn('title', picture)}
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (photosThumbnails.length > 0) {
      tabs.push({
        key: 'pictures',
        label: this.props.intl.trans('pictures', 'Pictures', 'first'),
        content: photosThumbnails,
      })
    }
    // Videos
    const videoThumbnailsData = selectn('response.contextParameters.word.related_videos', computeWord) || []
    const videoThumbnails = videoThumbnailsData.map((video) => {
      return (
        <video
          key={video.uid}
          src={NavigationHelpers.getBaseURL() + video.path}
          controls
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })
    if (videoThumbnails.length > 0) {
      tabs.push({ key: 'videos', label: this.props.intl.trans('videos', 'Videos', 'first'), content: videoThumbnails })
    }
    // Audio
    const audiosData = selectn('response.contextParameters.word.related_audio', computeWord) || []
    const audioPreviews = audiosData.map((audio) => {
      return <Preview key={selectn('uid', audio)} expandedValue={audio} minimal type="FVAudio" />
    })
    if (audioPreviews.length > 0) {
      tabs.push({ key: 'videos', label: this.props.intl.trans('audio', 'Audio', 'first'), content: audioPreviews })
    }
    // Phrases
    const phrasesData = selectn('response.contextParameters.word.related_phrases', computeWord) || []
    const siteTheme = this.props.routeParams.siteTheme
    const phrases = phrasesData.map((phrase, key) => {
      const hrefPath = NavigationHelpers.generateUIDPath(siteTheme, phrase, 'phrases')
      return (
        <p key={key}>
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
        </p>
      )
    })
    if (phrases.length > 0) {
      tabs.push({ key: 'phrases', label: this.props.intl.trans('phrases', 'Phrases', 'first'), content: phrases })
    }

    return tabs
  }

  _getVideos = (computeWord) => {
    const videosData = selectn('response.contextParameters.word.related_videos', computeWord) || []
    const videos = videosData.map((video, key) => {
      return {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
    })
    return videos.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseVideo">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel transKey="video_s" defaultStr="VIDEO(S)" transform="first" />
        </h4>
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
  const { fvDialect, fvWord, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDeleteWord, computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeDeleteWord,
    computeLogin,
    computeWord,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
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
