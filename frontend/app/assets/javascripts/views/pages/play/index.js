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
import React from 'react';
import _ from 'underscore';

export default class Play extends React.Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      subject: null
    }; 

          var subjectReactOptions = [];
          var subjectsArray = [];

          subjectsArray = _.sortBy(_.toArray(this.state.subjects), function (name) {return name});

          if (subjectsArray.length > 0) {

            subjectsArray.forEach(function(element, index) {
              if (element != undefined) {
                subjectReactOptions[index] = <option value={element} key={element}>{element}</option>;
              }
            });
          }
/*
          content = <div className="play-cont">

            <div className="row">
              <div className="col-xs-12">
                <h2>Play Games</h2>
              </div>
            </div>

            <div className="row">

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Single Photo Quiz</h3>
                  <p>Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p>
                    <select onChange={this._changeQuizCategory}>
                      <option>Select a category:</option>
                      {subjectReactOptions}
                    </select>
                  </p>
                  <a id="quiz" href="#play/Lilwat/quiz/biology" className={classNames('btn', 'btn-primary')}>Play Game</a>
                </div>
              </div>

              <div className="col-xs-12 col-md-3">
                <div className="well">
                  <h3>Multiple Photo Quiz</h3>
                  <p>Lorem ipsum lorem ipsum lorem. Lorem ipsum lorem ipsum lorem.</p>
                  <p>
                    <select onChange={this._changeMultiQuizCategory}>
                      <option>Select a category:</option>
                      {subjectReactOptions}
                    </select>
                  </p>
                  <a id="multi-quiz" href="#play/Lilwat/multi-quiz" className={classNames('btn', 'btn-primary')}>Play Game</a>
                </div>
              </div>

            </div>

          </div>

          GAME: 
          <GameWrapperView
                router={this.props.router}
                client={this.props.client}
                language={this.state.routeParams.language}
                category={this.state.routeParams.category}
                game={this.state.routeParams.game} />
*/
  }

  render() {

    return <div className="row">
            <div className="col-md-8 col-xs-12">
              <h2>Play Us111</h2>
              <p>Some text here</p>
              <h3>Recommended fonts</h3>
              <p>Due to FirstVoices' use of Unicode font technology, one or more of the following fonts are recommended to ensure correct character representation: Aboriginal Sans Serif, Aboriginal Serif, Lucida Grande (bundled with Mac OSX) , Lucida Sans Unicode (comes with Windows), Gentium, Code2001. FirstVoices also uses the Quicktime video player. Download the free plug-in here: QuickTime</p>
              <p>FirstVoices Audio Recording Buyer's Guide - view our online audio equipment guide</p>
              <h2>Getting Started</h2>
              <p>Some getting started information could go here.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
            </div>
            <div className="col-md-4 col-xs-12">
              <h2>News</h2>
              <p>Some getting started information could go here.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p>
              <h2>Map Navigation</h2>
              <p>Map here</p>
            </div>
          </div>;
  }
}