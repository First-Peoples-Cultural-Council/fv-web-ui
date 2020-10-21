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
import '!style-loader!css-loader!./PreviewMetaDataContributor.css'
import FVLabel from 'components/FVLabel'

const { object } = PropTypes

export default class PreviewMetaDataContributor extends Component {
  static propTypes = {
    expandedValue: object,
  }

  render() {
    let body = null

    let contributor = {}
    let contributorResponse

    if (this.props.expandedValue) {
      contributor.success = true
      contributorResponse = this.props.expandedValue
    } else {
      contributor = null
      contributorResponse = null
    }

    if (contributorResponse && contributor.success) {
      const contributorTitle = selectn('title', contributorResponse) || selectn('dc:title', contributorResponse)
      const _contributorDescription =
        selectn('properties.dc:description', contributorResponse) || selectn('dc:description', contributorResponse)
      const contributorDescription = _contributorDescription ? (
        <span>
          {' '}
          <span
            className="PreviewMetaDataContributor__entryDescription"
            dangerouslySetInnerHTML={{
              __html: _contributorDescription,
            }}
          />
        </span>
      ) : null
      body = (
        <li className="PreviewMetaDataContributor__entry">
          <span
            className="PreviewMetaDataContributor__entryTitle"
            dangerouslySetInnerHTML={{
              __html: contributorTitle,
            }}
          />
          {contributorDescription}
        </li>
      )
    } else if (contributor && contributor.isError) {
      body = (
        <li className="PreviewMetaDataContributor__entry PreviewMetaDataContributor__entry--error">
          <FVLabel transKey="error" defaultStr="Error" transform="first" />: {`${selectn('message', contributor)}`}
        </li>
      )
    }

    return <ul className="PreviewMetaDataContributor">{body}</ul>
  }
}
