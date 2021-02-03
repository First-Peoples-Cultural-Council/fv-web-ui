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

// REDUX
import { connect } from 'react-redux'

import classNames from 'classnames'
import selectn from 'selectn'
import AuthorizationFilter from 'components/AuthorizationFilter'
import EditableComponentHelper from 'components/EditableComponentHelper'

import FVLabel from 'components/FVLabel'

/**
 * Sidebar for learning page
 */
const { bool, object } = PropTypes
export class LearningSidebar extends Component {
  static propTypes = {
    dialect: object.isRequired,
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

    return (
      <div className={classNames('row', dialectClassName)}>
        <div className={classNames('col-xs-12')}>
          {(() => {
            if (
              selectn('response.contextParameters.dialect.language_resources.length', dialect.compute) > 0 ||
              !isSection
            ) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', dialect.compute) }}
                  renderPartial
                >
                  <div>
                    <h2>
                      <FVLabel
                        transKey="general.language_resources"
                        defaultStr="Language Resources"
                        transform="upper"
                      />
                    </h2>
                    <hr className="dialect-hr" />
                    <EditableComponentHelper
                      dataTestid="EditableComponent__fvdialect-language_resources"
                      isSection={isSection}
                      computeEntity={dialect.compute}
                      updateEntity={dialect.update}
                      showPreview
                      previewType="FVLink"
                      property="fvdialect:language_resources"
                      sectionProperty="contextParameters.dialect.language_resources"
                      entity={selectn('response', dialect.compute)}
                    />
                  </div>
                </AuthorizationFilter>
              )
            }
          })()}
        </div>

        <div className={classNames('col-xs-12', 'PrintHide')}>
          {(() => {
            if (selectn('response.contextParameters.dialect.keyboards.length', dialect.compute) > 0 || !isSection) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', dialect.compute) }}
                  renderPartial
                >
                  <div>
                    <h2>
                      <FVLabel transKey="general.our_keyboards" defaultStr="OUR KEYBOARDS" transform="upper" />
                    </h2>
                    <hr className="dialect-hr" />
                    <EditableComponentHelper
                      dataTestid="EditableComponent__fvdialect-keyboards"
                      isSection={isSection}
                      computeEntity={dialect.compute}
                      updateEntity={dialect.update}
                      showPreview
                      previewType="FVLink"
                      property="fvdialect:keyboards"
                      sectionProperty="contextParameters.dialect.keyboards"
                      entity={selectn('response', dialect.compute)}
                    />
                  </div>
                </AuthorizationFilter>
              )
            }
          })()}
        </div>

        <div className={classNames('col-xs-12')}>
          {(() => {
            if (selectn('response.properties.fvdialect:contact_information', dialect.compute) || !isSection) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', dialect.compute) }}
                  renderPartial
                >
                  <div>
                    <h2>
                      <FVLabel
                        transKey="general.contact_information"
                        defaultStr="CONTACT INFORMATION"
                        transform="upper"
                      />
                    </h2>
                    <hr className="dialect-hr" />
                    <EditableComponentHelper
                      dataTestid="EditableComponent__fvdialect-contact_information"
                      isSection={isSection}
                      computeEntity={dialect.compute}
                      updateEntity={dialect.update}
                      property="fvdialect:contact_information"
                      entity={selectn('response', dialect.compute)}
                    />
                  </div>
                </AuthorizationFilter>
              )
            }
          })()}
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
