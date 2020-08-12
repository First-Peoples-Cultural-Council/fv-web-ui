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
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import DetailWordPhrase from 'components/DetailWordPhrase'

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
    const acknowledgement = selectn('response.properties.fv-word:acknowledgement', computeWord)
    const audio = selectn('response.contextParameters.word.related_audio', computeWord) || []
    const categories = selectn('response.contextParameters.word.categories', computeWord) || []
    const culturalNotes = selectn('response.properties.fv:cultural_note', computeWord) || []
    const definitions = selectn('response.properties.fv:definitions', computeWord)
    const dialectClassName = getDialectClassname(computeDialect2)
    const literalTranslations = selectn('response.properties.fv:literal_translation', computeWord)
    const metadata = selectn('response', computeWord) ? (
      <MetadataPanel properties={this.props.properties} computeEntity={computeWord} />
    ) : null
    const partOfSpeech = selectn('response.contextParameters.word.part_of_speech', computeWord)
    const photos = selectn('response.contextParameters.word.related_pictures', computeWord) || []
    const phrases = selectn('response.contextParameters.word.related_phrases', computeWord) || []
    const pronunciation = selectn('response.properties.fv-word:pronunciation', computeWord)
    const relatedAssets = selectn('response.contextParameters.word.related_assets', computeWord) || []
    const relatedToAssets = selectn('response.contextParameters.word.related_by', computeWord) || []
    const title = selectn('response.title', computeWord)
    const videos = selectn('response.contextParameters.word.related_videos', computeWord) || []

    const tabData = this._getTabs({ phrases, photos, videos, audio })
    /**
     * Generate definitions body
     */
    return (
      <DetailsViewWithActions
        labels={{ single: 'word' }}
        itemPath={this._getWordPath()}
        actions={['workflow', 'edit', 'visibility', 'publish']}
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
        tabsData={tabData}
        computeEntities={computeEntities || Immutable.List()}
        {...this.props}
      >
        <DetailWordPhrase.Presentation
          acknowledgement={acknowledgement}
          audio={audio}
          categories={categories}
          culturalNotes={culturalNotes}
          definitions={definitions}
          dialectClassName={dialectClassName}
          literalTranslations={literalTranslations}
          metadata={metadata}
          partOfSpeech={partOfSpeech}
          photos={photos}
          phrases={phrases}
          pronunciation={pronunciation}
          relatedAssets={relatedAssets}
          relatedToAssets={relatedToAssets}
          title={title}
          videos={videos}
        />
      </DetailsViewWithActions>
    )
  }

  _getTabs = ({ phrases: phrasesData, photos: photosData, videos: videoData, audio: audioData }) => {
    const tabs = []
    // Photos
    const photosThumbnails = photosData.map((picture) => {
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
    const videoThumbnails = videoData.map((video) => {
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
    const audioPreviews = audioData.map((_audio) => {
      return <Preview key={selectn('uid', _audio)} expandedValue={_audio} minimal type="FVAudio" />
    })
    if (audioPreviews.length > 0) {
      tabs.push({ key: 'videos', label: this.props.intl.trans('audio', 'Audio', 'first'), content: audioPreviews })
    }
    // Phrases
    const siteTheme = this.props.routeParams.siteTheme
    const _phrases = phrasesData.map((phrase, key) => {
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
    if (_phrases.length > 0) {
      tabs.push({ key: 'phrases', label: this.props.intl.trans('phrases', 'Phrases', 'first'), content: _phrases })
    }

    return tabs
  }

  _getWordPath = (props = this.props) => {
    if (StringHelpers.isUUID(props.routeParams.word)) {
      return props.routeParams.word
    }
    return props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(props.routeParams.word)
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
