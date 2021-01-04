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
import FVLabel from 'components/FVLabel'
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
 * Play games
 */
export default class ColouringBook extends Component {
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
          import(/* webpackChunkName: "coloringbook" */ '@fpcc/fv-game-colouring-book')
            .then(({ default: coloringbook }) => {
              resolve(coloringbook)
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
    const defaultAssetsPath = 'assets/games/fv-games-colouring-book'
    const defaultImagesPath = `${defaultAssetsPath}/images`

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */

    const gameConfig = {
      images: {
        preloaderLoading: `${defaultImagesPath}/loading.png`,
        preloaderLogo: `${defaultImagesPath}/logo.png`,
        swatch: `${defaultImagesPath}/swatch.png`,
        selected: `${defaultImagesPath}/selected.png`,
        print: `${defaultImagesPath}/print.png`,
        save: `${defaultImagesPath}/save.png`,
        picture1: `${defaultImagesPath}/picture1.png`,
        picture2: `${defaultImagesPath}/picture2.png`,
        picture3: `${defaultImagesPath}/picture3.png`,
        picture4: `${defaultImagesPath}/picture4.png`,
        thumb1: `${defaultImagesPath}/thumb1.png`,
        thumb2: `${defaultImagesPath}/thumb2.png`,
        thumb3: `${defaultImagesPath}/thumb3.png`,
        thumb4: `${defaultImagesPath}/thumb4.png`,
        background: `${defaultImagesPath}/background.png`,
      },
    }

    this.loadGameScriptTask = this.loadGameScript()
    this.loadGameScriptTask.promise.then((coloringBook) => {
      this.coloringBook = coloringBook

      /**
       * Create the game, with container and game config
       */
      debugger
      const gameContainerNode = this.gameContainer.current
      coloringBook.init(gameContainerNode, gameConfig)
    })
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for coloringbook management
   */
  componentWillUnmount() {
    if (this.coloringBook) {
      this.coloringBook.destroy()
    } else if (this.loadGameScriptTask) {
      this.loadGameScriptTask.cancel()
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

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h1>
              <FVLabel transKey="colouring_book" defaultStr="Colouring Book" transform="words" />
            </h1>
            <div style={gameContainerStyles} ref={this.gameContainer} />
          </div>
        </div>
      </div>
    )
  }
}
