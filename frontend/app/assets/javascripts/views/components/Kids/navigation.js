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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { toggleMenuAction } from 'providers/redux/reducers/navigation'
// import { fetchUserTasks } from 'providers/redux/reducers/tasks'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import AppBar from '@material-ui/core/AppBar'
import AppsIcon from '@material-ui/icons/Apps'
import Avatar from '@material-ui/core/Avatar'
import ClearIcon from '@material-ui/icons/Clear'
import HomeIcon from '@material-ui/icons/Home'
import IconButton from '@material-ui/core/IconButton'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import FVLabel from '../FVLabel/index'


const { array, func, object, bool } = PropTypes
export class KidsNavigation extends Component {
  static propTypes = {
    frontpage: bool,
    routeParams: object,
    // REDUX: reducers/state
    splitWindowPath: array.isRequired,
    properties: object.isRequired,
    computeLogin: object.isRequired,
    // computeUserTasks: object.isRequired,
    computePortal: object,
    // REDUX: actions/dispatch/func
    // fetchUserTasks: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    toggleMenuAction: func.isRequired,
    intl: object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      hintTextSearch: this.props.intl.trans('search_site', 'Search Site', 'words') + ':',
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    // const computeUserTasks = ProviderHelpers.getEntry(
    //   this.props.computeUserTasks,
    //   selectn('response.id', this.props.computeLogin)
    // )
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    // const userTaskCount = selectn('response.length', computeUserTasks) || 0

    const portalLogo = selectn('response.contextParameters.portal.fv-portal:logo.path', computePortal)

    const avatar = portalLogo ? (
      <Avatar src={NavigationHelpers.getBaseURL() + portalLogo} size={50} style={{ marginRight: '10px' }} />
    ) : (
      ''
    )
    const homeURL = NavigationHelpers.generateStaticURL('/kids' + this.props.routeParams.dialect_path)
    const showHome = this.props.routeParams.dialect_path !== undefined && homeURL !== window.location.pathname

    return (
      <div className="Navigation">
        <AppBar position="static">
          <Toolbar style={{ alignItems: 'center', backgroundColor: 'inherit' }}>
            <Typography variant="body1" noWrap style={{ flexGrow: 1 }}>
              <a
                style={{ textDecoration: 'none', color: '#fff' }}
                onClick={this._onNavigateRequest.bind(this, homeURL)}
              >
                {avatar}
                <span className="hidden-xs">
                  {(selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
                    this.props.properties.title) +
                    ' '
                  }
                  <FVLabel transKey="views.pages.explore.dialect.for_kids" defaultStr="for Kids" />
                </span>
              </a>
            </Typography>
            {this.props.frontpage !== true && (
              <Tooltip title={this.props.intl.trans('back', 'Back', 'first')} placement="bottom-end">
                <IconButton onClick={() => NavigationHelpers.navigateBack()}>
                  <KeyboardBackspaceIcon />
                </IconButton>
              </Tooltip>
            )}
            {showHome && (
              <Tooltip title={this.props.intl.trans('home', 'Home', 'first')} placement="bottom-end">
                <IconButton onClick={this._onNavigateRequest.bind(this, homeURL)}>
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={this.props.intl.trans('choose_lang', 'Choose a Language', 'first')} placement="bottom-end">
              <IconButton
                onClick={this._onNavigateRequest.bind(
                  this,
                  NavigationHelpers.generateStaticURL('/kids/FV/Workspaces/Data')
                )}
              >
                <AppsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={this.props.intl.trans('back_to_main_site', 'Back to Main Site', 'words')} placement="bottom-end">
              <IconButton onClick={this._onNavigateRequest.bind(this, NavigationHelpers.generateStaticURL('/'))}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, /* tasks,*/ navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  // const { computeUserTasks } = tasks
  const { splitWindowPath } = windowPath
  const { computePortal } = fvPortal
  const { intlService } = locale

  return {
    splitWindowPath,
    properties,
    computeLogin,
    // computeUserTasks,
    computePortal,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  // fetchUserTasks,
  pushWindowPath,
  replaceWindowPath,
  toggleMenuAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KidsNavigation)
