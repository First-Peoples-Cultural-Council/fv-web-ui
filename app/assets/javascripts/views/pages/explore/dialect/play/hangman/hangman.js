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
import RaisedButton from 'material-ui/lib/raised-button';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;

const borderStyle = {
    border: '1px solid #CCC'
}

const spotStyle = {
    display: 'inline-block',
    fontSize: '30px',
    lineHeight: '19px',
    margin: '5px',
    padding: '10px',
    height: '40px',
    minWidth: '40px',
    color: '#35b3ad',
    position: 'relative',
    overflow: 'hidden'
}


const lineStyle = {
    border: '2px solid #000',
    width: '40px',
    position: 'absolute',
    bottom: '5px',
    left: '10px'
}

const inputStyle = {
    outline: 'none',
    border: '1px solid #CCC',
    fontSize: '24px',
    width: '80px',
    textAlign: 'center',
    verticalAlign: 'middle',
    marginRight: '10px'
}


const buttonStyle = {
    background: "#22e376",
    backgroundImage: "linear-gradient(to bottom, #22e376, #2bb8ac)",
    WebkitBorderRadius: "28",
    MozBorderRadius: "28",
    borderRadius: "28px",
    fontFamily: "Arial",
    color: "#ffffff",
    fontSize: "20px",
    padding: "10px 20px 10px 20px",
    textDecoration: "none",
    display: 'inline-block',
    verticalAlign: 'top',
    height: '90px',
    borderRadius: '6px',
    lineHeight: '70px',
    marginLeft: '5px',
    width: '190px',
    cursor: 'pointer'
}

/**
 * Play games
 */
export default class HangmanGame extends Component {


    /**
     * Constructor
     */
    constructor(props, context) {

        super(props, context);

        //Get default start
        this.state = this.getDefaultState();

        //Prebind functions
        this.restart = this.restart.bind(this);
    }

    /**
     * Get Default State
     */
    getDefaultState(props = this.props) {
        return {
            puzzle: this.preparePuzzle(props),
            guessesLeft: 7,
            alphabet: this.prepareAlphabet(props),
            guessedLetters: [],
            succeeded: false,
            failed: false,
            startTime: Date.now()
        }
    }

    /**
     * Retart with same puzzle
     */
    restart() {
        this.setState(this.getDefaultState());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.puzzle != this.props.puzzle) {
            this.setState(this.getDefaultState(nextProps));
        }
    }


    /**
     * Prepare puzzle
     * breaks up puzzle into letters
     */
    preparePuzzle(props) {

        var puzzle = props.puzzle;
        var letters = props.alphabet;
        var letterCount = letters.length;
        var letterRegexStr = "";

        for (var i = 0; i < letterCount; i++) {
            letterRegexStr += '(' + letters[i] + ')|';
        }

        var letterRegex = new RegExp(letterRegexStr, "g");

        var puzzleParts = puzzle.split(letterRegex).filter((l) => {
            return (l !== undefined) && l.length !== 0
        });

        let word = [];

        let words = [];

        puzzleParts.map((letter, index, parts) => {
            if (letter === ' ') {
                words.push(word);
                word = []
            }
            else {
                word.push({letter: letter.toUpperCase(), found: false})
            }
            if (index === parts.length - 1) {
                words.push(word);
            }
        })

        return words;
    }


    /**
     * Prepare Alphabet
     */
    prepareAlphabet(props) {
        return props.alphabet.map((letter) => {
            return letter.toUpperCase();
        });
    }

    /**
     * Guess letter
     */
    guessLetter(letter) {

        let guessesLeft = this.state.guessesLeft;

        let guessedLetters = this.state.guessedLetters;

        let succeeded = this.state.succeeded;

        if (guessesLeft > 0 && succeeded === false) {
            let puzzle = this.state.puzzle;

            if (guessedLetters.indexOf(letter) === -1) {
                guessedLetters.push(letter);

                let letterFound = false;

                succeeded = true;

                puzzle.map((word) => {
                    word.map((part) => {
                        if (part.letter === letter) {
                            letterFound = true;
                            part.found = true;
                        }
                        if (part.found === false) {
                            succeeded = false;
                        }
                    })
                });

                if (letterFound === false) {
                    guessesLeft = guessesLeft - 1;
                }

                let failed = false;

                if (guessesLeft <= 0) {
                    failed = true;
                }

                if (succeeded) {
                    this.audio.play();
                }
                this.setState({guessedLetters, puzzle, guessesLeft, succeeded, failed});
            }
        }
    }

    renderKeyboard() {
        const guessedLetters = this.state.guessedLetters;

        return <div className="keyboard" style={{width: '100%', maxWidth: '530px', margin: 'auto'}}>
            {this.state.alphabet.map((letter, index) => {
                let guessed = false;

                if (guessedLetters.indexOf(letter) !== -1) {
                    guessed = true;
                }

                return <Letter key={index} guessed={guessed} letter={letter}
                               onClick={this.guessLetter.bind(this, letter)}/>;
            })}
        </div>
    }


    renderSuccess() {
        const timeDiff = (Date.now() - this.state.startTime) / 1000;
        const timeToSolve = seconds2time(timeDiff);
        return <div className="success">
            <h3>{intl.trans('views.pages.explore.dialect.play.hangman.you_win', 'You win!, You solved it in')} {timeToSolve}</h3>
        </div>
    }


    renderFailure() {
        return <div className="failure">
            <h4>{intl.trans('views.pages.explore.dialect.play.hangman.oh_no', 'Oh no! You\'re out of guesses. Don\'t quit now! Try again!')}</h4>
        </div>
    }

    /**
     * Render
     */
    render() {


        return <div className="hangman-game" style={{textAlign: 'center'}}>
            <h1>{intl.trans('views.pages.explore.dialect.play.hangman.parachute', 'Parachute', 'first')}</h1>

            <div>{intl.trans('views.pages.explore.dialect.play.hangman.guess_puzzle_to_make_it_to_the_beach', 'Guess the puzzle to make it to the beach', 'first')}</div>

            <img src={`/assets/games/hangman/assets/${this.state.guessesLeft}.png`}
                 style={{width: '100%', maxWidth: '750px'}}/>

            <div>
                {this.state.puzzle.map((word, index) => {
                    const wordStyle = {display: 'inline-block'};
                    if (index !== 0) {
                        wordStyle.marginLeft = '50px';
                    }
                    return <div style={wordStyle} key={index}>
                        {word.map((letter, index) => {
                            return (<div key={index} className="spot" style={{...spotStyle, ...borderStyle}}>
                                <div className="letter">{letter.found ? letter.letter : false}</div>
                            </div>)
                        })}
                    </div>
                })
                }
            </div>

            <div>Hint: {this.props.translation} </div>

            <audio style={{maxWidth: '350px'}} ref={(el) => {
                this.audio = el
            }} src={this.props.audio} controls/>

            <div></div>

            {(this.state.succeeded || this.state.failed) ? false : this.renderKeyboard()}
            {(this.state.succeeded ? this.renderSuccess() : false)}
            {(this.state.failed ? this.renderFailure() : false)}

            <div style={{margin: '15px 0'}}>
                <RaisedButton secondary={true} onTouchTap={this.props.newPuzzle}
                              label={intl.trans('views.pages.explore.dialect.play.hangman.new_puzzle', 'New Puzzle', 'words')}
                              style={{marginRight: '10px'}}/>
                <RaisedButton primary={true} onMouseDown={this.restart}
                              label={intl.trans('views.pages.explore.dialect.play.hangman.restart', 'Restart', 'words')}/>
            </div>

        </div>;
    }

}


const letterStyle = {
    backgroundColor: 'WhiteSmoke',
    textAlign: 'center',
    fontSize: '25px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'silver',
    display: 'inline-block',
    padding: '0 15px',
    borderRadius: '5px',
    lineHeight: '45px',
    margin: '5px'
}

const letterHoverStyle = {
    backgroundColor: '#CCCCCC',
    cursor: 'pointer'
}

const guessedStyle = {
    border: '1px solid #000',
    color: '#35b3ad',
    backgroundColor: '#FFFFFF'
}

class Letter extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            hovering: false,
        }

        this.onOver = this.onOver.bind(this);
        this.onOut = this.onOut.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick();
    }

    onOver() {
        this.setState({hovering: true});
    }

    onOut() {
        this.setState({hovering: false})
    }

    render() {

        let style = {...letterStyle};

        let action = false;

        if (this.state.hovering) {
            style = {...style, ...letterHoverStyle};
        }

        if (this.props.guessed === false) {
            action = this.onClick;
        }
        else {
            style = {...style, ...guessedStyle}
        }

        return <div className="letter" onMouseOver={this.onOver} onMouseOut={this.onOut} onClick={action}
                    style={style}>{this.props.letter}</div>
    }
}


const seconds2time = (seconds) => {

    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    let time = "";

    if (hours != 0) {
        time = hours + ":";
    }
    if (minutes != 0 || time !== "") {
        minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
        time += minutes + ":";
    }
    if (time === "") {
        time = seconds + "s";
    }
    else {
        time += (seconds < 10) ? "0" + seconds : String(seconds);
    }
    return time;

}