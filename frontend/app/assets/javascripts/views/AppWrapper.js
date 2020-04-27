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
import { changeSiteTheme } from 'providers/redux/reducers/navigation'

import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import AppFrontController from './AppFrontController'
import FVSnackbar from './components/FVSnackbar'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js'
import FirstVoicesKidsTheme from 'views/themes/FirstVoicesKidsTheme.js'
import FirstVoicesWorkspaceTheme from 'views/themes/FirstVoicesWorkspaceTheme.js'

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
  intlBaseKey = 'views'

  static propTypes = {
    // REDUX: actions/dispatch/func
    changeSiteTheme: func.isRequired,
    fetchDialect2: func.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      dialect: null,
      covidAlert: true,
    }
  }

  // Force update of siteTheme if out of sync
  // This is a fix that may be unecessary in future versions of Material-UI, React, Reat-redux-provide
  componentDidUpdate(prevProps) {
    if (prevProps.properties.siteTheme !== this.props.properties.siteTheme) {
      this.props.changeSiteTheme(this.props.properties.siteTheme)
    }
  }

  render() {
    const { properties } = this.props
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.state.dialect)

    const preferences = getPreferences(this.props.computeLogin, selectn('response', _computeDialect2))

    let theme = null

    switch (selectn('siteTheme', properties)) {
      case 'kids':
        theme = createMuiTheme(FirstVoicesKidsTheme)
        break

      case 'workspace':
        theme = createMuiTheme(FirstVoicesWorkspaceTheme)
        break
      default:
        theme = createMuiTheme(FirstVoicesTheme)
    }

    const covidAlert =
      new Date('April 30, 2020 12:00:00 PDT') > Date.now() && this.state.covidAlert ? (
        <>
          <FVSnackbar
            message="Join our next Virtual Open House: April 30 11 AM - 12 PM PDT"
            buttontext="Learn More"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClick={() => {
              window.open(
                'https://wiki.firstvoices.com/display/FIR1/2020/04/14/Two+upcoming+FirstVoices+virtual+open+house+sessions',
                '_blank'
              )
              this.setState({ covidAlert: false })
            }}
          />
        </>
      ) : (
        ''
      )

    return (
      <MuiThemeProvider theme={theme}>
        <div id="AppWrapper">
          {covidAlert}
          <AppFrontController preferences={preferences} warnings={{}} />
        </div>
      </MuiThemeProvider>
    )
  }

  // Changing a theme manually...
  /*_changeSiteTheme(event) {
      let index = event.nativeEvent.target.selectedIndex;
      this.props.changeSiteTheme(event.target[index].value);
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
  changeSiteTheme,
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)
