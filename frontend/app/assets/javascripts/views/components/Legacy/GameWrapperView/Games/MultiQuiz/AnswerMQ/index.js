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
const React = require('react')
const classNames = require('classnames')
const Mui = require('material-ui')
const _ = require('underscore')
const PropTypes = require('prop-types')
const PubSub = require('pubsub-js')
// const { RaisedButton } = Mui

const WordOperations = require('operations/WordOperations')

// const injectTapEventPlugin = require('react-tap-event-plugin')

// https://github.com/facebook/react/issues/3451#issuecomment-83000311
const ThemeManager = new Mui.Styles.ThemeManager()

class AnswerMQ extends React.Component {
  constructor(props) {
    super(props)

    // NOTE: SEE ABOUT DROPPING THE BELOW injectTapEventPlugin

    // Needed for onTouchTap
    // Can go away when react 1.0 release
    // Check this repo:
    // https://github.com/zilverline/react-tap-event-plugin
    // injectTapEventPlugin()

    this.eventName = 'ANSWERMQ'

    this._handleClick = this._handleClick.bind(this)

    this.state = {
      answer: props.data,
      image: null,
      audio: null,
      answerMedia: [],
    }

    if (props.data != undefined && props.data.uid.length > 0) {
      WordOperations.getMediaByWord(
        props.client,
        props.data.uid,
        "(ecm:primaryType='Picture' OR ecm:primaryType='Audio')"
      ).then(
        function(answerMedia) {
          const tmpArray = []
          tmpArray.picture = _.findWhere(answerMedia, { type: 'Picture' })
          tmpArray.audio = _.findWhere(answerMedia, { type: 'Audio' })

          this.setState({ answerMedia: tmpArray })

          WordOperations.getMediaBlobById(
            props.client,
            this.state.answerMedia.picture.uid,
            this.state.answerMedia.picture.properties['file:content']['mime-type'],
            'picture:views/item[2]/content'
          ).then(
            function(response) {
              this.setState({
                image: response.dataUri,
              })
            }.bind(this)
          )
        }.bind(this)
      )
    }
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    }
  }

  _handleClick() {
    if (this.state.audio == null) {
      WordOperations.getMediaBlobById(
        this.props.client,
        this.state.answerMedia.audio.uid,
        this.state.answerMedia.audio.properties['file:content']['mime-type']
      ).then(
        function(response) {
          this.setState({
            audio: response.dataUri,
          })
        }.bind(this)
      )
    }

    // TODO: Stop all other audio
    const selectedAudio = document.getElementById(this.state.answer.uid + '-audio')
    const allAudio = document.getElementsByClassName('audio')

    _.each(allAudio, function allAudioEach(element) {
      if (element != undefined && element.canplay) {
        element.pause()
        element.currentTime = 0
      }
    })

    selectedAudio.play()

    PubSub.publish(this.eventName + ':SELECTED', this.props.data.uid)
  }

  render() {
    return (
      <div className="col-xs-6">
        <div className={classNames('imgContAnswer', this.props.selected ? 'selectedImgContAnswer' : '')}>
          {this.state.image != null ? (
            <img
              onTouchTap={() => {
                // TODO: SEE ABOUT SWAPPING THE ABOVE `onTouchTap` FOR `onClick`
                this._handleClick()
              }}
              className="image"
              src={this.state.image}
              alt=""
            />
          ) : (
            'Loading...'
          )}
        </div>
        <audio
          src={this.state.audio}
          className="audio"
          id={this.state.answer != undefined ? this.state.answer.uid + '-audio' : ''}
          type="audio/mp4"
          preload="auto"
        />
      </div>
    )
  }
}

AnswerMQ.childContextTypes = {
  muiTheme: PropTypes.object,
}

export default AnswerMQ
