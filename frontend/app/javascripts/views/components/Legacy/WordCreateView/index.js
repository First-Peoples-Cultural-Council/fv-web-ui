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
const _ = require('underscore')
const t = require('tcomb-form')
const Form = t.form.Form

const classNames = require('classnames')

const Word = require('models/Word')

const DirectoryOperations = require('../../../operations/DirectoryOperations')

class CreateForm extends React.Component {
  constructor(props) {
    super(props)

    this._change = this._change.bind(this)
    this._save = this._save.bind(this)
    this.state = {
      schema: null,
      options: {
        fields: props.word.getFormSchemaOptions(),
        config: {
          horizontal: {
            md: [3, 9],
            sm: [6, 6],
          },
        },
        i18n: {
          add: 'New Item',
          down: '▼',
          remove: 'X',
          up: '▲',
          optional: '(optional)',
        },
      },
      word: props.word,
    }

    DirectoryOperations.getPartsOfSpeech(props.client).then(
      function(parts_speech_val) {
        this.setState({
          schema: props.word.getFormSchema({ parts_speech: parts_speech_val }),
        })
      }.bind(this)
    )

    DirectoryOperations.getSubjects(props.client).then(
      function(subjects_val) {
        this.setState({
          schema: props.word.getFormSchema({ subjects: subjects_val }),
        })
      }.bind(this)
    )
  }

  _change(value) {
    this.setState({ value })
  }

  _save(evt) {
    const client = this.props.client
    const value = this.refs.form.getValue()

    const self = this

    if (value) {
      client
        .operation('Document.Create')
        .params({
          type: 'Word',
          name: value['dc:title'],
          properties: value,
        })
        .input('doc:/default-domain/workspaces/' + self.props.language)
        .execute(function(error, doc) {
          if (error) {
            throw error
          }

          self.props.router.navigate('browse/word/' + doc.uid, { trigger: true })
        })
    }

    evt.preventDefault()
  }

  render() {
    let form = ''

    if (this.state.schema != undefined) {
      form = (
        <form onSubmit={this._save}>
          <Form
            ref="form"
            options={this.state.options}
            type={this.state.schema}
            value={this.state.value}
            onChange={this._change}
          />
          <button type="submit" className={classNames('btn', 'btn-primary')}>
            Save Changes
          </button>
        </form>
      )
    }

    return <div className="form-horizontal">{form}</div>
  }
}

class WordCreateView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      word: new Word(),
    }
  }

  render() {
    return (
      <div>
        <CreateForm
          client={this.props.client}
          router={this.props.router}
          word={this.state.word}
          language={this.props.language}
        />
      </div>
    )
  }
}

WordCreateView.contextTypes = {
  router: PropTypes.func,
}

export default WordCreateView
