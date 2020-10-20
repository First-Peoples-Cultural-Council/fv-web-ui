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

import NavigationHelpers from 'common/NavigationHelpers'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

import UIHelpers from 'common/UIHelpers'

const { func, object, string } = PropTypes
export class Kids extends Component {
  static propTypes = {
    portal: object.isRequired,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    properties: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const tileTitleStyle = { fontSize: '18px', marginLeft: '-16px' }
    const tileStyle = { textAlign: 'center', textTransform: 'uppercase' }

    return (
      <div>
        <div
          className="row"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundImage:
              'url("' +
              selectn(
                'response.contextParameters.portal.fv-portal:background_top_image.views[3].url',
                this.props.portal
              ) +
              '?inline=true")',
          }}
        >
          <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>
            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                border: '15px rgba(255,255,255,0) solid',
                borderRadius: '15px',
                backgroundColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <GridList
                cols={UIHelpers.isViewSize('xs') ? 1 : 2}
                cellHeight={200}
                style={{ width: '100%', overflowY: 'auto', marginBottom: 0 }}
              >
                <GridListTile
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(
                      this.props.windowPath + '/learn/words/categories',
                      this.props.pushWindowPath,
                      false
                    )
                  }}
                  key="words"
                  style={tileStyle}
                >
                  <div className={classNames('kids-image-grid-container', 'words-main')} />
                  <GridListTileBar title={<span style={tileTitleStyle}>Words</span>} />
                </GridListTile>

                <GridListTile
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(
                      `${this.props.windowPath}/learn/phrasebooks`,
                      this.props.pushWindowPath,
                      false
                    )
                  }}
                  key="phrases"
                  style={tileStyle}
                >
                  <div className={classNames('kids-image-grid-container', 'phrases-main')} />
                  <GridListTileBar title={<span style={tileTitleStyle}>Phrases</span>} />
                </GridListTile>

                <GridListTile
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(
                      this.props.windowPath + '/learn/songs-stories',
                      this.props.pushWindowPath,
                      false
                    )
                  }}
                  key="songs-stories"
                  style={tileStyle}
                >
                  <div className={classNames('kids-image-grid-container', 'songs-stories-main')} />
                  <GridListTileBar title={<span style={tileTitleStyle}>Songs and Stories</span>} />
                </GridListTile>

                <GridListTile
                  onClick={(e) => {
                    e.preventDefault()
                    NavigationHelpers.navigate(this.props.windowPath + '/play', this.props.pushWindowPath, false)
                  }}
                  key="games"
                  style={tileStyle}
                >
                  <div className={classNames('kids-image-grid-container', 'games-main')} />
                  <GridListTileBar title={<span style={tileTitleStyle}>Games</span>} />
                </GridListTile>
              </GridList>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, windowPath } = state

  const { properties } = navigation
  const { _windowPath } = windowPath

  return {
    properties,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Kids)
