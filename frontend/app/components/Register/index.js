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
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'
import { selfregisterUser } from 'reducers/fvUser'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import Link from 'components/Link'
import PromiseWrapper from 'components/PromiseWrapper'

import FVButton from 'components/FVButton'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import FVLabel from 'components/FVLabel'

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

    this.formUserCreate = React.createRef()

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

    const formValue = this.formUserCreate.current.getValue()

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

    // Passed validation
    if (formValue) {
      const payload = Object.assign({}, properties, {
        'userinfo:groups': [properties['userinfo:groups']],
      })

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
        this.props.intl.trans('views.pages.users.register.user_request_success', 'User request submitted successfully!')
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
        label: this.props.intl.trans('group', 'Group', 'first'),
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
                  Go to our <Link href="/">home page</Link> or{' '}
                  <Link href="/explore/FV/sections/Data/">explore our community portals</Link>.
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
          {selectn('response.title', computeDialect2)}
          <FVLabel transKey="register" defaultStr="Register" transform="first" />
        </h1>
        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-8')}>
            <div>
              <h2>Are you a member of a language community?</h2>
              <p>
                Most content is available <Link href="/explore/FV/sections/Data">here</Link> for everyone to access
                without registration.
              </p>
              <p>
                If you are a member of a language community that is represented on FirstVoices, please register in order
                to access any additional content intended solely for members of your community.
              </p>
            </div>
            <form onSubmit={this._onRequestSaveForm.bind(this, this.props.computeLogin)}>
              <t.form.Form
                ref={this.formUserCreate}
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
                <FVButton
                  variant="contained"
                  onClick={this._onRequestSaveForm.bind(this, this.props.computeLogin)}
                  color="primary"
                >
                  <FVLabel transKey="register" defaultStr="Register" transform="first" />
                </FVButton>
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
  const { fvDialect, fvUser, nuxeo, windowPath, locale } = state

  const { computeUser, computeUserSelfregister } = fvUser
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computeUser,
    computeUserSelfregister,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
  selfregisterUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
