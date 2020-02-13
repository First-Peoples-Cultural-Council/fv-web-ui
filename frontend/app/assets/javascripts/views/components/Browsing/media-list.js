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
import { List } from 'immutable'
import selectn from 'selectn'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

import UIHelpers from 'common/UIHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

const defaultStyle = { width: '100%', overflowY: 'auto', marginBottom: 24 }

const { array, bool, func, instanceOf, number, object, oneOfType, string } = PropTypes
export class MediaList extends Component {
  static propTypes = {
    action: func,
    cellHeight: number,
    cols: number,
    filteredItems: oneOfType([array, instanceOf(List)]),
    gridListTile: func,
    items: oneOfType([array, instanceOf(List)]),
    isFetching: bool,
    style: object,
    siteTheme: string,
    type: string,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    siteTheme: 'explore',
    cols: 3,
    cellHeight: 210,
    style: null,
    isFetching: false,
  }

  constructor(props, context) {
    super(props, context)
  }

  _getMediaPreview(tile) {
    switch (selectn('type', tile)) {
      case 'FVAudio':
        return (
          <audio
            style={{ height: '98px' }}
            src={selectn('properties.file:content.data', tile)}
            preload="none"
            controls
          />
        )

      case 'FVPicture':
        return (
          <img
            src={
              selectn('picture:views[1].content.data', tile.properties) || selectn('file:content.data', tile.properties)
            }
          />
        )

      case 'FVVideo':
        return <video height={190} src={selectn('properties.file:content.data', tile)} preload="none" controls />
      default:
        return ''
    }
  }

  render() {
    // let fileTypeCellHeight = this.props.cellHeight
    let fileTypeTilePosition = 'bottom'
    const items = this.props.filteredItems || this.props.items

    switch (this.props.type) {
      case 'FVAudio':
        // fileTypeCellHeight = 100
        fileTypeTilePosition = 'top'
        break

      case 'FVVideo':
        fileTypeTilePosition = 'top'
        break
      default: // NOTE: do nothing
    }

    // if (selectn('length', items) === 0) {
    //   return <div style={{margin: '20px 0'}}>No results found.</div>;
    // }

    // If action is not defined
    let action

    if (this.props.hasOwnProperty('action') && typeof this.props.action === 'function') {
      action = this.props.action
    } else {
      action = () => {}
    }

    if (this.props.isFetching === true) {
      return <div className="media-list" />
    }
    return (
      <div
        data-testid="MediaList"
        className="media-list"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
      >
        <GridList
          cols={UIHelpers.isViewSize('xs') ? 2 : this.props.cols}
          cellHeight={this.props.cellHeight}
          style={Object.assign(defaultStyle, this.props.style)}
        >
          {(items || []).map((tile) => {
            if (this.props.gridListTile) {
              return React.createElement(this.props.gridListTile, {
                key: tile.uid,
                tile: tile,
                action: action,
                preview: this._getMediaPreview(tile),
                titlePosition: fileTypeTilePosition,
              })
            }
            // NOTE: is `size` a string? should it be cast via Number(size)?
            const size = selectn('properties.common:size', tile)
            const subtitle = size ? (
              <span>
                <strong>{`${Math.round(size * 0.001)} KB`}</strong>
              </span>
            ) : null

            const href = NavigationHelpers.generateUIDPath(this.props.siteTheme, tile, 'media')
            return (
              <GridListTile onClick={action.bind(this, tile)} key={tile.uid} aria-label={tile.title}>
                {this._getMediaPreview(tile)}
                <GridListTileBar
                  title={
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault()
                        NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
                      }}
                    >
                      {tile.title}
                    </a>
                  }
                  titlePosition={fileTypeTilePosition}
                  subtitle={subtitle}
                />
              </GridListTile>
            )
          })}
        </GridList>
      </div>
    )
  }
}

// REDUX: reducers/state
// const mapStateToProps = (state /*, ownProps*/) => {
//   const { windowPath } = state
//   const { splitWindowPath } = windowPath

//   return {
//     splitWindowPath,
//   }
// }

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(null, mapDispatchToProps)(MediaList)
