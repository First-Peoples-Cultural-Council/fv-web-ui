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

import '!style-loader!css-loader!./modalStyles.css'

/**
 * List view for words in immersion
 */
const { func, array } = PropTypes

class TranslationInput extends Component {
  static propTypes = { templateStrings: array, translation: array, onChange: func }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {}
    this.translations = this.renderTranslation()
  }

  componentDidMount() {
    this.addListeners()
  }

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    this.removeListeners()
  }

  handleChange = (name) => (event) => {}

  renderTranslation = () => {
    const { translation, templateStrings } = this.props
    var count = 0
    const words = translation.map((word, i) => {
      const output = []
      if (word === '%s') {
        output.push(
          <span className="template-span small" key={i}>
            {templateStrings[count]}
          </span>
        )
        count++
      } else {
        output.push(
          <span
            key={i.toString()}
            className="translation-input"
            contentEditable="true"
            id={i.toString() + ' editable'}
            suppressContentEditableWarning={true}
          >
            {word.toString()}
          </span>
        )
      }
      return output
    })
    return words
  }

  addListeners = () => {
    const { translation } = this.props
    translation.forEach((word, i) => {
      if (word === '%s') return
      document.getElementById(i.toString() + ' editable').addEventListener('input', this.changeListener)
    })
  }

  changeListener = (ev) => {
    const { onChange } = this.props
    onChange({ target: { value: ev.target.textContent } }, ev.target.id[0])
  }

  removeListeners = () => {
    const { translation } = this.props
    translation.forEach((word, i) => {
      if (word === '%s') return
      document.getElementById(i.toString() + ' editable').removeEventListener('input', this.changeListener)
    })
  }

  render() {
    return <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>{this.translations}</div>
  }
}

export default TranslationInput
