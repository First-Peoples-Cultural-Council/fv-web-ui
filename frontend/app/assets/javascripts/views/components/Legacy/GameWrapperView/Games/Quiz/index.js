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
const React = require('react')
const PropTypes = require('prop-types')
const PubSub = require('pubsub-js')

const _ = require('underscore')

const classNames = require('classnames')
const Mui = require('@material-ui')

const { IconButton, RaisedButton, LinearProgress, Snackbar } = Mui

const ThemeManager = new Mui.Styles.ThemeManager()

const WordOperations = require('operations/WordOperations')

const Answer = require('./Answer')

const loadingComponent = (
  <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">
    Loading...
  </div>
)

class Quiz extends React.Component {
  constructor(props) {
    super(props)

    this.eventName = this.constructor.name.toUpperCase()

    // Theme changes
    this.linearProgressStyle = { height: '15px', marginBottom: '10px' }

    ThemeManager.setComponentThemes({
      snackbar: {
        actionColor: '#ffffff',
      },
    })

    this.handleNavigate = this.handleNavigate.bind(this)
    this.checkAnswer = this.checkAnswer.bind(this)
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this)
    this.displayAnswers = this.displayAnswers.bind(this)

    this.totalQuestion = 10

    this.state = {
      word: props.word,
      questions: [],
      displayedAnswers: [],
      selectedAnswers: [],
      checkedAnswers: [],
      currentAnswer: null,
      currentAnswerIndex: 0,
      correctAnswerMedia: loadingComponent,
    }

    // TODO: Combine into one single query or nicer chaining
    WordOperations.getWordsByLangauge(
      props.client,
      props.language,
      "(dc:subjects LIKE '%" + props.category + "')"
    ).then(
      function(words) {
        words = _.sample(words, this.totalQuestion)

        this.setState({ currentAnswer: words[this.state.currentAnswerIndex] })

        WordOperations.getMediaByWord(
          props.client,
          words[this.state.currentAnswerIndex].uid,
          "(ecm:primaryType='Picture')"
        ).then(
          function(correctAnswerMedia) {
            WordOperations.getMediaBlobById(
              props.client,
              correctAnswerMedia[0].uid,
              correctAnswerMedia[0].properties['file:content']['mime-type']
            ).then(
              function(response) {
                this.setState({
                  correctAnswerMedia: (
                    <div className="imgCont">
                      <img className="image" src={response.dataUri} alt="" />
                    </div>
                  ),
                })

                PubSub.publish(this.eventName + ':DATALOADED')
              }.bind(this)
            )
          }.bind(this)
        )

        this.setState({
          questions: words,
        })
      }.bind(this)
    )

    // Subscribers
    PubSub.subscribe('ANSWER:SELECTED', this.handleAnswerSelected)
    PubSub.subscribe(this.eventName + ':DATALOADED', this.displayAnswers)
  }

  // getChildContext() {
  //   return {
  //     muiTheme: ThemeManager.getCurrentTheme(),
  //   }
  // }

  displayAnswers(selectedAnswerKey = null) {
    const selected = false
    const tmpAnswers = []
    const incorrectAnswers = _.without(_.shuffle(this.state.questions), this.state.currentAnswer)

    // If question being displayed for the first time
    if (!(this.state.currentAnswerIndex in this.state.displayedAnswers)) {
      if (incorrectAnswers.length != 0) {
        tmpAnswers.push(
          <Answer
            key={this.state.questions[this.state.currentAnswerIndex].uid}
            selected={selected}
            data={this.state.questions[this.state.currentAnswerIndex]}
            correct="true"
          />
        )

        for (let i = 0; i < 3; i++) {
          tmpAnswers.push(
            <Answer key={incorrectAnswers[i].uid} selected={selected} data={incorrectAnswers[i]} correct="false" />
          )
        }

        var arrayvar = this.state.displayedAnswers.slice()
        const newelement = _.shuffle(tmpAnswers)
        arrayvar[this.state.currentAnswerIndex] = newelement

        this.setState({ displayedAnswers: arrayvar })
      }
    }
    // Question already displayed, and answer specificed
    else if (selectedAnswerKey != null) {
      var arrayvar = this.state.displayedAnswers.slice()

      _.each(this.state.displayedAnswers[this.state.currentAnswerIndex], function(element, index, list) {
        let selected = false

        if (element.key === selectedAnswerKey) {
          selected = true
        }

        tmpAnswers.push(React.cloneElement(element, { selected: selected }))
      })

      arrayvar[this.state.currentAnswerIndex] = tmpAnswers

      this.setState({ displayedAnswers: arrayvar })
    }
  }

  handleAnswerSelected(msg, data) {
    const arrayvar = this.state.selectedAnswers.slice()
    arrayvar[this.state.currentAnswerIndex] = data

    this.setState({ selectedAnswers: arrayvar })

    // Re-render answers
    this.displayAnswers(data)
  }

  checkAnswer() {
    let correct = false

    // Build utility for this...
    const arrayvar = this.state.checkedAnswers.slice()

    if (this.state.selectedAnswers[this.state.currentAnswerIndex] == this.state.currentAnswer.uid) {
      correct = true
    }

    arrayvar[this.state.currentAnswerIndex] = correct
    this.setState({ checkedAnswers: arrayvar })

    this.refs.feedback.show()
  }

  handleNavigate(direction) {
    let newIndex

    if (direction == 'next') newIndex = this.state.currentAnswerIndex + 1
    else newIndex = this.state.currentAnswerIndex - 1

    if (newIndex <= this.totalQuestion - 1 && newIndex >= 0) {
      this.setState({
        currentAnswer: this.state.questions[newIndex],
        currentAnswerIndex: newIndex,
        correctAnswerMedia: loadingComponent,
      })

      WordOperations.getMediaByWord(
        this.props.client,
        this.state.questions[newIndex].uid,
        "(ecm:primaryType='Picture')"
      ).then(
        function(correctAnswerMedia) {
          WordOperations.getMediaBlobById(
            this.props.client,
            correctAnswerMedia[0].uid,
            correctAnswerMedia[0].properties['file:content']['mime-type']
          ).then(
            function(response) {
              this.setState({
                correctAnswerMedia: (
                  <div className="imgCont">
                    <img className="image" src={response.dataUri} alt="" />
                  </div>
                ),
              })

              this.displayAnswers()
            }.bind(this)
          )
        }.bind(this)
      )
    }
  }

  render() {
    let main = this.state.correctAnswerMedia

    if (this.state.questions.length == 0) {
      main = (
        <div className={classNames('alert', 'alert-danger', 'text-center')} role="alert">
          No words found for this quiz yet. Please try a different category or add new words.
        </div>
      )
    }

    return (
      <div className="quiz-container">
        <div className="row">
          <div className="col-xs-12">
            <LinearProgress
              style={this.linearProgressStyle}
              variant="determinate"
              value={((this.state.currentAnswerIndex + 1) / this.totalQuestion) * 100}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">{main}</div>
        </div>
        <div context="test" className={classNames('row', 'row-answers')}>
          {this.state.displayedAnswers[this.state.currentAnswerIndex]}
        </div>
        <div className={classNames('row', 'row-navigation')}>
          <div className={classNames('col-xs-2', 'text-left')}>
            <IconButton
              onClick={this.handleNavigate.bind(this, 'previous')}
              // iconClassName={classNames('glyphicon', 'glyphicon-chevron-left')}
              tooltip="Previous Question"
            />
          </div>
          <div className={classNames('col-xs-8', 'text-center')}>
            <div>
              <RaisedButton
                secondary
                disabled={this.state.currentAnswerIndex in this.state.selectedAnswers ? false : true}
                onClick={this.checkAnswer.bind(this)}
                label="Check Answer"
              />
            </div>
            <Snackbar
              ref="feedback"
              style={
                this.state.checkedAnswers[this.state.currentAnswerIndex] === true ? { backgroundColor: 'green' } : {}
              }
              message={
                this.state.checkedAnswers[this.state.currentAnswerIndex] === true ? 'Great job!' : 'Try Again...'
              }
              action="close"
              autoHideDuration={1500}
            />
          </div>
          <div className={classNames('col-xs-2', 'text-right')}>
            <IconButton
              onClick={this.handleNavigate.bind(this, 'next')}
              // iconClassName={classNames('glyphicon', 'glyphicon-chevron-right')}
              tooltip="Next Question"
            />
          </div>
        </div>
      </div>
    )
  }
}

Quiz.contextTypes = {
  // muiTheme: PropTypes.object,
  router: PropTypes.func,
}

// Quiz.childContextTypes = {
//   muiTheme: PropTypes.object,
// }

export default Quiz
