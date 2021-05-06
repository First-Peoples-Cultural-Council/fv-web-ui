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
import classNames from 'classnames'
import sanitize from 'common/Sanitize'
import selectn from 'selectn'

import FVButton from 'components/FVButton'
import Paper from '@material-ui/core/Paper'
import FVTab from 'components/FVTab'
import MediaPanel from 'components/LearnBase/media-panel'
import NavigationHelpers from 'common/NavigationHelpers'
import Preview from 'components/Preview'
import FVLabel from 'components/FVLabel'

const defaultInnerStyle = { padding: '15px', margin: '15px 0', minHeight: '420px', overflowX: 'auto' }

class MediaThumbnail extends Component {
  static propTypes = {
    photos: PropTypes.array,
    videos: PropTypes.array,
  }
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

class Page extends Component {
  static propTypes = {
    defaultLanguage: PropTypes.string,
    entry: PropTypes.object,
    videos: PropTypes.array,
    photos: PropTypes.array,
    editAction: PropTypes.func,
    appendEntryControls: PropTypes.array,
  }
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
              hidden: this.props.videos.length === 0 && this.props.photos.length === 0,
            })}
            style={{ marginBottom: '10px', textAlign: 'center' }}
          >
            <MediaThumbnail videos={this.props.videos} photos={this.props.photos} />
          </div>

          <div className="col-xs-12 col-md-9">
            <div className={classNames('col-xs-6', 'fontBCSans')}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitize(selectn('properties.dc:title', this.props.entry)),
                }}
              />
              {audios}
            </div>
            <div className={classNames('col-xs-6')} style={{ borderLeft: '1px solid #e1e1e1' }}>
              {(selectn('properties.fvbookentry:dominant_language_text', this.props.entry) || []).map(
                (translation, i) => {
                  if (translation.language === DEFAULT_LANGUAGE) {
                    return <div key={i} dangerouslySetInnerHTML={{ __html: sanitize(translation.translation) }} />
                  }
                }
              )}
            </div>
            <div className={classNames('col-xs-12')} style={{ marginTop: '15px' }}>
              {(selectn('properties.fv:literal_translation', this.props.entry) || []).map((translation, i) => {
                if (translation.language === DEFAULT_LANGUAGE) {
                  return (
                    <span key={i}>
                      <strong>
                        <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
                      </strong>
                      : <span dangerouslySetInnerHTML={{ __html: sanitize(translation.translation) }} />
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
          {this.props.editAction ? (
            <div className={classNames('col-xs-12', 'text-right')} style={{ paddingTop: '15px' }}>
              <small>
                Page ID: <strong>{this.props.entry.uid.substring(0, 8)}</strong>
              </small>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}

export default class SongsStoriesEntryView extends Component {
  static propTypes = {
    entry: PropTypes.object,
    innerStyle: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
  }

  render() {
    // Photos
    const photosData = selectn('contextParameters.book.related_pictures', this.props.entry) || []
    const photos = []
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
    })

    // Videos
    const videosData = selectn('contextParameters.book.related_videos', this.props.entry) || []
    const videos = []
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
    return (
      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-xs-12">
          <Paper style={Object.assign({}, defaultInnerStyle, this.props.innerStyle)}>
            <Page {...this.props} {...media} />
          </Paper>
        </div>
      </div>
    )
  }
}
