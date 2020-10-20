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
import Immutable from 'immutable'
import classNames from 'classnames'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchUser } from 'providers/redux/reducers/fvUser'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import FVLabel from '../../components/FVLabel/index'

/**
 * Create user entry
 */
const { array, func, object, string } = PropTypes
class Profile extends Component {

  static propTypes = {
    routeParams: object.isRequired,
    updateUser: func.isRequired,
    // REDUX: reducers/state
    computeUser: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchUser: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.formUserEdit = React.createRef()

    this.state = {
      formValue: null,
      userRequest: null,
      currentUsername: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    const currentUsername = selectn('response.properties.username', newProps.computeLogin)

    if (currentUsername) {
      this.props.fetchUser(currentUsername)

      this.setState({
        currentUsername: currentUsername,
      })
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentUser
    let nextUser

    if (this.state.userRequest !== null) {
      currentUser = ProviderHelpers.getEntry(this.props.computeUser, this.state.userRequest)
      nextUser = ProviderHelpers.getEntry(nextProps.computeUser, this.state.userRequest)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (selectn('success', currentUser) != selectn('success', nextUser) && selectn('success', nextUser) === true) {
      //nextProps.replaceWindowPath('/' + nextProps.routeParams.siteTheme + selectn('response.path', nextWord).replace('Dictionary', 'learn/words'));
    } else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
      this.fetchData(nextProps)
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath !== this.props.windowPath:
        return true

      case newProps.computeUser != this.props.computeUser:
        return true
      default: // Note: do nothing
    }

    return false
  }

  _onRequestSaveForm(e) {
    e.preventDefault()
    const formValue = this.formUserEdit.current.getValue()

    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Flatten preferences
    const payload = Object.assign({}, properties, {
      preferences: JSON.stringify(properties.preferences),
    })

    // Passed validation
    if (formValue) {
      const userRequest = {
        'entity-type': 'user',
        id: this.state.currentUsername,
        properties: payload,
      }

      this.props.updateUser(userRequest)
      this.setState({ userRequest })
    } else {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const FVUserProfileFields = selectn('FVUserProfile', fields)
    const FVUserProfileOptions = {
      fields: Object.assign({}, selectn('FVUser.fields', options), selectn('FVUserProfile.fields', options)),
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.currentUsername,
        entity: this.props.computeUser,
      },
    ])

    const computeUser = ProviderHelpers.getEntry(this.props.computeUser, this.state.currentUsername)

    const normalizedPayload = Object.assign({}, selectn('response.properties', computeUser))

    if (normalizedPayload.hasOwnProperty('preferences')) {
      normalizedPayload.preferences = JSON.parse(selectn('response.properties', computeUser).preferences)
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>{this.props.intl.searchAndReplace('My Profile', { case: 'words' })}</h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref={this.formUserEdit}
                type={t.struct(FVUserProfileFields)}
                value={this.state.formValue || normalizedPayload}
                options={FVUserProfileOptions}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  <FVLabel
                    transKey="save"
                    defaultStr="Save"
                    transform="first"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvUser, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeUser } = fvUser
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeUser,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchUser,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
