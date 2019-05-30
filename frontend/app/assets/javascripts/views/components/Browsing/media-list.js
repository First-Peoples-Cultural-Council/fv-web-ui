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
import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import selectn from 'selectn'

import GridList from 'material-ui/lib/grid-list/grid-list'
import GridTile from 'material-ui/lib/grid-list/grid-tile'
import UIHelpers from 'common/UIHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

const defaultStyle = { width: '100%', overflowY: 'auto', marginBottom: 24 }

const { array, func, instanceOf, number, object, oneOfType, string } = PropTypes
export default class MediaList extends Component {
  static propTypes = {
    action: func,
    cellHeight: number,
    cols: number,
    filteredItems: oneOfType([array, instanceOf(List)]),
    gridListTile: func,
    items: oneOfType([array, instanceOf(List)]),
    style: object,
    theme: string,
    type: string,
  }

  static defaultProps = {
    theme: 'explore',
    cols: 3,
    cellHeight: 210,
    style: null,
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

    return (
      <div className="media-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
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

            return (
              <GridTile
                onClick={action.bind(this, tile)}
                key={tile.uid}
                title={<a href={NavigationHelpers.generateUIDPath(this.props.theme, tile, 'media')}>{tile.title}</a>}
                titlePosition={fileTypeTilePosition}
                subtitle={
                  <span>
                    <strong>
                      {/*tile.properties['dc:description']*/}
                      {Math.round(selectn('properties.common:size', tile) * 0.001)} KB
                    </strong>
                  </span>
                }
              >
                {this._getMediaPreview(tile)}
              </GridTile>
            )
          })}
        </GridList>
      </div>
    )
  }
}
