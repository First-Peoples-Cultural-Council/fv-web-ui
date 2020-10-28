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
// import PropTypes from 'prop-types'
import classNames from 'classnames'
import DOMPurify from 'dompurify'
import selectn from 'selectn'

import FVButton from 'components/FVButton'
import Paper from '@material-ui/core/Paper'
import FVTab from 'components/FVTab'
import Typography from '@material-ui/core/Typography'

import ActionLaunch from '@material-ui/icons/Launch'

import { Introduction } from 'components/SongsStories/list-view'
import MediaPanel from 'components/LearnBase/media-panel'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'components/Preview'
import FVLabel from 'components/FVLabel'

const defaultInnerStyle = { padding: '15px', margin: '15px 0', minHeight: '420px', overflowX: 'auto' }
const defaultCoverStyle = { padding: '15px', margin: '15px 0' }

class MediaThumbnail extends Component {
  state = {
    tabValue: 0,
  }
  render() {
    const photoMediaPanel = <MediaPanel minimal label="" type="FVPicture" items={this.props.photos} />
    const videoMediaPanel = <MediaPanel minimal label="" type="FVVideo" items={this.props.videos} />

    if (this.props.photos.length > 0 && this.props.videos.length > 0) {
      return (
        <div>
          <FVTab
            tabsStyle={{ marginTop: '15px' }}
            tabItems={[
              { label: 'Photo(s)' },
              {
                label: 'Video(s)',
              },
            ]}
            tabsValue={this.state.tabValue}
            tabsOnChange={(e, tabValue) => this.setState({ tabValue })}
          />
          {this.state.tabValue === 0 && photoMediaPanel}
          {this.state.tabValue === 1 && videoMediaPanel}
        </div>
      )
    } else if (this.props.photos.length > 0) {
      return photoMediaPanel
    } else if (this.props.videos.length > 0) {
      return videoMediaPanel
    }

    return null
  }
}

class Cover extends Component {
  render() {
    const DEFAULT_LANGUAGE = this.props.defaultLanguage

    const dominant_language_title_translation = (
      selectn('properties.fvbook:title_literal_translation', this.props.entry) || []
    ).filter(function (translation) {
      return translation.language == DEFAULT_LANGUAGE
    })

    return (
      <div className="row">
        <div className="col-xs-12">
          <div
            className={classNames('col-xs-12', 'col-md-3', {
              hidden: this.props.videos.length == 0 && this.props.photos.length == 0,
            })}
          >
            <MediaThumbnail videos={this.props.videos} photos={this.props.photos} />
          </div>

          <div className="col-xs-12 col-md-9 fontBCSans">
            <header style={{ marginBottom: '10px' }}>
              <Typography variant="h3" component="h2">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectn('title', this.props.entry)) }} />
              </Typography>
              <Typography variant="h4" component="h3">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectn('[0].translation', dominant_language_title_translation)),
                  }}
                />
              </Typography>
              <div className="subheader">
                {(selectn('contextParameters.book.authors', this.props.entry) || []).map(function (author, i) {
                  return (
                    <span className={classNames('label', 'label-default')} key={i}>
                      {selectn('dc:title', author)}
                    </span>
                  )
                })}
              </div>
            </header>

            <div>
              <Introduction
                item={this.props.entry}
                defaultLanguage={this.props.defaultLanguage}
                style={{ height: '16vh', padding: '5px' }}
              />
              {this.props.audios}
            </div>
          </div>
        </div>

        <div className="col-xs-12">
          <div className={classNames('col-xs-12', 'text-right')}>
            {this.props.openBookAction && this.props.pageCount > 0 ? (
              <FVButton
                variant="contained"
                style={{ marginRight: '10px' }}
                color="primary"
                onClick={this.props.openBookAction}
              >
                <ActionLaunch />
                {'Open Book'}
              </FVButton>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }
}

class Page extends Component {
  render() {
    const DEFAULT_LANGUAGE = this.props.defaultLanguage

    // Audio
    const audiosData = selectn('contextParameters.book.related_audio', this.props.entry) || []
    const audios = audiosData.map((audio) => {
      return <Preview minimal key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />
    })

    return (
      <div>
        <div className="row">
          <div
            className={classNames('col-xs-12', 'col-md-3', {
              hidden: this.props.videos.length == 0 && this.props.photos.length == 0,
            })}
            style={{ marginBottom: '10px', textAlign: 'center' }}
          >
            <MediaThumbnail videos={this.props.videos} photos={this.props.photos} />
          </div>

          <div className="col-xs-12 col-md-9">
            <div className={classNames('col-xs-6', 'fontBCSans')}>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectn('properties.dc:title', this.props.entry)),
                }}
              />
              {audios}
            </div>
            <div className={classNames('col-xs-6')} style={{ borderLeft: '1px solid #e1e1e1' }}>
              {(selectn('properties.fvbookentry:dominant_language_text', this.props.entry) || []).map(function (
                translation,
                i
              ) {
                if (translation.language == DEFAULT_LANGUAGE) {
                  return (
                    <div key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation.translation) }} />
                  )
                }
              })}
            </div>
            <div className={classNames('col-xs-12')} style={{ marginTop: '15px' }}>
              {(selectn('properties.fv:literal_translation', this.props.entry) || []).map(function (translation, i) {
                if (translation.language == DEFAULT_LANGUAGE) {
                  return (
                    <span key={i}>
                      <strong>
                        <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
                      </strong>
                      : <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation.translation) }} />
                    </span>
                  )
                }
              })}
            </div>
          </div>
        </div>

        <div className="row">
          <div className={classNames('col-xs-12', 'text-right')}>
            {this.props.editAction ? (
              <FVButton variant="contained" onClick={this.props.editAction.bind(this, this.props.entry)}>
                <FVLabel transKey="edit" defaultStr="Edit" transform="first" />
              </FVButton>
            ) : (
              ''
            )}
            <div className="pull-right">{this.props.appendEntryControls}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default class SongsStoriesEntryView extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    // Photos
    const photosData = selectn('contextParameters.book.related_pictures', this.props.entry) || []
    const photos = []
    const photosThumbnails = []
    photosData.forEach((picture, key) => {
      const image = {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
      photos.push(image)
      photosThumbnails.push(
        <img
          key={picture.uid}
          src={selectn('views[0].url', picture) || 'assets/images/cover.png'}
          alt={selectn('title', picture)}
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })

    // Videos
    const videosData = selectn('contextParameters.book.related_videos', this.props.entry) || []
    const videos = []
    const videoThumbnails = []
    videosData.forEach((video, key) => {
      const vid = {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
      videos.push(vid)
      videoThumbnails.push(
        <video
          key={video.uid}
          src={NavigationHelpers.getBaseURL() + video.path}
          controls
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })

    // Audio
    const audiosData = selectn('contextParameters.book.related_audio', this.props.entry) || []
    const audios = audiosData.map((audio) => {
      return <Preview minimal key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />
    })

    const media = {
      photos: photos,
      videos: videos,
      audios: audios,
    }
    const appliedStyle = this.props.cover
      ? Object.assign({}, defaultCoverStyle, this.props.innerStyle)
      : Object.assign({}, defaultInnerStyle, this.props.innerStyle)

    return (
      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-xs-12">
          <Paper style={appliedStyle}>
            {this.props.cover ? <Cover {...this.props} {...media} /> : <Page {...this.props} {...media} />}
          </Paper>
        </div>
      </div>
    )
  }
}
