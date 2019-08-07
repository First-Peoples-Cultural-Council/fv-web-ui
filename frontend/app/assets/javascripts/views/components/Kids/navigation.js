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

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'
import { toggleMenuAction } from 'providers/redux/reducers/navigation'
// import { fetchUserTasks } from 'providers/redux/reducers/tasks'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

// Components
import AppBar from 'material-ui/lib/app-bar'

import Avatar from 'material-ui/lib/avatar'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import IconButton from 'material-ui/lib/icon-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

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
  }

  /*static childContextTypes = {
      client: React.object,
      muiTheme: React.object,
      siteProps: React.object
    };

    static contextTypes = {
        muiTheme: React.object.isRequired,
        siteProps: React.object.isRequired
    };

    getChildContext() {
      return {
        //client: this.props.clientStore.client,
        muiTheme: this.context.muiTheme,
        siteProps: this.context.siteProps
      };
    }*/

  constructor(props, context) {
    super(props, context)

    this.state = {
      hintTextSearch: intl.trans('search_site', 'Search Site', 'words') + ':',
    }

    this._handleMenuToggle = this._handleMenuToggle.bind(this)
    this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this)
    this.handleRequestChangeList = this.handleRequestChangeList.bind(this)
    this._handleNavigationSearchSubmit = this._handleNavigationSearchSubmit.bind(this)
    //this._test = this._test.bind(this);
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.computeLogin != this.props.computeLogin) {
  //     this.props.fetchUserTasks(selectn('response.id', newProps.computeLogin))
  //   }
  // }

  // eslint-disable-next-line
  _handleMenuToggle(event) {
    //console.log(event);
    //const test = this.props.toggle("helloworld");
    //console.log(test);
    /*this.setState({
          leftNavOpen: !this.state.leftNavOpen,
        });*/
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  handleChangeRequestLeftNav(open) {
    this.setState({
      leftNavOpen: open,
    })
  }
  // eslint-disable-next-line
  handleRequestChangeList(event, value) {
    //this.context.router.push(value);
    this.setState({
      leftNavOpen: false,
    })
  }

  _handleNavigationSearchSubmit() {
    // TODO: this.refs DEPRECATED
    const searchQueryParam = this.refs.navigationSearchField.getValue()
    const path = '/' + this.props.splitWindowPath.join('/')
    let queryPath = ''

    // Do a global search in either the workspace or section
    if (path.includes('/explore/FV/Workspaces/Data')) {
      queryPath = '/explore/FV/Workspaces/Data'
    } else if (path.includes('/explore/FV/sections/Data')) {
      queryPath = '/explore/FV/sections/Data'
    } else {
      queryPath = '/explore/FV/sections/Data'
    }

    // Clear out the input field
    // TODO: this.refs DEPRECATED
    this.refs.navigationSearchField.setValue('')
    this.props.replaceWindowPath(queryPath + '/search/' + searchQueryParam)
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

    const homeURL = !this.props.routeParams.dialect_path
      ? NavigationHelpers.generateStaticURL('/kids')
      : NavigationHelpers.generateStaticURL('/kids' + this.props.routeParams.dialect_path)

    return (
      <div className="Navigation">
        <AppBar
          title={
            <a style={{ textDecoration: 'none', color: '#fff' }} onClick={this._onNavigateRequest.bind(this, homeURL)}>
              {avatar}
              <span className="hidden-xs">
                {(selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
                  this.props.properties.title) +
                  ' ' +
                  intl.trans('views.pages.explore.dialect.for_kids', 'for Kids')}
              </span>
            </a>
          }
          showMenuIconButton
          // TODO: This doesn't seem to work
          onRightIconButtonTouchTap={() => {
            this.props.toggleMenuAction('AppLeftNav')
          }}
          // TODO: This creates an empty, transparent button that can be clicked
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        >
          <ToolbarGroup style={{ paddingTop: '5px' }}>
            <IconButton
              className={classNames({ hidden: this.props.frontpage })}
              onClick={() => NavigationHelpers.navigateBack()}
              style={{ paddingTop: 0, top: '8px', left: '-10px' }}
              iconClassName="material-icons"
              tooltipPosition="bottom-left"
              tooltip={intl.trans('back', 'Back', 'first')}
            >
              keyboard_backspace
            </IconButton>

            <IconButton
              onClick={this._onNavigateRequest.bind(this, homeURL)}
              style={{ paddingTop: 0, top: '8px', left: '-10px' }}
              iconClassName="material-icons"
              tooltipPosition="bottom-left"
              tooltip={intl.trans('home', 'Home', 'first')}
            >
              home
            </IconButton>

            <IconButton
              onClick={this._onNavigateRequest.bind(
                this,
                NavigationHelpers.generateStaticURL('/kids/FV/Workspaces/Data')
              )}
              style={{ paddingTop: 0, top: '8px', left: '-10px' }}
              iconClassName="material-icons"
              tooltipPosition="bottom-left"
              tooltip={intl.trans('choose_lang', 'Choose a Language', 'first')}
            >
              apps
            </IconButton>

            <ToolbarSeparator style={{ float: 'none', marginLeft: '0', marginRight: '15px' }} />

            <IconButton
              style={{ paddingTop: 0, paddingRight: 0, top: '8px', left: '-10px' }}
              iconClassName="material-icons"
              onClick={this._onNavigateRequest.bind(this, NavigationHelpers.generateStaticURL('/'))}
              tooltipPosition="bottom-left"
              tooltip={intl.trans('back_to_main_site', 'Back to Main Site', 'words')}
            >
              clear
            </IconButton>
          </ToolbarGroup>
        </AppBar>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, /* tasks,*/ navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  // const { computeUserTasks } = tasks
  const { splitWindowPath } = windowPath
  const { computePortal } = fvPortal

  return {
    splitWindowPath,
    properties,
    computeLogin,
    // computeUserTasks,
    computePortal,
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
