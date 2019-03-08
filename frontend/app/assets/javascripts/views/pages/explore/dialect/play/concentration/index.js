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
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
import UIHelpers from 'common/UIHelpers';

import Game from './wrapper'
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Play games
 */
@provide
export default class Concentration extends Component {

    static propTypes = {
        fetchCharacters: PropTypes.func.isRequired,
        computeCharacters: PropTypes.object.isRequired,
        fetchWords: PropTypes.func.isRequired,
        computeWords: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    }

    /**
     * Constructor
     */
    constructor(props, context) {
        super(props, context);

        this._changeContent = this._changeContent.bind(this);
    }

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.fetchData(this.props, 0);
    }

    _changeContent(pageIndex, pageCount) {

        let nextPage = pageIndex + 1;

        if (pageIndex == pageCount - 1) {
            nextPage = 0;
        }

        this.fetchData(this.props, nextPage);
    }

    /**
     * Fetch list of characters
     */
    fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
        props.fetchCharacters(props.routeParams.dialect_path + '/Alphabet',
            '&currentPageIndex=0' +
            '&pageSize=100' +
            '&sortOrder=asc' +
            '&sortBy=fvcharacter:alphabet_order');

        props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
            ' AND fv:available_in_childrens_archive = 1' + 
            ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) + '/* IS NOT NULL' +
            ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) + '/* IS NOT NULL' +
            //' AND fv-word:available_in_games = 1' +
            '&currentPageIndex=' + pageIndex +
            '&pageSize=5'
        );
    }

    render() {

        let game = '';

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path + '/Dictionary',
            'entity': this.props.computeWords
        }])

        const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

        const word_array = (selectn('response.entries', computeWords) || []).map(function (word, k) {
            return {
                word: selectn('properties.dc:title', word),
                translation: selectn('properties.fv:literal_translation[0].translation', word) || selectn('properties.fv:definitions[0].translation', word),
                audio: (selectn('contextParameters.word.related_audio[0].path', word)) ? ConfGlobal.baseURL + selectn('contextParameters.word.related_audio[0].path', word) + '?inline=true' : null,
                image: UIHelpers.getThumbnail(selectn('contextParameters.word.related_pictures[0]', word), 'Thumbnail')
            };
        });

        if (word_array.length > 0) {
            game = <Game cards={word_array}/>;
        }

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="row">
                <div className="col-xs-12" style={{textAlign: 'center'}}>
                    <a href="#" onTouchTap={this._changeContent.bind(this, selectn('response.currentPageIndex', computeWords), selectn('response.pageCount', computeWords))}>Load More Words!</a>
                    {game}
                    <small>{intl.trans('views.pages.explore.dialect.play.archive_contains', 'Archive contains', 'first')} 
                    &nbsp; {selectn('response.resultsCount', computeWords)} &nbsp;
                    {intl.trans('views.pages.explore.dialect.play.words_that_met_game_requirements', 'words that met game requirements.')}
                    </small>
                </div>
            </div>
        </PromiseWrapper>;
    }

}