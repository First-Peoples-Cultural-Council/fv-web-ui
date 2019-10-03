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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { selfregisterUser } from 'providers/redux/reducers/fvUser'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import Button from '@material-ui/core/Button'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * Create user entry
 */

const { array, func, object, string } = PropTypes
export class Register extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeUser: object.isRequired,
    computeUserSelfregister: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    selfregisterUser: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
      userRequest: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (newProps.routeParams.hasOwnProperty('dialect_path')) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentWord
    let nextWord

    if (this.state.userRequest !== null) {
      currentWord = ProviderHelpers.getEntry(this.props.computeUserSelfregister, this.state.userRequest)
      nextWord = ProviderHelpers.getEntry(nextProps.computeUserSelfregister, this.state.userRequest)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
      //nextProps.replaceWindowPath('/' + nextProps.routeParams.siteTheme + selectn('response.path', nextWord).replace('Dictionary', 'learn/words'));
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath != this.props.windowPath:
        return true

      case newProps.computeDialect2 != this.props.computeDialect2:
        return true

      case newProps.computeUserSelfregister != this.props.computeUserSelfregister:
        return true
      default: // NOTE: do nothing
    }

    return false
  }

  _onRequestSaveForm(currentUser, e) {
    // Prevent default behaviour
    e.preventDefault()
    // TODO: this.refs DEPRECATED
    const formValue = this.refs.form_user_create.getValue()

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

    const payload = Object.assign({}, properties, {
      'userinfo:groups': [properties['userinfo:groups']],
    })

    // Passed validation
    if (formValue) {
      const userRequest = {
        'entity-type': 'document',
        type: 'FVUserRegistration',
        id: selectn('userinfo:email', properties),
        properties: payload,
      }

      this.props.selfregisterUser(
        userRequest,
        null,
        null,
        intl.trans('views.pages.users.register.user_request_success', 'User request submitted successfully!')
      )
      this.setState({ userRequest })
    } else {
      window.scrollTo(0, 0)
    }
  }

  render() {
    let serverErrorMessage = ''

    const FVUserFields = selectn('FVUser', fields)
    const FVUserOptions = Object.assign({}, selectn('FVUser', options))

    const computeEntities = ProviderHelpers.toJSKeepId([
      {
        id: this.state.userRequest,
        entity: this.props.computeUserSelfregister,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeUserSelfregister = ProviderHelpers.getEntry(this.props.computeUserSelfregister, this.state.userRequest)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Hide requested space field is pre-set.
    if (selectn('fields.fvuserinfo:requestedSpace', FVUserOptions) && selectn('response.uid', computeDialect2)) {
      FVUserOptions.fields['fvuserinfo:requestedSpace'].type = 'hidden'
    }

    const dialectGroups = ProviderHelpers.getDialectGroups(
      selectn('response.contextParameters.acls[0].aces', computeDialect2)
    )

    if (dialectGroups.all !== null) {
      FVUserFields['userinfo:groups'] = t.enums(dialectGroups.all)
      FVUserOptions.fields['userinfo:groups'] = {
        label: intl.trans('group', 'Group', 'first'),
      }
    }

    // Show success message
    if (selectn('success', computeUserSelfregister)) {
      switch (selectn('response.value.status', computeUserSelfregister)) {
        case 400:
          serverErrorMessage = (
            <div className={classNames('alert', 'alert-danger')} role="alert">
              {selectn('response.value.entity', computeUserSelfregister)}
            </div>
          )
          break

        case 200:
          return (
            <div className="row" style={{ marginTop: '15px' }}>
              <div className={classNames('col-xs-12')}>
                <h1>Thank you for your registration!</h1>
                <p>
                  You should receive a confirmation email from us shortly asking you to validate your email address and
                  create a password.
                </p>
                <p>
                  If you do not see the email in a few minutes, please confirm it is not in your SPAM folder or contact
                  us for support.
                </p>
                <p>
                  Go to our <a href="/">home page</a> or{' '}
                  <a href="/explore/FV/sections/Data/">explore our community portals</a>.
                </p>
              </div>
            </div>
          )
        default: // NOTE: do nothing
      }
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {selectn('response.title', computeDialect2)} {intl.trans('register', 'Register', 'first')}
        </h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-8')}>
            <form onSubmit={this._onRequestSaveForm.bind(this, this.props.computeLogin)}>
              <t.form.Form
                ref="form_user_create" // TODO: DEPRECATED
                type={t.struct(FVUserFields)}
                context={selectn('response', computeDialect2)}
                value={
                  this.state.formValue || { 'fvuserinfo:requestedSpace': selectn('response.uid', computeDialect2) }
                }
                options={FVUserOptions}
              />
              {serverErrorMessage}

              <p>
                <small>Note: Fields marked with * are required</small>
              </p>

              <div className="form-group">
                <Button
                  variant="contained"
                  onClick={this._onRequestSaveForm.bind(this, this.props.computeLogin)}
                  color="primary"
                >
                  {intl.trans('register', 'Register', 'first')}
                </Button>
              </div>
            </form>
          </div>
          <div className={classNames('col-xs-12', 'col-md-4')}>
            <h2>Did you know?</h2>
            <p>
              Becoming a member allows us to present you with content that is personalized to you, however most content
              is available to the public without registration, at the discretion of communities.
            </p>
            <p>
              {'You can get started by clicking "'}
              <strong>
                <a href="/explore/FV/sections/Data">Choose a Language</a>
              </strong>
              {'", and then picking your language/community.'}
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => NavigationHelpers.navigate('/explore/FV/sections/Data', this.props.pushWindowPath)}
            >
              {intl.translate('choose_lang', 'Choose a Language', 'first')}
            </Button>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvUser, nuxeo, windowPath } = state

  const { computeUser, computeUserSelfregister } = fvUser
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeUser,
    computeUserSelfregister,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
  selfregisterUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)
