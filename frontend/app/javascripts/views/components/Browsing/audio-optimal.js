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
import selectn from 'selectn'
import Tooltip from '@material-ui/core/Tooltip'
import Info from '@material-ui/icons/Info'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import FVLabel from '../FVLabel/index'

export default class AudioOptimal extends Component {
  static propTypes = {
    audioTag: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    onInfoRequest: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showAudioMetadata: false,
    }

    // Bind methods to 'this'
    ;['_getMoreAudioInfo'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getDescription(metadata) {
    return metadata.description ? (
      <span className="AudioOptimalMetadataRow">
        <span className="AudioOptimalMetadataLabel">DESCRIPTION</span> {metadata.description}
      </span>
    ) : (
      ''
    )
  }

  _getSpeakers(metadata) {
    const speakersCont = []
    if (selectn('speakers', metadata)) {
      metadata.speakers.forEach((speaker) => {
        if (speaker) {
          speakersCont.push(
            <span className="AudioOptimalMetadataRowValue" key={selectn('uid', speaker)}>
              {selectn('dc:title', speaker)}
            </span>
          )
        }
      })
    }

    return speakersCont.length > 0 ? (
      <span className="AudioOptimalMetadataRow">
        <span className="AudioOptimalMetadataLabel">SPEAKER(S)</span>
        {speakersCont}
      </span>
    ) : null
  }

  _getRecorders(metadata) {
    const recordersCont = []
    if (selectn('recorders', metadata)) {
      metadata.recorders.forEach((recorder) => {
        if (recorder) {
          recordersCont.push(
            <span className="AudioOptimalMetadataRowValue" key={selectn('uid', recorder)}>
              {selectn('dc:title', recorder)}
            </span>
          )
        }
      })
    }

    return recordersCont.length > 0 ? (
      <span className="AudioOptimalMetadataRow">
        <span className="AudioOptimalMetadataLabel">RECORDED BY</span>
        {recordersCont}
      </span>
    ) : null
  }

  _getMoreAudioInfo() {
    this.props.onInfoRequest()
    this.setState({ showAudioMetadata: !this.state.showAudioMetadata })
  }

  render() {
    const metadata = { ...this.props.metadata }

    return (
      <div className="AudioOptimal">
        {this.props.audioTag}
        <Tooltip title={<FVLabel transKey="audio_information" defaultStr="Audio Information" transform="words" />}>
          <IconButton onClick={this._getMoreAudioInfo}>
            <Info aria-label="Show Audio Information" />
          </IconButton>
        </Tooltip>
        <div className="AudioOptimalMetadata" style={{ display: this.state.showAudioMetadata ? 'block' : 'none' }}>
          {this._getDescription(metadata)}
          {this._getSpeakers(metadata)}
          {this._getRecorders(metadata)}

          <Tooltip
            title={<FVLabel transKey="audio_information" defaultStr="Hide Audio Information" transform="words" />}
          >
            <IconButton onClick={() => this.setState({ showAudioMetadata: false })}>
              <Close aria-label="Hide Audio Information" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }
}
