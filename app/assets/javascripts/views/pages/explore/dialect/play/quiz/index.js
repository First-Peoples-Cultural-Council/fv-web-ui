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
import Immutable, {List, Map} from 'immutable';

import classNames from 'classnames';

import {IconButton, RaisedButton, LinearProgress} from 'material-ui';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';
import StringHelpers from 'common/StringHelpers';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const containerStyle = {
    background: 'url(/assets/games/wordscramble/assets/images/background.png)',
    backgroundSize: 'cover',
    padding: '10px',
    display: 'block',
    border: '3px solid #040000',
    marginBottom: '20px',
    position: 'relative',
    maxWidth: '800px',
    margin: 'auto'
}

class Answer extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {data, selected, correct, disabled} = this.props;

        let backgroundColor = '#fff';
        let labelColor = '#000';

        if (selected) {
            backgroundColor = 'orange';

            if (correct) {
                labelColor = '#fff';
                backgroundColor = 'green';
            }
        }

        return <div className="col-xs-6">
            <RaisedButton style={{'width': '100%'}} labelColor={labelColor} disabled={disabled}
                          backgroundColor={backgroundColor} onTouchTap={this.props.onSelect.bind(this, data, correct)}
                          label={(data) ? selectn('word', data) : 'Loading...'}/>
        </div>;
    }
}

@provide
export default class Quiz extends Component {

    static propTypes = {
        fetchWords: PropTypes.func.isRequired,
        computeWords: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        ['_handleNavigate', '_handleAnswerSelected', '_restart'].forEach((method => this[method] = this[method].bind(this)));

        this.state = this.getDefaultState();
    }

    getDefaultState() {

        let totalQuestions = 10;

        // Create a random list of numbers to serve as the word order for all answers (correct or wrong)
        const randomizeNumbers = new List([...Array(totalQuestions * 5).keys()]).sortBy(() => Math.random())

        // First 10 of random numbers will be questions
        const questionsOrder = randomizeNumbers.slice(0, totalQuestions);

        return {
            totalQuestions: totalQuestions,
            nowPlaying: null,
            questionsOrder: questionsOrder,
            fillerAnswers: new List(),
            answersOrder: Array.from({length: totalQuestions}, () => Math.floor(Math.random() * 4)), // For each question determine random position of answer
            selectedAnswers: new Map(),
            currentAnswerIndex: 0,
            attempts: 0
        }
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
        props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
            ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) + '/* IS NOT NULL' +
            ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) + '/* IS NOT NULL' +
            //' AND fv-word:available_in_games = 1 ' +
            '&currentPageIndex=' + StringHelpers.randomIntBetween(0, 10) +
            '&pageSize=50'
        );
    }

    componentWillReceiveProps(nextProps) {
        const prevComputeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');
        const nextComputeWords = ProviderHelpers.getEntry(nextProps.computeWords, nextProps.routeParams.dialect_path + '/Dictionary');

        if (nextComputeWords && selectn('response', nextComputeWords) != selectn('response', prevComputeWords)) {
            let resultCount = selectn('response.resultsCount', nextComputeWords);

            // Account for results being less than 10
            if (resultCount > 0 && resultCount < 50) {
                const randomizeNumbers = new List([...Array(resultCount).keys()]).sortBy(() => Math.random())

                let totalQuestions = Math.ceil(resultCount / 5);

                this.setState({
                    totalQuestions: totalQuestions,
                    questionsOrder: randomizeNumbers.slice(0, totalQuestions),
                    answersOrder: Array.from({length: totalQuestions}, () => Math.floor(Math.random() * 4))
                })
            }
        }
    }


    _restart(e) {

        UIHelpers.stopAudio(this.state, function (state) {
            this.setState(state);
        }.bind(this), e);

        this.setState(this.getDefaultState());
        this.fetchData(this.props);
    }

    _handleAnswerSelected(word, correct, e) {

        if (correct) {
            UIHelpers.playAudio(this.state, function (state) {
                this.setState(state);
            }.bind(this), selectn('audio', word), e);
        }

        this.setState({
            attempts: this.state.attempts + 1,
            selectedAnswers: this.state.selectedAnswers.set(this.state.currentAnswerIndex, new Map({
                word: word,
                correct: correct
            }))
        });
    }

    _handleNavigate(direction, e) {

        UIHelpers.stopAudio(this.state, function (state) {
            this.setState(state);
        }.bind(this), e);

        let newIndex;

        if (direction == 'next')
            newIndex = this.state.currentAnswerIndex + 1;
        else
            newIndex = this.state.currentAnswerIndex - 1;

        if (newIndex <= (this.state.totalQuestions - 1) && newIndex >= 0) {
            this.setState({
                currentAnswerIndex: newIndex
            });
        }
    }

    _normalizeWord(wordObj) {
        return {
            uid: selectn('uid', wordObj),
            word: selectn('properties.dc:title', wordObj),
            translation: selectn('properties.fv:literal_translation[0].translation', wordObj) || selectn('properties.fv:definitions[0].translation', wordObj),
            audio: ConfGlobal.baseURL + selectn('contextParameters.word.related_audio[0].path', wordObj) + '?inline=true',
            image: UIHelpers.getThumbnail(selectn('contextParameters.word.related_pictures[0]', wordObj), 'Medium')
        };
    }

    render() {

        let selectedAnswer = null;
        let questions = new List();
        let fillerAnswers = new List();
        let answers = [];

        let isCorrect = false;

        // All correct answers
        let correctAnswers = this.state.selectedAnswers.filter((v, k) => v.get('correct'));

        // Answer has been selected
        let isSelected = this.state.selectedAnswers.has(this.state.currentAnswerIndex);

        // Quiz complete
        let isComplete = correctAnswers.count() === this.state.totalQuestions;

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path + '/Dictionary',
            'entity': this.props.computeWords
        }])

        const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

        // Seperate all correct answers from all wrong answers
        (selectn('response.entries', computeWords) || []).forEach(function (v, i) {
            // If word is a correct answer
            if (this.state.questionsOrder.includes(i)) {
                questions = questions.push(this._normalizeWord(v));
            }
            // If word is a wrong answer
            else {
                fillerAnswers = fillerAnswers.push(this._normalizeWord(v));
            }
        }.bind(this));

        // Generate 4 answers
        if (questions.size > 0) {
            for (let i = 0; i < 4; ++i) {
                let answer, isAnswerCorrect, isSelectedAnswer;

                // Seperate correct answer from wrong answer
                if (i === this.state.answersOrder[this.state.currentAnswerIndex]) {
                    answer = questions.get(this.state.currentAnswerIndex);
                    isAnswerCorrect = true;
                } else {
                    let key = i + (this.state.currentAnswerIndex * 3);

                    if (!fillerAnswers.has(key)) {
                        key = i;
                    }

                    answer = fillerAnswers.get(key);
                    isAnswerCorrect = false;
                }

                // Get current answer if it is selected
                isSelectedAnswer = isSelected && selectn('uid', this.state.selectedAnswers.get(this.state.currentAnswerIndex).get('word')) === selectn('uid', answer);

                // Check if current selected answer is correct
                if (isSelectedAnswer) {

                    selectedAnswer = answer;

                    if (isAnswerCorrect) {
                        isCorrect = true;
                    }
                }

                answers.push(<Answer onSelect={this._handleAnswerSelected} selected={isSelectedAnswer}
                                     key={i + selectn('uid', answer)} data={answer} correct={isAnswerCorrect}/>);
            }
        }

        // Show skill level message based on attempts.
        let skillLevel = '';

        if (this.state.attempts == this.state.totalQuestions) {
            skillLevel = intl.trans('views.pages.explore.dialect.play.quiz.looks_like_your_an_expert', 'Looks like you\'re an expert!');
        } else if (this.state.attempts > this.state.totalQuestions && this.state.attempts < (this.state.totalQuestions * 2)) {
            skillLevel = intl.trans('views.pages.explore.dialect.play.quiz.on_your_way_to_becoming_an_expert', 'On your way to becoming an expert!');
        }

        return <div className="quiz-container" style={{margin: '15px 0'}}>

            <div style={containerStyle}>

                <div className="row">
                    <div className="col-xs-12">
                        <LinearProgress style={{height: '15px'}} mode="determinate"
                                        value={((this.state.currentAnswerIndex + 1) / this.state.totalQuestions) * 100}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div className="imgCont" style={{textAlign: 'center'}}>

                            {(isComplete) ? <div className={classNames('alert', 'alert-success')} style={{
                                marginTop: '15px',
                                padding: '0'
                            }}>{intl.trans('views.pages.explore.dialect.play.quiz.completed_this_quiz', 'Nice! You\'ve completed this quiz!')} {skillLevel}
                                <RaisedButton onTouchTap={this._restart}
                                              label={intl.trans('views.pages.explore.dialect.play.quiz.new_quiz', 'New Quiz', 'words')}
                                              style={{marginLeft: '10px'}}/></div> : ''}

                            <img className="image" src={selectn('image', questions.get(this.state.currentAnswerIndex))}
                                 alt={selectn('title', questions.get(this.state.currentAnswerIndex))}/>

                            {(questions.size > 0) ? '' :
                                <div style={{marginTop: '15px'}}><strong>Loading...</strong></div>}

                        </div>
                    </div>
                </div>

                <div className={classNames('row', 'row-answers')}>
                    {answers.map((answer, i) => {
                        return (isCorrect && !answer.props.correct) ? React.cloneElement(answer, {
                            disabled: true,
                            key: i
                        }) : answer
                    })}
                </div>

                <div className={classNames('row', 'row-navigation')}>

                    <div className={classNames('col-xs-2', 'text-left')}>
                        <IconButton style={{backgroundColor: '#ffffff'}}
                                    onTouchTap={this._handleNavigate.bind(this, 'previous')}
                                    iconClassName="material-icons"
                                    tooltip={intl.trans('views.pages.explore.dialect.play.quiz.previous_question', 'Previous Question', 'words')}>
                        chevron_left
                        </IconButton>
                    </div>

                    <div className={classNames('col-xs-8', 'text-center')}>
                        <div style={{width: '90%', margin: '10px auto', padding: '5px'}}
                             className={classNames('alert', {
                                 'alert-success': isCorrect,
                                 'alert-warning': !isCorrect,
                                 'hidden': !isSelected
                             })}>{(isSelected) ? (isCorrect) ?
                            <div>{intl.trans('good_job', 'Good Job', 'words')}! <strong>{selectn('word', selectedAnswer)}</strong> {intl.trans('translates_to', 'translates to')}
                                <strong>{selectn('translation', selectedAnswer)}</strong>
                            </div> : intl.trans('try_again', 'Try again', 'first') + '...' : ''}</div>
                    </div>

                    <div className={classNames('col-xs-2', 'text-right')}>
                        <IconButton style={{backgroundColor: '#ffffff'}}
                                    onTouchTap={this._handleNavigate.bind(this, 'next')}
                                    disabled={!isCorrect || isComplete}
                                    iconClassName="material-icons"
                                    tooltip={intl.trans('views.pages.explore.dialect.play.quiz.next_question', 'Next Question', 'words')}>
                        chevron_right
                        </IconButton>
                    </div>

                </div>

                <div className={classNames('row', 'hidden-xs')} style={{textAlign: 'center'}}>
                    <span style={{
                        padding: '5px',
                        borderRadius: '2px',
                        color: '#fff',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>{intl.trans('questions', 'Questions', 'first')}: {this.state.currentAnswerIndex + 1} / <strong>{this.state.totalQuestions}</strong></span>
                </div>

            </div>

        </div>
    }
}