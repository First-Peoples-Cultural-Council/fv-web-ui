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

import selectn from 'selectn'

import './MetadataList.css'
/**
 * Metadata list
 */
export default class MetadataList extends Component {
  static propTypes = {
    metadata: PropTypes.array.isRequired,
  }
  // Note: assume the following is less resource intensive than once every render()
  // state = {
  //   content: null,
  // }
  // componentDidMount() {
  //   this.setState({
  //     content: this._getContent(),
  //   })
  // }
  render() {
    const content = this._getContent()
    return content
    // return this.state.content
  }

  _getContent = () => {
    const { metadata } = this.props
    let toReturn = null

    const listItems = metadata.map((item, key) => {
      const value = selectn('value', item)
      const label = selectn('label', item)
      if (value && value.constructor === Array) {
        // Array of jsx
        if (value.length > 0) {
          return (
            <li key={key} className="MetadataList__entry">
              <strong className="MetadataList__label">{label}:</strong>
              {value}
            </li>
          )
        }
        return null
      }
      // jsx/string
      return (
        <li key={key} className="MetadataList__entry">
          <strong className="MetadataList__label">{label}:</strong>
          <span className="MetadataList__value"> {value}</span>
        </li>
      )
    })

    toReturn = <ul className="MetadataList">{listItems}</ul>

    return toReturn
  }
}
