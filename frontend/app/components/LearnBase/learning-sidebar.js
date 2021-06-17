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
import { connect } from 'react-redux'
import classNames from 'classnames'
import selectn from 'selectn'

import Preview from 'components/Preview'
import FVLabel from 'components/FVLabel'

/**
 * Sidebar for learning page
 */
const { any, bool, object } = PropTypes
export class LearningSidebar extends Component {
  static propTypes = {
    dialect: object.isRequired,
    dialectClassName: any,
    isSection: bool.isRequired,
    // REDUX: reducers/state
    properties: object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    ;[].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { dialect, dialectClassName, isSection } = this.props

    const languageResources = selectn('response.contextParameters.dialect.language_resources', dialect.compute) || []
    const keyboards = selectn('response.contextParameters.dialect.keyboards', dialect.compute) || []
    const contactInfo = selectn('response.properties.fvdialect:contact_information', dialect.compute)

    return (
      <div className={classNames('row', dialectClassName)}>
        <div className={classNames('col-xs-12')}>
          {(languageResources?.length > 0 || !isSection) && (
            <div>
              <h2>
                <FVLabel transKey="general.language_resources" defaultStr="Language Resources" transform="upper" />
              </h2>
              <hr className="dialect-hr" />
              {languageResources?.map((resource, i) => (
                <Preview key={i} id={resource.uid} type={'FVLink'} />
              ))}
            </div>
          )}
        </div>

        <div className={classNames('col-xs-12', 'PrintHide')}>
          {(keyboards?.length > 0 || !isSection) && (
            <div>
              <h2>
                <FVLabel transKey="general.our_keyboards" defaultStr="OUR KEYBOARDS" transform="upper" />
              </h2>
              <hr className="dialect-hr" />
              {keyboards?.map((keyboard, i) => (
                <Preview key={i} id={keyboard.uid} type={'FVLink'} />
              ))}
            </div>
          )}
        </div>

        <div className={classNames('col-xs-12')}>
          {(contactInfo || !isSection) && (
            <div>
              <h2>
                <FVLabel transKey="general.contact_information" defaultStr="CONTACT INFORMATION" transform="upper" />
              </h2>
              <hr className="dialect-hr" />
              <div className="fv-portal-about" dangerouslySetInnerHTML={{ __html: contactInfo }} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, locale } = state

  const { properties } = navigation
  const { intlService } = locale

  return {
    properties,
    intl: intlService,
  }
}

export default connect(mapStateToProps, null)(LearningSidebar)
