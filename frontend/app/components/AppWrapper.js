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
import { changeSiteTheme } from 'reducers/navigation'

import selectn from 'selectn'

import AppFrontController from 'components/AppFrontController'
import TranslationBar from 'components/TranslationBar/TranslationBar'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import FirstVoices from 'common/themes/FirstVoices.js'
import FirstVoicesKids from 'common/themes/FirstVoicesKids.js' /// Fix this
import FirstVoicesWorkspace from 'common/themes/FirstVoicesWorkspace.js' /// Fix this

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
      muiTheme: createMuiTheme(FirstVoices),
      siteTheme: 'default',
    }
  }
  componentDidUpdate(prevProps) {
    const theme = selectn('siteTheme', this.props.properties)
    const prevTheme = selectn('siteTheme', prevProps.properties)
    if (theme !== prevTheme && theme !== this.state.siteTheme) {
      let newTheme = FirstVoices
      if (theme === 'kids') {
        newTheme = FirstVoicesKids
      }
      if (theme === 'workspace') {
        newTheme = FirstVoicesWorkspace
      }
      this.setState({
        muiTheme: createMuiTheme(newTheme),
        siteTheme: theme,
      })
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.state.muiTheme}>
        <div id="AppWrapper">
          <AppFrontController warnings={{}} />
          <TranslationBar />
        </div>
      </ThemeProvider>
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
