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

import selectn from 'selectn'

import AppFrontController from './AppFrontController'
import FVSnackbar from './components/FVSnackbar'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js'
import FirstVoicesKidsTheme from 'views/themes/FirstVoicesKidsTheme.js'
import FirstVoicesWorkspaceTheme from 'views/themes/FirstVoicesWorkspaceTheme.js'

const { func, object, string } = PropTypes
class AppWrapper extends Component {
  intlBaseKey = 'views'

  static propTypes = {
    // REDUX: actions/dispatch/func
    changeSiteTheme: func.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      covidAlert: true,
      muiTheme: createMuiTheme(FirstVoicesTheme),
      siteTheme: 'default',
    }
  }
  componentDidUpdate(prevProps) {
    const theme = selectn('siteTheme', this.props.properties)
    const prevTheme = selectn('siteTheme', prevProps.properties)
    if (theme !== prevTheme && theme !== this.state.siteTheme) {
      let newTheme
      switch (theme) {
        case 'kids':
          newTheme = createMuiTheme(FirstVoicesKidsTheme)
          break

        case 'workspace':
          newTheme = createMuiTheme(FirstVoicesWorkspaceTheme)
          break
        default:
          newTheme = createMuiTheme(FirstVoicesTheme)
      }
      this.setState({
        muiTheme: newTheme,
        siteTheme: theme,
      })
    }
  }

  render() {
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
      <MuiThemeProvider theme={this.state.muiTheme}>
        <div id="AppWrapper">
          {covidAlert}
          <AppFrontController warnings={{}} />
        </div>
      </MuiThemeProvider>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { _windowPath } = windowPath

  return {
    computeLogin,
    properties,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeSiteTheme,
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)
