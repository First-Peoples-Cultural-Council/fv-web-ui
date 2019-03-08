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
var React = require('react');

var Quiz = require('./Games/Quiz');
var MultiQuiz = require('./Games/MultiQuiz');

class GameWrapperView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    var label, content ="";

    switch (this.props.game){
      case 'quiz':
        label = "Single Photo Quiz";
        content = <Quiz
                    client={this.props.client}
                    category={this.props.category} 
                    language={this.props.language} />;
      break;

      case 'multi-quiz':
        label = "Multiple Photo Quiz";
        content = <MultiQuiz
                    client={this.props.client}
                    category={this.props.category} 
                    language={this.props.language} />;
      break;
    }

    return (
      <div className="gameWrapperView">
        {content}
      </div>
    );
  }
}

module.exports = GameWrapperView;