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

/**
 * Test game wrapper
 */
export default class GameWrapper extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
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
          import(/* webpackChunkName: "memory" */ '@fpcc/fv-game-memory')
            .then(({ default: memory }) => {
              resolve(memory)
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
    const defaultAssetsPath = 'assets/games/fv-games-memory/'
    const defaultImagesPath = `${defaultAssetsPath}/images`

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */

    const gameConfig = {
      images: {
        preloaderLoading: `${defaultImagesPath}/loading.png`,
        preloaderLogo: `${defaultImagesPath}/logo.png`,
        background: `${defaultImagesPath}/background.png`,
        card: `${defaultImagesPath}/card.png`,
        cardFlipped: `${defaultImagesPath}/card_flipped.png`,
        wellDone: `${defaultImagesPath}/well-done.png`,
        title: `${defaultImagesPath}/title.png`,
        time: `${defaultImagesPath}/time.png`,
      },

      cards: this.props.cards,
    }

    /**
     * Create the game, with container and game config
     */
    this.loadGameScriptTask = this.loadGameScript()
    this.loadGameScriptTask.promise.then((memory) => {
      this.memory = memory
      const gameContainerNode = this.gameContainer.current
      memory.init(gameContainerNode, gameConfig)
    })
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount() {
    if (this.memory) {
      this.memory.destroy()
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

    return <div style={gameContainerStyles} ref={this.gameContainer} />
  }
}
