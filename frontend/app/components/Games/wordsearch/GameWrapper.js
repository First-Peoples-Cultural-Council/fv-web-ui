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
import PromiseHelpers from 'common/PromiseHelpers'

/* eslint-disable */
/* Game libraries
============================================================
Note: using the inline format for expose-loader so we
don't have to configure an entry bundle just for games

https://github.com/webpack-contrib/expose-loader#inline
*/
import pixi from 'expose-loader?exposes[]=PIXI!pixi'
import p2 from 'expose-loader?exposes[]=p2!p2'
// IMPORTANT: Phaser is last
import Phaser from 'expose-loader?exposes[]=Phaser!phaser'
/* END: Game libraries
============================================================ */
/* eslint-enable */

/**
 * Test game wrapper
 */
export default class GameWrapper extends Component {
  static propTypes = {
    characters: PropTypes.array.isRequired,
    words: PropTypes.array.isRequired,
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context)
    this.gameContainer = React.createRef()
  }

  loadGameScript() {
    return PromiseHelpers.makeCancelablePromise(
      (() => {
        return new Promise((resolve, reject) => {
          import(/* webpackChunkName: "wordsearch" */ '@fpcc/fv-game-wordsearch')
            .then(({ default: wordsearch }) => {
              resolve(wordsearch)
            })
            .catch(reject)
        })
      })()
    )
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    //Setup default asset paths
    const commonImagesPath = 'games/common/images'
    const gameImagesPath = 'games/fv-games-wordsearch/images'

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */

    const gameConfig = {
      assets: {
        boot: [`${commonImagesPath}/loading.png`, `${commonImagesPath}/logo.png`],
        preload: [
          `${commonImagesPath}/background.png`,
          `${commonImagesPath}/transp.png`,
          `${commonImagesPath}/play_audio.png`,
          `${commonImagesPath}/well_done.png`,
          `${commonImagesPath}/right_arrow.png`,
          `${commonImagesPath}/left_arrow.png`,
          `${commonImagesPath}/mute.png`,
          `${commonImagesPath}/unmute.png`,
          `${commonImagesPath}/tile.png`,
          `${gameImagesPath}/cloud.png`,
          `${gameImagesPath}/title.png`,
        ],
      },
      letters: this.props.characters,
      words: this.props.words,
    }

    this.loadScriptTask = this.loadGameScript()
    this.loadScriptTask.promise.then((wordsearch) => {
      const gameContainerNode = this.gameContainer.current
      wordsearch.init(gameContainerNode, gameConfig)
      this.wordsearch = wordsearch
    })
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount() {
    if (this.loadScriptTask) {
      this.loadScriptTask.cancel()
    }
    if (this.wordsearch) {
      this.wordsearch.destroy()
    }
  }

  /**
   * Render
   */
  render() {
    //Setup game styles
    const gameContainerStyles = {
      maxWidth: 800,
      margin: 'auto',
    }

    return <div style={gameContainerStyles} ref={this.gameContainer} />
  }
}
