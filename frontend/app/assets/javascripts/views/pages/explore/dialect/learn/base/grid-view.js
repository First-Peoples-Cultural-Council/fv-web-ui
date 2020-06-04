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
import classNames from 'classnames'

import NavigationHelpers from 'common/NavigationHelpers'

// import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'

import AVPlayArrow from '@material-ui/icons/PlayArrow'
import AVStop from '@material-ui/icons/Stop'

import UIHelpers from 'common/UIHelpers'
import { connect } from 'react-redux'
// const WhiteAVPlayArrow = withStyles({
//   root: {
//     color: 'white'
//   }
// })(AVPlayArrow)

// const WhiteAVStop = withStyles({
//   root: {
//     color: 'white'
//   }
// })(AVStop)
class GridView extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    action: PropTypes.func,
    cols: PropTypes.number,
    type: PropTypes.string,
    gridListTile: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    cols: 4,
    cellHeight: 160,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      nowPlaying: null,
    }
  }
  componentWillUnmount() {
    if (this.state.nowPlaying != null) {
      this.state.nowPlaying.pause()
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.currentTime = 0
    }
  }

  render() {
    const items = this.props.filteredItems || this.props.items
    let single = ''

    switch (this.props.type) {
      case 'FVWord':
        single = this.props.intl.trans('word', 'word', 'lower')
        break

      case 'FVPhrase':
        single = this.props.intl.trans('phrase', 'phrase', 'lower')
        break
      default: // Note: do nothing
    }

    const gridListStyle = this.props.style || { width: '100%', overflowY: 'auto', marginBottom: 24 }

    return (
      <div className={classNames('grid-view', this.props.className)}>
        <GridList
          // eslint-disable-next-line no-nested-ternary
          cols={UIHelpers.isViewSize('xs') ? (this.props.type === 'FVPhrase' ? 1 : 2) : this.props.cols}
          cellHeight={this.props.cellHeight}
          style={gridListStyle}
        >
          {items.map(
            function itemsMap(tile, i) {
              // NOTE: Returns `props.gridListTile` if defined
              if (this.props.gridListTile) {
                return React.createElement(this.props.gridListTile, { key: i, tile: tile, action: this.props.action })
              }

              let audioIcon
              let audioCallback = null
              let definitionsHTML
              let literal_translationsHTML

              const title = selectn('properties.dc:title', tile)
              const definitions = selectn('properties.fv:definitions', tile)
              const literal_translations = selectn('properties.fv:literal_translation', tile)

              const audio = selectn('contextParameters.' + single + '.related_audio[0].path', tile)
              const imageObj = selectn('contextParameters.' + single + '.related_pictures[0]', tile)

              if (audio) {
                const stateFunc = function stateFuncBing(state) {
                  this.setState(state)
                }.bind(this)

                audioIcon =
                  decodeURIComponent(selectn('src', this.state.nowPlaying)) !==
                  NavigationHelpers.getBaseURL() + audio ? (
                    <AVPlayArrow color="white" />
                  ) : (
                    <AVStop color="white" />
                  )
                audioCallback =
                  decodeURIComponent(selectn('src', this.state.nowPlaying)) !== NavigationHelpers.getBaseURL() + audio
                    ? UIHelpers.playAudio.bind(this, this.state, stateFunc, NavigationHelpers.getBaseURL() + audio)
                    : UIHelpers.stopAudio.bind(this, this.state, stateFunc)
              }

              if (definitions && definitions.length > 0) {
                definitionsHTML = definitions.map(function definitionsMap(definition, key) {
                  return (
                    <span key={key} style={{ whiteSpace: 'initial' }}>
                      {selectn('translation', definition)}
                    </span>
                  )
                })
              }

              if (literal_translations && literal_translations.length > 0) {
                literal_translationsHTML = literal_translations.map(function literalTranslationsMap(definition, key) {
                  return (
                    <span key={key} style={{ whiteSpace: 'initial' }}>
                      {selectn('translation', definition)}
                    </span>
                  )
                })
              }

              const audioIconAction = (
                <IconButton
                  style={{ marginRight: '10px' }}
                  // iconStyle={{ width: '40px', height: '40px' }}
                  onClick={audioCallback}
                >
                  {audioIcon}
                </IconButton>
              )

              return (
                <GridListTile
                  onClick={this.props.action ? this.props.action.bind(this, tile.uid, tile) : audioCallback}
                  key={i}
                >
                  <img src={UIHelpers.getThumbnail(imageObj, 'Small')} alt={title} />
                  <GridListTileBar
                    title={title}
                    style={{ backgroundColor: 'rgba(180, 0, 0, 0.75)' }}
                    actionPosition="right"
                    actionIcon={this.props.action ? audioIconAction : audioIcon}
                    subtitle={definitionsHTML || literal_translationsHTML}
                  />
                </GridListTile>
              )
            }.bind(this)
          )}
        </GridList>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { locale } = state
  const { intlService } = locale

  return {
    intl: intlService,
  }
}

export default connect(mapStateToProps)(GridView)
