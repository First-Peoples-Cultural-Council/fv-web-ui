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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WordsearchGame from 'games/wordsearch';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
* Test game wrapper
*/
export default class Game extends Component {

  static propTypes = {
    characters: PropTypes.array.isRequired,
    words: PropTypes.array.isRequired
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
    this.gameContainer = null;
  }

  /**
   * componentDidMount
   */
  componentDidMount () {

    //Setup default asset paths
    const defaultAssetsPath = '/assets/games/wordsearch/assets';
    const defaultLibsPath = `${defaultAssetsPath}/libs`;
    const defaultImagesPath = `${defaultAssetsPath}/images`;

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */

    let gameConfig = {

        libs:{
            wordFindScript:`${defaultLibsPath}/wordfind.js`        
        },

        images:{
          preloaderLoading:`${defaultImagesPath}/loading.png`,
          preloaderLogo:`${defaultImagesPath}/logo.png`,
          tile:`${defaultImagesPath}/tile.png`,
          title:`${defaultImagesPath}/title.png`,
          playAudio:`${defaultImagesPath}/play_audio.png`,
          background:`${defaultImagesPath}/background.png`
        },
        
        letters: this.props.characters,

        words: this.props.words

    };


    /**
     * Create the game, with container and game config
     */
    const gameContainerNode = ReactDOM.findDOMNode(this.gameContainer);
    WordsearchGame.init(gameContainerNode, gameConfig);
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount () {
      WordsearchGame.destroy();
  }

  /**
   * Render
   */
  render() {

    //Setup game styles
    const gameContainerStyles = {
      maxWidth:800,
      margin:'auto'
    }

    return <div style={gameContainerStyles} ref={(el)=>{this.gameContainer = el}}></div>;
  }
}