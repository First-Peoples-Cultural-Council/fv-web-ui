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
          import(/* webpackChunkName: "jigsaw" */ '@fpcc/fv-game-jigsaw')
            .then(({ default: jigsaw }) => {
              resolve(jigsaw)
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
    this.initJigsawGame()
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount() {
    //TODO Audit this, It seems to be firing before the component is mounted
    //This means there is probably something going on with the parent component
    this.destroyJigawGame()
  }

  componentWillReceiveProps() {
    this.initJigsawGame()
  }

  initJigsawGame() {
    //Setup default asset paths
    const defaultAssetsPath = 'assets/games/fv-games-jigsaw'
    const defaultImagesPath = `${defaultAssetsPath}/images`

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */
    const gameConfig = {
      images: Object.assign({
        preloaderLoading: `${defaultImagesPath}/loading.png`,
        preloaderLogo: `${defaultImagesPath}/logo.png`,
        backgroundImage: `${defaultImagesPath}/background.png`,
        youWin: `${defaultImagesPath}/well-done.png`,
        easy: `${defaultImagesPath}/easy.png`,
        medium: `${defaultImagesPath}/medium.png`,
        hard: `${defaultImagesPath}/hard.png`,
        cornerTopLeft: `${defaultImagesPath}/corner1a.png`,
        cornerTopRight: `${defaultImagesPath}/corner1b.png`,
        cornerBottomLeft: `${defaultImagesPath}/corner1c.png`,
        cornerBottomRight: `${defaultImagesPath}/corner1d.png`,
        arrow: `${defaultImagesPath}/blue_arrow.png`,
      }),
      words: this.props.words,
    }

    /**
     * Create the game, with container and game config
     */
    this.loadScriptTask = this.loadGameScript()
    this.loadScriptTask.promise.then((jigsaw) => {
      this.jigsaw = jigsaw
      const gameContainerNode = this.gameContainer.current
      jigsaw.init(gameContainerNode, gameConfig)
    })
  }

  destroyJigawGame() {
    if (this.jigsaw) {
      this.jigsaw.destroy()
    } else if (this.loadScriptTask) {
      this.loadScriptTask.cancel()
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
