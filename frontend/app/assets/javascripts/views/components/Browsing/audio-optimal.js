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
import Immutable, { List, Map } from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'

import DOMPurify from 'dompurify'

import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardActions from 'material-ui/lib/card/card-actions'
import CardHeader from 'material-ui/lib/card/card-header'
import CardMedia from 'material-ui/lib/card/card-media'
import CardText from 'material-ui/lib/card/card-text'

import IconButton from 'material-ui/lib/icon-button'
import IntlService from 'views/services/intl'

const defaultStyle = { marginBottom: '20px' }

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

  intl = IntlService.instance

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
    ;(metadata.speakers || []).map(function(speaker) {
      if (speaker) {
        speakersCont.push(
          <span className="AudioOptimalMetadataRowValue" key={selectn('uid', speaker)}>
            {selectn('dc:title', speaker)}
          </span>
        )
      }
    })

    return speakersCont.length > 0 ? (
      <span className="AudioOptimalMetadataRow">
        <span className="AudioOptimalMetadataLabel">SPEAKER(S)</span>
        {speakersCont}
      </span>
    ) : null
  }

  _getRecorders(metadata) {
    const recordersCont = []
    ;(metadata.recorders || []).map(function(recorder) {
      if (recorder) {
        recordersCont.push(
          <span className="AudioOptimalMetadataRowValue" key={selectn('uid', recorder)}>
            {selectn('dc:title', recorder)}
          </span>
        )
      }
    })

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
        <IconButton
          tooltip={intl.translate({
            key: 'audio_information',
            default: 'Audio Information',
            case: 'words',
          })}
          iconClassName="material-icons"
          onClick={this._getMoreAudioInfo}
        >
          info
        </IconButton>
        <div className="AudioOptimalMetadata" style={{ display: this.state.showAudioMetadata ? 'block' : 'none' }}>
          {this._getDescription(metadata)}
          {this._getSpeakers(metadata)}
          {this._getRecorders(metadata)}

          <IconButton
            tooltip={intl.translate({
              key: 'audio_information',
              default: 'Hide Audio Information',
              case: 'words',
            })}
            iconClassName="material-icons"
            onClick={() => this.setState({ showAudioMetadata: false })}
          >
            close
          </IconButton>
        </div>
      </div>
    )
  }
}
