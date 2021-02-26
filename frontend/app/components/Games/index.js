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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'
import FVLabel from 'components/FVLabel'

/**
 * Play games
 */
const { array, func, object } = PropTypes
export class Play extends Component {
  static propTypes = {
    routeParams: object,
    // REDUX: reducers/state
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  navigate = (event) => {
    event.preventDefault()
    const anchorPath = event.currentTarget.getAttribute('href')
    NavigationHelpers.navigateForward(this.props.splitWindowPath, [anchorPath], this.props.pushWindowPath)
  }

  render() {
    const isKidsTheme = this.props.routeParams.siteTheme === 'kids'

    const cellStyle = {
      border: '1px solid #000',
    }
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h1 className={classNames({ hidden: isKidsTheme })}>
              <FVLabel transKey="games" defaultStr="Games" transform="first" />
            </h1>
            <div className="flex-container">
              <div className="grid">
                <div className="cell" style={cellStyle}>
                  <a href="jigsaw" onClick={this.navigate}>
                    <img src="assets/games/fv-games-jigsaw/images/preview.png" className="responsive-image" />
                  </a>
                </div>
                <div className="cell" style={cellStyle}>
                  <a href="wordsearch" onClick={this.navigate}>
                    <img src="assets/games/fv-games-wordsearch/images/preview.png" className="responsive-image" />
                  </a>
                </div>
                <div className="cell" style={cellStyle}>
                  <a href="wordscramble" onClick={this.navigate}>
                    <img src="assets/games/fv-games-wordscramble/images/preview.png" className="responsive-image" />
                  </a>
                </div>
                <div className="cell" style={cellStyle}>
                  <a href="parachute" onClick={this.navigate}>
                    <img src="assets/games/fv-games-hangman/images/preview.png" className="responsive-image" />
                  </a>
                </div>
                <div className="cell" style={cellStyle}>
                  <a href="concentration" onClick={this.navigate}>
                    <img src="assets/games/fv-games-memory/images/preview.png" className="responsive-image" />
                  </a>
                </div>
                <div className="cell" style={cellStyle}>
                  <a href="quiz" onClick={this.navigate}>
                    <img src="assets/games/fv-games-quiz/images/preview.png" className="responsive-image" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { windowPath } = state

  const { splitWindowPath } = windowPath

  return {
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Play)
