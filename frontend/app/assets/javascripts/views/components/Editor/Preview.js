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
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchAudio } from 'providers/redux/reducers/fvAudio'
import { fetchCategory } from 'providers/redux/reducers/fvCategory'
import { fetchContributor } from 'providers/redux/reducers/fvContributor'
import { fetchPhrase } from 'providers/redux/reducers/fvPhrase'
import { fetchPicture } from 'providers/redux/reducers/fvPicture'
import { fetchLink } from 'providers/redux/reducers/fvLink'
import { fetchVideo } from 'providers/redux/reducers/fvVideo'
import { fetchWord } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import MetadataList from 'views/components/Browsing/metadata-list'
import AudioOptimal from 'views/components/Browsing/audio-optimal'

import { withTheme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CircularProgress from '@material-ui/core/CircularProgress'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import PreviewMetaDataContributor from 'views/components/Editor/PreviewMetaDataContributor'
import FVLabel from '../FVLabel/index'

const { bool, func, object, string } = PropTypes

export class Preview extends Component {
  static propTypes = {
    crop: bool,
    expandedValue: object,
    id: string,
    initiallyExpanded: bool,
    metadataListStyles: object,
    minimal: bool,
    optimal: bool,
    styles: object,
    tagProps: object,
    tagStyles: object,
    type: string.isRequired,
    // REDUX: reducers/state
    computeAudio: object.isRequired,
    computeCategory: object.isRequired,
    computeContributor: object.isRequired,
    computeLink: object.isRequired,
    computePhrase: object.isRequired,
    computePicture: object.isRequired,
    computeVideo: object.isRequired,
    computeWord: object.isRequired,
    properties: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchAudio: func.isRequired,
    fetchCategory: func.isRequired,
    fetchContributor: func.isRequired,
    fetchPhrase: func.isRequired,
    fetchPicture: func.isRequired,
    fetchLink: func.isRequired,
    fetchVideo: func.isRequired,
    fetchWord: func.isRequired,
  }

  static defaultProps = {
    styles: {},
    tagStyles: {},
    crop: false,
    optimal: false,
    minimal: false,
    initiallyExpanded: false,
  }
  state = {
    showAudioMetadata: false,
    open: this.props.initiallyExpanded || false,
  }

  async componentDidMount() {
    // Only fetch from server if expanded value isn't provided
    if (!this.props.expandedValue && this.props.id) {
      switch (this.props.type) {
        case 'FVWord':
          await this.props.fetchWord(this.props.id)
          break

        case 'FVPhrase':
          await this.props.fetchPhrase(this.props.id)
          break

        case 'FVCategory':
          await this.props.fetchCategory(this.props.id)
          break

        case 'FVPicture':
          await this.props.fetchPicture(this.props.id)
          break

        case 'FVAudio':
          await this.props.fetchAudio(this.props.id)
          break

        case 'FVVideo':
          await this.props.fetchVideo(this.props.id)
          break

        case 'FVContributor':
          await this.props.fetchContributor(this.props.id)
          break

        case 'FVLink':
          await this.props.fetchLink(this.props.id)
          break
        default: // NOTE: do nothing
      }
    }
  }

  render() {
    const themePalette = this.props.theme.palette

    let handleExpandChange = () => { }

    const previewStyles = Object.assign(
      {
        padding: '10px 0',
      },
      this.props.styles
    )

    let body = <CircularProgress variant="indeterminate" />

    switch (this.props.type) {
      case 'FVWord': {
        let word = {}
        let wordResponse

        if (this.props.expandedValue) {
          word.success = true
          wordResponse = this.props.expandedValue
        } else {
          word = ProviderHelpers.getEntry(this.props.computeWord, this.props.id)
          wordResponse = selectn('response', word)
        }

        if (wordResponse && word.success) {
          const image = selectn('contextParameters.word.related_pictures[0].path', wordResponse)
          const translations =
            selectn('properties.fv:literal_translation', wordResponse) ||
            selectn('properties.fv-word:definitions', wordResponse)
          const audio = selectn('contextParameters.word.related_audio[0].path', wordResponse)

          if (this.props.minimal) {
            body = (
              <div>
                <strong>{selectn('properties.dc:title', wordResponse)}</strong>
              </div>
            )
          } else {
            body = (
              <div>
                {image ? (
                  <Avatar
                    src={NavigationHelpers.getBaseURL() + image}
                    size={45}
                    className="pull-left"
                    style={{ marginRight: '10px', marginTop: '10px' }}
                  />
                ) : (
                  ''
                )}
                <strong style={{ lineHeight: '200%' }}>
                  {selectn('properties.dc:title', wordResponse)} ({selectn('properties.dc:title', wordResponse)})
                </strong>
                <br />
                {translations.map((translation, j) => (
                  <span key={j}>
                    {translation.translation}
                    <br />
                  </span>
                ))}
                <br />
                {audio ? <audio src={NavigationHelpers.getBaseURL() + audio} controls /> : ''}
              </div>
            )
          }
        } else if (word && word.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', word)}
            </div>
          )
        }

        break
      }

      case 'FVPhrase': {
        let phrase = {}
        let phraseResponse

        if (this.props.expandedValue) {
          phrase.success = true
          phraseResponse = this.props.expandedValue
        } else {
          phrase = ProviderHelpers.getEntry(this.props.computePhrase, this.props.id)
          phraseResponse = selectn('response', phrase)
        }

        if (phraseResponse && phrase.success) {
          body = (
            <div>
              <strong>{phraseResponse.title}</strong>
            </div>
          )
        } else if (phrase && phrase.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />: {selectn('message', phrase)}
            </div>
          )
        }

        break
      }
      case 'FVCategory': {
        let category = {}
        let categoryResponse

        if (this.props.expandedValue) {
          category.success = true
          categoryResponse = this.props.expandedValue
        } else {
          category = ProviderHelpers.getEntry(this.props.computeCategory, this.props.id)
          categoryResponse = selectn('response', category)
        }

        if (categoryResponse && category.success) {
          const breadcrumb = []
            ; (selectn('contextParameters.breadcrumb.entries', categoryResponse) || []).map((entry, i) => {
            if (entry.type === 'FVCategory') {
              let shared = ''

              if (entry.path.indexOf('SharedData') !== -1) shared = ' (' + this.props.intl.trans('shared', 'Shared', 'first') + ')'

              breadcrumb.push(
                <span key={i}>
                  {' '}
                    &raquo; {entry.title} {shared}
                </span>
              )
            }
          })

          body = (
            <div>
              <strong>{breadcrumb}</strong>
            </div>
          )
        } else if (category && category.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', category)}
            </div>
          )
        }

        break
      }
      case 'FVPicture': {
        let picture = {}
        let pictureResponse
        let pictureTag = ''

        const remotePicture = ProviderHelpers.getEntry(
          this.props.computePicture,
          this.props.id || selectn('expandedValue.uid', this.props)
        )

        if (this.props.expandedValue && !selectn('success', remotePicture)) {
          picture.success = true
          pictureResponse = this.props.expandedValue
          handleExpandChange = this._handleExpandChange.bind(
            this,
            selectn('expandedValue.uid', this.props),
            this.props.fetchPicture
          )
        } else {
          picture = remotePicture
          pictureResponse = selectn('response', picture)
        }

        if (pictureResponse && picture.success) {
          pictureTag = (
            <img
              style={{ maxWidth: '100%', width: 'inherit', minWidth: 'inherit' }}
              src={UIHelpers.getThumbnail(pictureResponse, 'Medium')}
              alt={selectn('title', pictureResponse)}
            />
          )

          if (this.props.crop) {
            pictureTag = (
              <div
                style={{
                  width: '100%',
                  backgroundImage: "url('" + UIHelpers.getThumbnail(pictureResponse, 'Medium') + "')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPositionX: '50%',
                  ...this.props.tagStyles,
                }}
              />
            )
          }

          if (this.props.minimal) {
            body = pictureTag
          } else {
            const description =
              selectn('properties.dc:description', pictureResponse) || selectn('dc:description', pictureResponse)
            body = (
              <Card style={{ boxShadow: 'none' }}>
                <CardContent style={{ backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px' }}>
                  {selectn('properties.file:content.data', pictureResponse) ||
                    (selectn('path', pictureResponse) && selectn('path', pictureResponse).indexOf('nxfile') != -1)
                    ? pictureTag
                    : null}
                </CardContent>

                <CardHeader
                  title={
                    <Typography variant="subheading">
                      {selectn('title', pictureResponse) || selectn('dc:title', pictureResponse)}
                    </Typography>
                  }
                  subheader={
                    description && description != 'undefined'
                      ? this.props.intl.trans('description', 'Description', 'first') + ': ' + description
                      : ''
                  }
                  style={{ lineHeight: 'initial', fontSize: '18px', height: 'inherit', padding: '16px 0' }}
                />
                <CardHeader
                  onClick={() => {
                    this._toggleOpen()
                    handleExpandChange()
                  }}
                  className="card-header-custom"
                  title={
                    <Typography
                      variant="subheading"
                      style={{
                        color: themePalette.secondary.contrastText,
                      }}
                    >
                      <FVLabel
                        transKey="more_image_info"
                        defaultStr="MORE IMAGE INFO"
                        transform="upper"
                      />
                      <IconButton
                        onClick={() => {
                          this._toggleOpen()
                          handleExpandChange()
                        }}
                      >
                        {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </Typography>
                  }
                  style={{
                    backgroundColor: themePalette.primary2Color,
                    borderBottom: '4px solid ' + themePalette.primary.light,
                    padding: '8px 16px',
                  }}
                />
                <Collapse in={this.state.open}>
                  <CardContent>
                    <MetadataList
                      style={{
                        lineHeight: 'initial',
                        maxHeight: '100%',
                        overflow: 'hidden',
                        ...this.props.metadataListStyles,
                      }}
                      metadata={this._getMetaData('picture', pictureResponse)}
                    />
                  </CardContent>
                </Collapse>
              </Card>
            )
          }
        } else if (picture && picture.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', picture)}
            </div>
          )
        }

        break
      }
      case 'FVAudio': {
        let audio = {}
        let audioResponse
        let audioTag = ''

        const remoteAudio = ProviderHelpers.getEntry(
          this.props.computeAudio,
          this.props.id || selectn('expandedValue.uid', this.props)
        )

        if (this.props.expandedValue && !selectn('success', remoteAudio)) {
          audio.success = true
          audioResponse = this.props.expandedValue
          handleExpandChange = this._handleExpandChange.bind(
            this,
            selectn('expandedValue.uid', this.props),
            this.props.fetchAudio
          )
        } else {
          audio = remoteAudio
          audioResponse = selectn('response', audio)
        }

        if (audioResponse && audio.success) {
          audioTag = (
            <audio
              {...this.props.tagProps}
              style={this.props.tagStyles}
              src={
                selectn('properties.file:content.data', audioResponse) ||
                NavigationHelpers.getBaseURL() + selectn('path', audioResponse)
              }
              alt={selectn('title', audioResponse)}
              controls
            />
          )

          const description =
            selectn('properties.dc:description', audioResponse) || selectn('dc:description', audioResponse)
          const title = selectn('title', audioResponse) || selectn('dc:title', audioResponse)
          const speakers = selectn('contextParameters.media.sources', audioResponse)
          const recorders = selectn('contextParameters.media.recorders', audioResponse)

          if (this.props.minimal) {
            body = audioTag
          } else if (this.props.optimal) {
            body = (
              <AudioOptimal
                audioTag={audioTag}
                onInfoRequest={handleExpandChange}
                metadata={{
                  title: title,
                  description: description,
                  speakers: speakers,
                  recorders: recorders,
                }}
              />
            )
          } else {
            body = (
              <Card style={{ boxShadow: 'none' }}>
                <CardHeader
                  title={
                    <Typography variant="subheading">
                      {selectn('title', audioResponse) || selectn('dc:title', audioResponse)}
                    </Typography>
                  }
                  subheader={description && description != 'undefined' ? 'Description: ' + description : ''}
                  style={{ height: 'initial', padding: 0, lineHeight: 'initial', fontSize: '18px' }}
                />
                <div style={{ backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px' }}>
                  {selectn('properties.file:content.data', audioResponse) ||
                    (selectn('path', audioResponse) && selectn('path', audioResponse).indexOf('nxfile') != -1)
                    ? audioTag
                    : null}
                </div>
                <CardHeader
                  onClick={() => {
                    this._toggleOpen()
                    handleExpandChange()
                  }}
                  className="card-header-custom"
                  title={
                    <Typography
                      variant="subheading"
                      style={{
                        color: themePalette.secondary.contrastText,
                      }}
                    >
                      <FVLabel
                        transKey="more_audio_info"
                        defaultStr="MORE AUDIO INFO"
                        transform="upper"
                      />
                      <IconButton
                        onClick={() => {
                          this._toggleOpen()
                          handleExpandChange()
                        }}
                      >
                        {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>{' '}
                    </Typography>
                  }
                  style={{
                    backgroundColor: themePalette.primary2Color,
                    padding: '8px 16px',
                    borderBottom: '4px solid ' + themePalette.primary.light,
                  }}
                />
                <Collapse in={this.state.open}>
                  <CardContent style={{ backgroundColor: themePalette.accent4Color }}>
                    <MetadataList
                      style={{
                        lineHeight: 'initial',
                        maxHeight: '100%',
                        overflow: 'hidden',
                        ...this.props.metadataListStyles,
                      }}
                      metadata={this._getMetaData('audio', audioResponse)}
                    />
                  </CardContent>
                </Collapse>
              </Card>
            )
          }
        } else if (audio && audio.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', audio)}
            </div>
          )
        }

        break
      }
      case 'FVVideo': {
        let video = {}
        let videoResponse
        let videoTag = ''

        const remoteVideo = ProviderHelpers.getEntry(
          this.props.computeVideo,
          this.props.id || selectn('expandedValue.uid', this.props)
        )

        if (this.props.expandedValue && !selectn('success', remoteVideo)) {
          video.success = true
          videoResponse = this.props.expandedValue
          handleExpandChange = this._handleExpandChange.bind(
            this,
            selectn('expandedValue.uid', this.props),
            this.props.fetchVideo
          )
        } else {
          video = remoteVideo
          videoResponse = selectn('response', video)
        }

        if (videoResponse && video.success) {
          videoTag = (
            <video
              width="100%"
              height="auto"
              src={
                selectn('properties.file:content.data', videoResponse) ||
                NavigationHelpers.getBaseURL() + selectn('path', videoResponse)
              }
              alt={selectn('title', videoResponse)}
              controls
            />
          )

          if (this.props.minimal) {
            body = videoTag
          } else {
            // const description =
            //   selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse)

            body = (
              <Card style={{ boxShadow: 'none' }}>
                <div style={{ backgroundColor: themePalette.primary2Color, margin: '5px 0', padding: '8px' }}>
                  {selectn('properties.file:content.data', videoResponse) ||
                    (selectn('path', videoResponse) && selectn('path', videoResponse).indexOf('nxfile') != -1)
                    ? videoTag
                    : null}
                </div>
                <CardHeader
                  title={
                    <Typography variant="subheading">
                      {selectn('title', videoResponse) || selectn('dc:title', videoResponse)}
                    </Typography>
                  }
                  subheader={
                    selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse)
                  }
                  style={{ height: 'inherit', padding: '16px 0', lineHeight: 'initial', fontSize: '18px' }}
                />
                <CardHeader
                  onClick={() => {
                    this._toggleOpen()
                    handleExpandChange()
                  }}
                  className="card-header-custom"
                  title={
                    <Typography
                      variant="subheading"
                      style={{
                        color: themePalette.secondary.contrastText,
                      }}
                    >
                      <FVLabel
                        transKey="more_video_info"
                        defaultStr="MORE VIDEO INFO"
                        transform="upper"
                      />
                      <IconButton
                        onClick={() => {
                          this._toggleOpen()
                          handleExpandChange()
                        }}
                      >
                        {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </Typography>
                  }
                  style={{
                    backgroundColor: themePalette.primary2Color,
                    padding: '8px 16px',
                    borderBottom: '4px solid ' + themePalette.primary.light,
                  }}
                />
                <Collapse in={this.state.open}>
                  <CardContent style={{ backgroundColor: themePalette.accent4Color }}>
                    <MetadataList
                      style={{
                        lineHeight: 'initial',
                        maxHeight: '100%',
                        overflow: 'hidden',
                        ...this.props.metadataListStyles,
                      }}
                      metadata={this._getMetaData('video', videoResponse)}
                    />
                  </CardContent>
                </Collapse>
              </Card>
            )
          }
        } else if (video && video.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', video)}
            </div>
          )
        }

        break
      }
      case 'FVContributor': {
        let contributor = {}
        let contributorResponse

        if (this.props.expandedValue) {
          contributor.success = true
          contributorResponse = this.props.expandedValue
        } else {
          contributor = ProviderHelpers.getEntry(this.props.computeContributor, this.props.id)
          contributorResponse = selectn('response', contributor)
        }

        if (contributorResponse && contributor.success) {
          body = (
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: selectn('title', contributorResponse) || selectn('dc:title', contributorResponse),
                }}
              />
              <span>
                {' '}
                {selectn('properties.dc:description', contributorResponse) ||
                  selectn('dc:description', contributorResponse)}
              </span>
            </div>
          )
        } else if (contributor && contributor.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', contributor)}
            </div>
          )
        }

        break
      }
      case 'FVLink': {
        let link = {}
        let linkResponse

        if (this.props.expandedValue) {
          link.success = true
          linkResponse = this.props.expandedValue
        } else {
          link = ProviderHelpers.getEntry(this.props.computeLink, this.props.id)
          linkResponse = selectn('response', link)
        }

        if (linkResponse && link.success) {
          link =
            selectn('properties.fvlink:url', linkResponse) ||
            selectn('fvlink:url', linkResponse) ||
            selectn('properties.file:content.data', linkResponse) ||
            selectn('file:content.data', linkResponse)

          body = (
            <div>
              <div>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {selectn('title', linkResponse) || selectn('dc:title', linkResponse)}
                </a>
              </div>
              <div>{selectn('properties.dc:description', linkResponse) || selectn('dc:description', linkResponse)}</div>
            </div>
          )
        } else if (link && link.isError) {
          body = (
            <div>
              <FVLabel
                transKey="error"
                defaultStr="Error"
                transform="first"
              />
              : {selectn('message', link)}
            </div>
          )
        }

        break
      }
      default:
        body = <FVLabel
          transKey="preview_option_not_available"
          defaultStr="Preview option not available. Please report to Administrator"
          transform="first"
        />

        break
    }

    return <div style={previewStyles}>{body}</div>
  }
  /**
   * Request additional media info when expanded.
   */
  _handleExpandChange = (id, fetchFunc /*, event, expanded*/) => {
    fetchFunc(id)
  }

  _getMetaData = (type, response) => {
    // if (type === 'audio') {
    //   debugger
    // }
    const metadata = []

    /**
     * Recorders
     */
    const recorders = []

    const recordersData = selectn('contextParameters.media.recorders', response) || []
    recordersData.map((recorder, key) => {
      // NOTE: The following triggers FW-299
      // recorders.push(<Preview expandedValue={recorder} key={key} type="FVContributor" />)
      recorders.push(<PreviewMetaDataContributor expandedValue={recorder} key={key} />)
    })

    metadata.push({
      label: 'Recorder(s)',
      value: recorders,
    })

    /**
     * Contributors
     */
    const contributors = []
    const contributorsData = selectn('contextParameters.media.sources', response) || []

    contributorsData.map((contributor, key) => {
      // NOTE: The following triggers FW-299
      // contributors.push(<Preview expandedValue={contributor} key={key} type="FVContributor" />)
      contributors.push(<PreviewMetaDataContributor expandedValue={contributor} key={key} />)
    })

    metadata.push({
      label: this.props.intl.trans('contributor_s', 'Contributor(s)', 'first'),
      value: contributors,
    })

    /**
     * Origin
     */
    if (selectn('contextParameters.media.origin', response)) {
      metadata.push({
        label: this.props.intl.trans('original_associated_word_phrase', 'Original Associated Word/Phrase', 'words'),
        value:
          selectn('contextParameters.media.origin.dc:title', response) +
          ' (Path: ' +
          selectn('contextParameters.media.origin.path', response) +
          ')',
      })
    }

    /**
     * Child Focused
     */
    metadata.push({
      label: this.props.intl.trans('models.child_focused', 'Child Focused', 'words'),
      value: selectn('properties.fvm:child_focused', response)
        ? this.props.intl.trans('yes', 'Yes', 'first')
        : this.props.intl.trans('no', 'No', 'first'),
    })

    /**
     * Shared
     */
    metadata.push({
      label: this.props.intl.trans('shared', 'Shared', 'first'),
      value: selectn('properties.fvm:shared', response)
        ? this.props.intl.trans('yes', 'Yes', 'first')
        : this.props.intl.trans('no', 'No', 'first'),
    })

    /**
     * Direct Link
     */
    if (selectn('path', response)) {
      const directLinkValue = NavigationHelpers.generateUIDPath('explore', response, 'media')

      metadata.push({
        label: this.props.intl.trans('direct_link', 'Direct Link', 'words'),
        value: (
          <span>
            <input
              type="textbox"
              readOnly
              style={{ width: '100%', padding: '5px', maxWidth: '650px' }}
              value={directLinkValue}
            />{' '}
            <br />
            <a href={directLinkValue} target="_blank" rel="noopener noreferrer">
              <FVLabel
                transKey="go_to_record"
                defaultStr="Go to Record"
                transform="words"
              />
            </a>
          </span>
        ),
      })
    }

    /**
     * File size
     */
    metadata.push({
      label: this.props.intl.trans('size', 'Size', 'first'),
      value: selectn('properties.file:content.length', response)
        ? StringHelpers.getReadableFileSize(selectn('properties.file:content.length', response))
        : '-',
    })

    /**
     * Status
     */
    metadata.push({
      label: this.props.intl.trans('status', 'Status', 'first'),
      value: selectn('state', response) ? selectn('state', response) : '-',
    })

    /**
     * Date created
     */
    metadata.push({
      label: this.props.intl.trans('date_created', 'Date Added to FirstVoices', 'first'),
      value: selectn('properties.dc:created', response)
        ? StringHelpers.formatUTCDateString(selectn('properties.dc:created', response))
        : '-',
    })

    return metadata
  }
  _toggleOpen() {
    this.setState({
      open: !this.state.open,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvWord, fvPhrase, fvCategory, fvPicture, fvAudio, fvVideo, fvContributor, fvLink, navigation, locale } = state

  const { computeAudio } = fvAudio
  const { computeCategory } = fvCategory
  const { computeContributor } = fvContributor
  const { computeLink } = fvLink
  const { computePhrase } = fvPhrase
  const { computePicture } = fvPicture
  const { computeVideo } = fvVideo
  const { computeWord } = fvWord
  const { properties } = navigation
  const { intlService } = locale

  return {
    computeAudio,
    computeCategory,
    computeContributor,
    computeLink,
    computePhrase,
    computePicture,
    computeVideo,
    computeWord,
    properties,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchAudio,
  fetchCategory,
  fetchContributor,
  fetchPhrase,
  fetchPicture,
  fetchLink,
  fetchVideo,
  fetchWord,
}

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Preview))
