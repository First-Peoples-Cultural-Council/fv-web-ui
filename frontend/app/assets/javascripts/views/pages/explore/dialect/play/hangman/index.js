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
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Immutable, {List, Map} from 'immutable';

import HangManGame from './hangman';

import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const PUZZLES = 25;

@provide
export default class Hangman extends Component {

    static propTypes = {
        fetchCharacters: PropTypes.func.isRequired,
        computeCharacters: PropTypes.object.isRequired,
        fetchWords: PropTypes.func.isRequired,
        computeWords: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentPuzzleIndex: 0
        }

        this.newPuzzle = this.newPuzzle.bind(this);
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
        props.fetchCharacters(props.routeParams.dialect_path + '/Alphabet',
            '&currentPageIndex=0' +
            '&pageSize=100' +
            '&sortOrder=asc' +
            '&sortBy=fvcharacter:alphabet_order');

        props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
            //' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +'/* IS NOT NULL' +
            ' AND fv:available_in_childrens_archive = 1' + 
            ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) + '/* IS NOT NULL' +
            //' AND fv-word:available_in_games = 1' +
            '&currentPageIndex=' + StringHelpers.randomIntBetween(0, 10) +
            '&pageSize=' + PUZZLES
        );
    }

    newPuzzle() {

        const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

        if (this.state.currentPuzzleIndex < PUZZLES && this.state.currentPuzzleIndex < selectn('response.resultsCount', computeWords) - 1) {
            this.setState({
                currentPuzzleIndex: this.state.currentPuzzleIndex + 1
            });
        } else {
            this.fetchData(this.props);
            this.setState({
                currentPuzzleIndex: 0
            });
        }

    }

    /**
     * Render
     */
    render() {

        let game = '';

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path + '/Alphabet',
            'entity': this.props.computeCharacters
        },
            {
                'id': this.props.routeParams.dialect_path + '/Dictionary',
                'entity': this.props.computeWords
            }])

        const computeCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, this.props.routeParams.dialect_path + '/Alphabet');
        const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

        // For now, don't use built in alphabets as most are incomplete
        /*const alphabet_array = (selectn('response.entries', computeCharacters) || []).map(function(char) {
          return selectn('properties.dc:title', char);
        });*/

        const word_array = (selectn('response.entries', computeWords) || []).map(function (word, k) {
            return {
                puzzle: selectn('properties.dc:title', word),
                translation: selectn('properties.fv:literal_translation[0].translation', word) || selectn('properties.fv:definitions[0].translation', word),
                audio: ConfGlobal.baseURL + selectn('contextParameters.word.related_audio[0].path', word) + '?inline=true'
            };
        });

        const word_obj_array = selectn('response.entries', computeWords);

        if (word_array.length > 0) {

            //Since the alphabet isn't complete, we need fill in the rest
            const character_string = word_array.map((word) => word.puzzle).join('');
            const unique_characters = Array.from(new Set(character_string.split(/(?!$)/u))).filter((v) => v != ' ');

            word_array[this.state.currentPuzzleIndex]['alphabet'] = unique_characters; // (alphabet_array.length > 0) ? alphabet_array :
            game = <HangManGame newPuzzle={this.newPuzzle} {...word_array[this.state.currentPuzzleIndex]} />
        }

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="hangman-game">
                {game}
            </div>
        </PromiseWrapper>;
    }

}