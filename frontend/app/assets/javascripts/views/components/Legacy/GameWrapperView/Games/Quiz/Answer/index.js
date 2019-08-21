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
const Mui = require('@material-ui')
const PropTypes = require('prop-types')
const PubSub = require('pubsub-js')
const { RaisedButton } = Mui

// https://github.com/facebook/react/issues/3451#issuecomment-83000311
const ThemeManager = new Mui.Styles.ThemeManager()

class Answer extends React.Component {
  constructor(props) {
    super(props)

    this.eventName = 'ANSWER'

    this._handleClick = this._handleClick.bind(this)

    this.state = {}
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    }
  }

  _getStyles() {
    return {
      width: '100%',
    }
  }

  _handleClick() {
    PubSub.publish(this.eventName + ':SELECTED', this.props.data.uid)
  }

  render() {
    return (
      <div className="col-xs-6">
        <RaisedButton
          style={this._getStyles()}
          primary={this.props.selected}
          onClick={this._handleClick}
          label={this.props.data ? this.props.data['dc:title'] : 'Loading...'}
        />
      </div>
    )
  }
}

Answer.childContextTypes = {
  muiTheme: PropTypes.object,
}

export default Answer
