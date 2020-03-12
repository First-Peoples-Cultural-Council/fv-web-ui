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
  askToDisablePhrase,
  askToEnablePhrase,
  askToPublishPhrase,
  askToUnpublishPhrase,
  deletePhrase,
  disablePhrase,
  enablePhrase,
  fetchPhrase,
  publishPhrase,
  unpublishPhrase,
} from 'providers/redux/reducers/fvPhrase'
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
import Tab from '@material-ui/core/Tab'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'

import withActions from 'views/hoc/view/with-actions'

const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * View phrase entry
 */

const { array, func, object, string } = PropTypes
export class DialectViewPhrase extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePhrase: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    askToDisablePhrase: func.isRequired,
    askToEnablePhrase: func.isRequired,
    askToPublishPhrase: func.isRequired,
    askToUnpublishPhrase: func.isRequired,
    changeTitleParams: func.isRequired,
    deletePhrase: func.isRequired,
    disablePhrase: func.isRequired,
    enablePhrase: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPhrase: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    publishPhrase: func.isRequired,
    pushWindowPath: func.isRequired,
    unpublishPhrase: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      computePhrase: undefined,
      computeDialect2: undefined,
      computeEntities: undefined,
      deleteDialogOpen: false,
    }
  }

  async fetchData(newProps) {
    await newProps.fetchPhrase(this._getPhrasePath(newProps))
    await newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps)
    } else if (nextProps.routeParams.phrase !== this.props.routeParams.phrase) {
      this.fetchData(nextProps)
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps /*, prevState*/) {
    const phrase = selectn('response', ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath()))
    const title = selectn('properties.dc:title', phrase)
    const uid = selectn('uid', phrase)

    if (title && selectn('pageTitleParams.phrase', this.props.properties) !== title) {
      this.props.changeTitleParams({ phrase: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.phrase' })
    }

    const _state = {}
    if (prevProps.computePhrase !== this.props.computePhrase) {
      _state.computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    }
    if (prevProps.computeDialect2 !== this.props.computeDialect2) {
      _state.computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    }
    if (
      prevProps.computePhrase !== this.props.computePhrase ||
      prevProps.computeDialect2 !== this.props.computeDialect2
    ) {
      _state.computeEntities = Immutable.fromJS([
        {
          id: this._getPhrasePath(),
          entity: this.props.computePhrase,
        },
        {
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        },
      ])
    }

    if (_state.computePhrase || _state.computeDialect2 || _state.computeEntities) {
      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState(_state)
    }
  }

  render() {
    const { computeEntities, computePhrase, computeDialect2 } = this.state
    const dialectClassName = getDialectClassname(computeDialect2)
    const title = selectn('response.title', computePhrase)

    /**
     * Generate definitions body
     */
    return (
      <DetailsViewWithActions
        labels={{ single: 'phrase' }}
        itemPath={this._getPhrasePath()}
        actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
        publishAction={this.props.publishPhrase}
        unpublishAction={this.props.unpublishPhrase}
        askToPublishAction={this.props.askToPublishPhrase}
        askToUnpublishAction={this.props.askToUnpublishPhrase}
        enableAction={this.props.enablePhrase}
        askToEnableAction={this.props.askToEnablePhrase}
        disableAction={this.props.disablePhrase}
        askToDisableAction={this.props.askToDisablePhrase}
        deleteAction={this.props.deletePhrase}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computePhrase}
        permissionEntry={computeDialect2}
        tabs={this._getTabs(computePhrase)}
        computeEntities={computeEntities || Immutable.List()}
        {...this.props}
      >
        <div className="DialectViewWordPhrase" id="contentMain">
          <div className="DialectViewWordPhraseGroup">
            <div className="DialectViewWordPhraseContentPrimary">
              <div className="DialectViewWordPhraseTitleAudio">
                <h2 className={`DialectViewWordPhraseTitle ${dialectClassName}`}>
                  {title} {this._getAudio(computePhrase)}
                </h2>
              </div>
              {this._getDefinitions(computePhrase)}
              {this._getCulturalNotes(computePhrase)}
              {this._getLiteralTranslations(computePhrase)}
            </div>

            <aside className="DialectViewWordPhraseContentSecondary">
              {this._getPhotos(computePhrase)}
              {this._getVideos(computePhrase)}
              {this._getPhraseBooks(computePhrase)}
              {this._getAcknowledgement(computePhrase)}

              {/* METADATA PANEL */}
              {selectn('response', computePhrase) ? (
                <MetadataPanel properties={this.props.properties} computeEntity={computePhrase} />
              ) : null}
            </aside>
          </div>
        </div>
      </DetailsViewWithActions>
    )
  }

  _getAcknowledgement = (computePhrase) => {
    const acknowledgement = selectn('response.properties.fv-phrase:acknowledgement', computePhrase)
    if (acknowledgement && acknowledgement !== '') {
      return (
        <div className="DialectViewWordPhraseContentItem">
          <h4 className="DialectViewWordPhraseContentItemTitle">
            <FVLabel
              transKey="acknowledgement"
              defaultStr="Acknowledgement"
              transform="first"
            />
          </h4>
          <div className="DialectViewWordPhraseContentItemGroup">
            <div>{acknowledgement}</div>
          </div>
        </div>
      )
    }
    return null
  }

  _getAudio = (computePhrase) => {
    const audios = []
      ; (selectn('response.contextParameters.phrase.related_audio', computePhrase) || []).map((audio) => {
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

  _getCulturalNotes = (computePhrase) => {
    const _cultNote = selectn('response.properties.fv:cultural_note', computePhrase) || []
    const culturalNotes = _cultNote.map((culturalNote, key) => {
      return <div key={key}>{this.props.intl.searchAndReplace(culturalNote)}</div>
    })
    return culturalNotes.length > 0 ? (
      <div className="DialectViewPhraseContentItem DialectViewWordPhraseCulturalNote">
        <h3 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="views.pages.explore.dialect.learn.phrases.cultural_notes"
            defaultStr="Cultural Notes"
            transform="first"
          />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{culturalNotes}</div>
      </div>
    ) : null
  }

  _getDefinitions = (computePhrase) => {
    const definitions = selectn('response.properties.fv:definitions', computePhrase)

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

  _getLiteralTranslations = (computePhrase) => {
    const literalTranslations = selectn('response.properties.fv:literal_translation', computePhrase)
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
            transKey="views.pages.explore.dialect.learn.phrases.literal_translations"
            defaultStr="Literal Translations"
            transform="first"
          />
        </h3>
        <div className="DialectViewWordPhraseContentItemGroup">{_literalTranslations}</div>
      </div>
    ) : null
  }

  _getPhotos = (computePhrase) => {
    const photos = []
      ; (selectn('response.contextParameters.phrase.related_pictures', computePhrase) || []).map((picture, key) => {
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
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="photo_s"
            defaultStr="PHOTO(S)"
            transform="first"
          />
        </h4>
        <MediaPanel type="FVPicture" items={photos} />
      </div>
    ) : null
  }

  _getPhraseBooks = (computePhrase) => {
    const _phbook = selectn('response.contextParameters.phrase.phrase_books', computePhrase) || []
    const phraseBooks = _phbook.map((phraseBook, key) => {
      return <li key={key}>{selectn('dc:title', phraseBook)}</li>
    })
    return phraseBooks.length > 0 ? (
      <div className="DialectViewWordPhraseContentItem DialectViewWordPhraseCategory">
        <h4 className="DialectViewWordPhraseContentItemTitle">
          <FVLabel
            transKey="phrase books"
            defaultStr="Phrase Books"
            transform="first"
          />
        </h4>
        <ul>{phraseBooks}</ul>
      </div>
    ) : null
  }

  _getTabs = (computePhrase) => {
    const tabs = []

    // Photos
    const photosThumbnails = []
      ; (selectn('response.contextParameters.phrase.related_pictures', computePhrase) || []).map((picture) => {
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
        <Tab key="pictures" label={this.props.intl.trans('pictures', 'Pictures', 'first')}>
          <div style={{ maxHeight: '400px' }}>{photosThumbnails}</div>
        </Tab>
      )
    }

    // Videos
    const videoThumbnails = []
      ; (selectn('response.contextParameters.phrase.related_videos', computePhrase) || []).map((video) => {
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
        <Tab key="videos" label={this.props.intl.trans('videos', 'Videos', 'first')}>
          <div>{videoThumbnails}</div>
        </Tab>
      )
    }

    // Audio
    const audios = []
      ; (selectn('response.contextParameters.phrase.related_audio', computePhrase) || []).map((audio) => {
      audios.push(<Preview key={selectn('uid', audio)} expandedValue={audio} minimal type="FVAudio" />)
    })
    if (audios.length > 0) {
      tabs.push(
        <Tab key="audio" label={this.props.intl.trans('audio', 'Audio', 'first')}>
          <div>{audios}</div>
        </Tab>
      )
    }

    return tabs
  }

  _getVideos = (computePhrase) => {
    const videos = []
      ; (selectn('response.contextParameters.phrase.related_videos', computePhrase) || []).map((video, key) => {
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
        <h4 className="DialectViewWordPhraseContentItemTitle">{this.props.intl.trans('video_s', 'VIDEO(S)', 'first')}</h4>
        <MediaPanel type="FVVideo" items={videos} />
      </div>
    ) : null
  }

  _getPhrasePath = (props = this.props) => {
    if (StringHelpers.isUUID(props.routeParams.phrase)) {
      return props.routeParams.phrase
    }
    return props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(props.routeParams.phrase)
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
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computePhrase,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  askToDisablePhrase,
  askToEnablePhrase,
  askToPublishPhrase,
  askToUnpublishPhrase,
  changeTitleParams,
  deletePhrase,
  disablePhrase,
  enablePhrase,
  fetchDialect2,
  fetchPhrase,
  overrideBreadcrumbs,
  publishPhrase,
  pushWindowPath,
  unpublishPhrase,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectViewPhrase)
