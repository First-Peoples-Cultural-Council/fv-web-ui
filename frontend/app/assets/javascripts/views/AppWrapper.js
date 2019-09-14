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
// import ReactDOM from 'react-dom'

// REDUX
import { connect } from 'react-redux'
import { changeTheme } from 'providers/redux/reducers/navigation'
import { nuxeoConnect, getCurrentUser } from 'providers/redux/reducers/nuxeo'

import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
// import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

// import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import AppFrontController from './AppFrontController'

import IntlService from 'views/services/intl'

import { MuiThemeProvider } from '@material-ui/core/styles'

const getPreferences = function getPreferences(login, dialect) {
  const preferenceString = selectn('response.properties.preferences', login)
  const parsedPreferences = preferenceString ? JSON.parse(preferenceString) : {}
  const flattenedPreferences = {}

  for (const preferenceCat in parsedPreferences) {
    for (const preference in parsedPreferences[preferenceCat]) {
      flattenedPreferences[preference] = parsedPreferences[preferenceCat][preference]
    }
  }

  // Dialect assignment
  flattenedPreferences.primary_dialect_path = selectn('path', dialect)

  return flattenedPreferences
}

const { func, object, string } = PropTypes
class AppWrapper extends Component {
  intl = IntlService.instance
  intlBaseKey = 'views'

  static propTypes = {
    // REDUX: actions/dispatch/func
    changeTheme: func.isRequired,
    fetchDialect2: func.isRequired,
    getCurrentUser: func.isRequired,
    nuxeoConnect: func.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
  }

  /*
  static childContextTypes = {
    muiTheme: PropTypes.object,
  }

  // TODO: SEE IF THIS IS AN ISSUE AFTER SWITCH TO REDUX
  // react-redux-provide will pass context such as providers (Note: this is only needed for debugging the store atm)
  static contextTypes = {
    providers: PropTypes.object,
  }

  // TODO: The legacy context API will be removed in a future major version.
  // TODO: Use the new context API introduced with version 16.3.
  // TODO: The legacy API will continue working for all 16.x releases.
  // via: https://reactjs.org/docs/legacy-context.html

  // Pass essential context to all children
  getChildContext() {
    const newContext = {
      muiTheme: this.props.properties.theme.v0.palette,
    }

    return newContext
  }
  */

  constructor(props, context) {
    super(props, context)

    // Connect to Nuxeo
    this.props.nuxeoConnect()
    this.props.getCurrentUser()

    this.state = {
      dialect: null,
    }
  }

  // Force update of theme if out of sync
  // This is a fix that may be unecessary in future versions of Material-UI, React, Reat-redux-provide
  componentDidUpdate(prevProps) {
    if (prevProps.properties.theme.id !== this.props.properties.theme.id) {
      this.props.changeTheme(this.props.properties.theme.id)
    }
  }

  render() {
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.state.dialect)

    const warnings = {}

    const preferences = getPreferences(this.props.computeLogin, selectn('response', _computeDialect2))

    return (
      <MuiThemeProvider theme={this.props.properties.theme}>
        <div
          id="AppWrapper"
          style={{
            backgroundColor: selectn('theme.v0.wrapper.backgroundColor', this.props.properties),
            fontSize: UIHelpers.getPreferenceVal('font_size', preferences),
          }}
        >
          <AppFrontController preferences={preferences} warnings={warnings} />
        </div>
      </MuiThemeProvider>
    )
  }

  // Changing a theme manually...
  /*_changeTheme(event) {
      let index = event.nativeEvent.target.selectedIndex;
      this.props.changeTheme(event.target[index].value);
    }*/
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    properties,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTheme,
  fetchDialect2,
  nuxeoConnect,
  getCurrentUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWrapper)
