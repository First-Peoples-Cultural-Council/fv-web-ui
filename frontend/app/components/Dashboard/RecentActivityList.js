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
import selectn from 'selectn'

import NavigationHelpers from 'common/NavigationHelpers'
import FVLabel from 'components/FVLabel'
import Link from 'components/Link'

export default class RecentActivityList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  // Convert timestamps in the format "2016-05-19T16:56:27.43Z" to "2016-05-19 16:56:27"
  _formatDate(date) {
    const dateString = date.slice(0, 10)
    const timeString = date.slice(11, 19)
    return dateString + ' ' + timeString
  }

  // Convert Nuxeo paths to webui links
  _formatLink(object, docType) {
    switch (docType) {
      case 'word':
        return NavigationHelpers.generateUIDPath(this.props.siteTheme, object, 'words')

      case 'phrase':
        return NavigationHelpers.generateUIDPath(this.props.siteTheme, object, 'phrases')

      case 'song':
        return NavigationHelpers.generateUIDPath(this.props.siteTheme, object, 'songs')

      case 'stories':
        return NavigationHelpers.generateUIDPath(this.props.siteTheme, object, 'stories')

      default:
        return '#'
    }
  }

  render() {
    if (this.props.data == undefined || this.props.data.entries == undefined) {
      return (
        <div>
          Loading <strong>{this.props.title}</strong>
          ...
        </div>
      )
    }

    if (selectn('entries.length', this.props.data) === 0) {
      return null
    }

    return (
      <div>
        <h3 style={{ margin: '0', padding: '10px 0', fontSize: '1.2em' }}>{this.props.title}</h3>
        <ul>
          {this.props.data.entries.map((document) => (
            <li style={{ padding: '0 0 5px 0' }} key={document.uid}>
              <Link href={this._formatLink(document, this.props.docType)}>{document.title}</Link>
              <br />
              {this._formatDate(document.properties['dc:modified'])}{' '}
              {document.properties['dc:lastContributor'].indexOf('Administrator') != -1 ||
              document.properties['dc:lastContributor'].indexOf('dyona') != -1 ? (
                  ''
                ) : (
                  <span>
                    <FVLabel transKey="by" defaultStr="by" transform="lower" />{' '}
                    <strong>{document.properties['dc:lastContributor']}</strong>
                  </span>
                )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
