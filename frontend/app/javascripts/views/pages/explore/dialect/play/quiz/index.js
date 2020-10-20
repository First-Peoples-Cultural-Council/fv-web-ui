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
import { List, Map } from 'immutable'

import classNames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tooltip from '@material-ui/core/Tooltip'

import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

import FVButton from 'views/components/FVButton'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchWords } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'
import FVLabel from 'views/components/FVLabel/index'

const containerStyle = {
  background: 'url(/assets/games/fv-games-wordscramble/images/background.png)',
  backgroundSize: 'cover',
  padding: '10px',
  display: 'block',
  border: '3px solid #040000',
  marginBottom: '20px',
  position: 'relative',
  maxWidth: '800px',
  margin: 'auto',
}
const { any, bool, func, object } = PropTypes
class Answer extends React.Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    data: any, // TODO: SET CORRECT PROPTYPE
    selected: any, // TODO: SET CORRECT PROPTYPE
    correct: any, // TODO: SET CORRECT PROPTYPE
    disabled: bool,
    onSelect: func,
  }

  render() {
    const { data, selected, correct, disabled } = this.props

    let backgroundColor = '#fff'
    let labelColor = '#000'

    if (selected) {
      backgroundColor = 'orange'

      if (correct) {
        labelColor = '#fff'
        backgroundColor = 'green'
      }
    }

    return (
      <div className="col-xs-6">
        <button
          className="_btn _btn--secondary QuizAnswer__btn"
          style={{ color: labelColor, backgroundColor: backgroundColor }}
          disabled={disabled}
          onClick={this.props.onSelect.bind(this, data, correct)}
        >
          {data ? selectn('word', data) : 'Loading...'}
        </button>
      </div>
    )
  }
}

export class Quiz extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeWords: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchWords: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    ;['_handleNavigate', '_handleAnswerSelected', '_restart', '_changeContent'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )

    this.state = this.getDefaultState()
  }

  getDefaultState() {
    const totalQuestions = 10

    // Create a random list of numbers to serve as the word order for all answers (correct or wrong)
    const randomizeNumbers = new List([...Array(totalQuestions * 5).keys()]).sortBy(() => Math.random())

    // First 10 of random numbers will be questions
    const questionsOrder = randomizeNumbers.slice(0, totalQuestions)

    return {
      totalQuestions: totalQuestions,
      nowPlaying: null,
      questionsOrder: questionsOrder,
      fillerAnswers: new List(),
      answersOrder: Array.from({ length: totalQuestions }, () => Math.floor(Math.random() * 4)), // For each question determine random position of answer
      selectedAnswers: new Map(),
      currentAnswerIndex: 0,
      attempts: 0,
    }
  }

  componentDidMount() {
    this.fetchData(this.props, 0)
  }

  _changeContent(pageIndex, pageCount) {
    let nextPage = pageIndex + 1

    if (pageIndex === pageCount - 1) {
      nextPage = 0
    }

    this.fetchData(this.props, nextPage)
  }

  fetchData(props, pageIndex /*, pageSize, sortOrder, sortBy*/) {
    props.fetchWords(
      props.routeParams.dialect_path + '/Dictionary',
      ' AND fv:available_in_childrens_archive = 1' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_pictures', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        ' AND ' +
        ProviderHelpers.switchWorkspaceSectionKeys('fv:related_audio', this.props.routeParams.area) +
        '/* IS NOT NULL' +
        //' AND fv-word:available_in_games = 1 ' +
        '&currentPageIndex=' +
        pageIndex +
        '&pageSize=50'
    )
  }

  componentWillReceiveProps(nextProps) {
    const prevComputeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )
    const nextComputeWords = ProviderHelpers.getEntry(
      nextProps.computeWords,
      nextProps.routeParams.dialect_path + '/Dictionary'
    )

    if (nextComputeWords && selectn('response', nextComputeWords) != selectn('response', prevComputeWords)) {
      const resultCount = selectn('response.resultsCount', nextComputeWords)

      // Account for results being less than 10
      if (resultCount > 0 && resultCount < 50) {
        const randomizeNumbers = new List([...Array(resultCount).keys()]).sortBy(() => Math.random())

        const totalQuestions = Math.ceil(resultCount / 5)

        this.setState({
          totalQuestions: totalQuestions,
          questionsOrder: randomizeNumbers.slice(0, totalQuestions),
          answersOrder: Array.from({ length: totalQuestions }, () => Math.floor(Math.random() * 4)),
        })
      }
    }
  }

  _restart(e) {
    UIHelpers.stopAudio(
      this.state,
      function stopAudioState(state) {
        this.setState(state)
      }.bind(this),
      e
    )

    this.setState(this.getDefaultState())
    this.fetchData(this.props, 0)
  }

  _handleAnswerSelected(word, correct, e) {
    if (correct) {
      UIHelpers.playAudio(
        this.state,
        function playAudioState(state) {
          this.setState(state)
        }.bind(this),
        selectn('audio', word),
        e
      )
    }

    this.setState({
      attempts: this.state.attempts + 1,
      selectedAnswers: this.state.selectedAnswers.set(
        this.state.currentAnswerIndex,
        new Map({
          word: word,
          correct: correct,
        })
      ),
    })
  }

  _handleNavigate(direction, e) {
    UIHelpers.stopAudio(
      this.state,
      function stopAudioState(state) {
        this.setState(state)
      }.bind(this),
      e
    )

    let newIndex

    if (direction === 'next') newIndex = this.state.currentAnswerIndex + 1
    else newIndex = this.state.currentAnswerIndex - 1

    if (newIndex <= this.state.totalQuestions - 1 && newIndex >= 0) {
      this.setState({
        currentAnswerIndex: newIndex,
      })
    }
  }

  _normalizeWord(wordObj) {
    return {
      uid: selectn('uid', wordObj),
      word: selectn('properties.dc:title', wordObj),
      translation:
        selectn('properties.fv:literal_translation[0].translation', wordObj) ||
        selectn('properties.fv:definitions[0].translation', wordObj),
      audio:
        NavigationHelpers.getBaseURL() +
        selectn('contextParameters.word.related_audio[0].path', wordObj) +
        '?inline=true',
      image: UIHelpers.getThumbnail(selectn('contextParameters.word.related_pictures[0]', wordObj), 'Medium'),
    }
  }

  render() {
    let selectedAnswer = null
    let questions = new List()
    let fillerAnswers = new List()
    const answers = []

    let isCorrect = false

    // All correct answers
    const correctAnswers = this.state.selectedAnswers.filter((v) => v.get('correct'))

    // Answer has been selected
    const isSelected = this.state.selectedAnswers.has(this.state.currentAnswerIndex)

    // Quiz complete
    const isComplete = correctAnswers.count() === this.state.totalQuestions

    const computeWords = ProviderHelpers.getEntry(
      this.props.computeWords,
      this.props.routeParams.dialect_path + '/Dictionary'
    )

    if (selectn('response.resultsCount', computeWords) < 40) {
      return (
        <div>
          Game not available: At least 40 child-friendly words with photos and audio are required for this game... Found{' '}
          <strong>{selectn('response.resultsCount', computeWords)}</strong> words.
        </div>
      )
    }

    // Seperate all correct answers from all wrong answers
    (selectn('response.entries', computeWords) || []).forEach(
      function computeWordForEach(v, i) {
        // If word is a correct answer
        if (this.state.questionsOrder.includes(i)) {
          questions = questions.push(this._normalizeWord(v))
        } else {
          // If word is a wrong answer
          fillerAnswers = fillerAnswers.push(this._normalizeWord(v))
        }
      }.bind(this)
    )

    // Generate 4 answers
    if (questions.size > 0) {
      for (let i = 0; i < 4; ++i) {
        let answer
        let isAnswerCorrect
        let isSelectedAnswer

        // Seperate correct answer from wrong answer
        if (i === this.state.answersOrder[this.state.currentAnswerIndex]) {
          answer = questions.get(this.state.currentAnswerIndex)
          isAnswerCorrect = true
        } else {
          let key = i + this.state.currentAnswerIndex * 3

          if (!fillerAnswers.has(key)) {
            key = i
          }

          answer = fillerAnswers.get(key)
          isAnswerCorrect = false
        }

        // Get current answer if it is selected
        // eslint-disable-next-line
        isSelectedAnswer =
          isSelected &&
          selectn('uid', this.state.selectedAnswers.get(this.state.currentAnswerIndex).get('word')) ===
            selectn('uid', answer)

        // Check if current selected answer is correct
        if (isSelectedAnswer) {
          selectedAnswer = answer

          if (isAnswerCorrect) {
            isCorrect = true
          }
        }

        answers.push(
          <Answer
            onSelect={this._handleAnswerSelected}
            selected={isSelectedAnswer}
            key={i + selectn('uid', answer)}
            data={answer}
            correct={isAnswerCorrect}
          />
        )
      }
    }

    // Show skill level message based on attempts.
    let skillLevel = ''

    if (this.state.attempts == this.state.totalQuestions) {
      skillLevel = <FVLabel
        transKey="views.pages.explore.dialect.play.quiz.looks_like_your_an_expert"
        defaultStr="Looks like you're an expert!"
      />
    } else if (this.state.attempts > this.state.totalQuestions && this.state.attempts < this.state.totalQuestions * 2) {
      skillLevel = <FVLabel
        transKey="views.pages.explore.dialect.play.quiz.on_your_way_to_becoming_an_expert"
        defaultStr="On your way to becoming an expert!"
      />
    }
    let feedback = ''
    if (isSelected) {
      feedback = isCorrect ? (
        <div>
          <FVLabel
            transKey="good_job"
            defaultStr="Good Job"
            transform="words"
          />! <strong>{selectn('word', selectedAnswer)}</strong>{' '}
          <FVLabel
            transKey="translates_to"
            defaultStr="translates to"
          />
          &nbsp; <strong>{selectn('translation', selectedAnswer)}</strong>
        </div>
      ) : (
        <>
          <FVLabel
            transKey="try_again"
            defaultStr="Try again"
            transform="first"
          />...
        </>
      )
    }
    return (
      <div className="quiz-container" style={{ margin: '15px 0' }}>
        <div style={containerStyle}>
          <div className="row">
            <div className="col-xs-12">
              <LinearProgress
                style={{ height: '15px' }}
                variant="determinate"
                value={((this.state.currentAnswerIndex + 1) / this.state.totalQuestions) * 100}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <div className="imgCont" style={{ textAlign: 'center' }}>
                {isComplete ? (
                  <div
                    className={classNames('alert', 'alert-success')}
                    style={{
                      marginTop: '15px',
                      padding: '0',
                    }}
                  >
                    <FVLabel
                      transKey="views.pages.explore.dialect.play.quiz.completed_this_quiz"
                      defaultStr="Nice! You've completed this quiz!"
                    />{' '}
                    {skillLevel}
                    <FVButton variant="contained" onClick={this._restart} style={{ marginLeft: '10px' }}>
                      <FVLabel
                        transKey="views.pages.explore.dialect.play.quiz.new_quiz"
                        defaultStr="New Quiz"
                        transform="words"
                      />
                    </FVButton>
                  </div>
                ) : (
                  ''
                )}

                <img
                  className="image"
                  src={selectn('image', questions.get(this.state.currentAnswerIndex))}
                  alt={selectn('title', questions.get(this.state.currentAnswerIndex))}
                />

                {questions.size > 0 ? (
                  ''
                ) : (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Loading...</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={classNames('row', 'row-answers')}>
            {answers.map((answer, i) => {
              return isCorrect && !answer.props.correct
                ? React.cloneElement(answer, {
                  disabled: true,
                  key: i,
                })
                : answer
            })}
          </div>

          <div className={classNames('row', 'row-navigation')}>
            <div className={classNames('col-xs-2', 'text-left')}>
              <Tooltip
                title={this.props.intl.trans(
                  'views.pages.explore.dialect.play.quiz.previous_question',
                  'Previous Question',
                  'words'
                )}
              >
                <IconButton
                  style={{ backgroundColor: '#ffffff' }}
                  onClick={this._handleNavigate.bind(this, 'previous')}
                >
                  <ChevronLeft
                    aria-label={this.props.intl.trans(
                      'views.pages.explore.dialect.play.quiz.previous_question',
                      'Previous Question',
                      'words'
                    )}
                  />
                </IconButton>
              </Tooltip>
            </div>

            <div className={classNames('col-xs-8', 'text-center')}>
              <div
                style={{ width: '90%', margin: '10px auto', padding: '5px' }}
                className={classNames('alert', {
                  'alert-success': isCorrect,
                  'alert-warning': !isCorrect,
                  hidden: !isSelected,
                })}
              >
                {feedback}
              </div>
            </div>

            <div className={classNames('col-xs-2', 'text-right')}>
              <Tooltip
                title={this.props.intl.trans('views.pages.explore.dialect.play.quiz.next_question', 'Next Question', 'words')}
              >
                <IconButton style={{ backgroundColor: '#ffffff' }} onClick={this._handleNavigate.bind(this, 'next')}>
                  <ChevronRight
                    aria-label={this.props.intl.trans(
                      'views.pages.explore.dialect.play.quiz.next_question',
                      'Next Question',
                      'words'
                    )}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <div className={classNames('row', 'hidden-xs')} style={{ textAlign: 'center' }}>
            <span
              style={{
                padding: '5px',
                borderRadius: '2px',
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <FVLabel
                transKey="questions"
                defaultStr="Questions"
                transform="first"
              />
              : {this.state.currentAnswerIndex + 1} /{' '}
              <strong>{this.state.totalQuestions}</strong>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvWord, locale } = state

  const { computeWords } = fvWord
  const { intlService } = locale

  return {
    computeWords,
    intl: intlService
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchWords,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quiz)
