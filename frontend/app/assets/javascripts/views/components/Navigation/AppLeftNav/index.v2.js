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
// import Immutable, { is, Map } from 'immutable'

import NavigationHelpers from 'common/NavigationHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { toggleMenuAction } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import { Collapse, Divider, Drawer, List, ListItem, ListItemText, Toolbar } from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Close from '@material-ui/icons/Close'

import IntlService from 'views/services/intl'
import '!style-loader!css-loader!./AppLeftNav.css'

const { func, object } = PropTypes
export class AppLeftNav extends Component {
  static propTypes = {
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computeLoadNavigation: object.isRequired,
    computeToggleMenuAction: object.isRequired,
    properties: object.isRequired,
    // REDUX: actions/dispatch/func
    toggleMenuAction: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  state = {
    navExploreOpen: false,
  }
  intl = IntlService.instance
  navCommon = {
    home: (
      <ListItem
        key="navHome"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/home')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/home'))
        }}
      >
        <ListItemText primary={this.intl.translate({ key: 'home', default: 'Home', case: 'first' })} />
      </ListItem>
    ),
    getStarted: (
      <ListItem
        key="navGetStarted"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/content/get-started')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/content/get-started'))
        }}
      >
        <ListItemText primary={this.intl.translate({ key: 'get_started', default: 'Get Started', case: 'first' })} />
      </ListItem>
    ),
    kids: (
      <ListItem
        key="navKids"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/kids')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/kids'))
        }}
      >
        <ListItemText primary={this.intl.translate({ key: 'kids', default: 'Kids', case: 'first' })} />
      </ListItem>
    ),
    contribute: (
      <ListItem
        key="navContribute"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/content/contribute')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/content/contribute'))
        }}
      >
        <ListItemText primary={this.intl.translate({ key: 'contribute', default: 'Contribute', case: 'first' })} />
      </ListItem>
    ),
  }
  render() {
    return (
      <Drawer
        style={{ height: 'auto' }}
        open={this.props.computeToggleMenuAction.menuVisible}
        onClose={() => {
          this.props.toggleMenuAction()
        }}
      >
        <div data-testid="LeftNav" style={{ backgroundColor: 'red' }}>
          <Toolbar>
            <button
              type="button"
              className="AppLeftNav__close"
              data-testid="AppLeftNav__close"
              onClick={() => {
                this.props.toggleMenuAction()
              }}
            >
              <Close className="AppLeftNav__closeIcon" />
              <span className="visually-hidden">Menu close</span>
            </button>
            <img src="assets/images/logo.png" style={{ padding: '0 0 5px 0' }} alt={this.props.properties.title} />
          </Toolbar>

          {this.getNavigation()}
        </div>
      </Drawer>
    )
  }
  handleNestedClick = () => {
    this.setState((state) => ({ navExploreOpen: !state.navExploreOpen }))
  }
  getNavigation = () => {
    const isLoggedIn = selectn('isConnected', this.props.computeLogin)

    const _additionalEntries = selectn('response.entries', this.props.computeLoadNavigation) || []
    const additionalEntries = _additionalEntries.map((item) => (
      <ListItem
        key={selectn('uid', item)}
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/content/' + selectn('properties.fvpage:url', item))}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/content/' + selectn('properties.fvpage:url', item)))
        }}
      >
        <ListItemText primary={selectn('properties.dc:title', item)} />
      </ListItem>
    ))

    const navLoggedIn = [
      this.navCommon.home,
      this.navCommon.getStarted,
      <ListItem key="navExploreLoggedIn" button onClick={this.handleNestedClick}>
        <ListItemText
          primary={this.intl.translate({ key: 'general.explore', default: 'Explore Languages', case: 'first' })}
        />
        {this.state.navExploreOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>,
      <Collapse key="navExploreCollapse" in={this.state.navExploreOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            key="navExploreWorkspaces"
            button
            component="a"
            href={NavigationHelpers.generateStaticURL('/explore/FV/Workspaces/Data/')}
            onClick={(e) => {
              e.preventDefault()
              this.handleNavClick(NavigationHelpers.generateStaticURL('/explore/FV/Workspaces/Data/'))
            }}
          >
            <ListItemText
              primary={this.intl.translate({
                key: 'views.components.navigation.workspace_dialects',
                default: 'Workspace Dialects',
              })}
              secondary={
                <p>
                  {this.intl.translate({
                    key: 'views.components.navigation.view_work_in_progress',
                    default: 'View work in progress or unpublished content',
                  })}
                  .
                </p>
              }
            />
          </ListItem>
          <ListItem
            key="navExploreSections"
            button
            component="a"
            href={NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/')}
            onClick={(e) => {
              e.preventDefault()
              this.handleNavClick(NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'))
            }}
          >
            <ListItemText
              primary={this.intl.translate({
                key: 'views.components.navigation.published_dialects',
                default: 'Published Dialects',
              })}
              secondary={
                <p>
                  {this.intl.translate({
                    key: 'views.components.navigation.view_dialects_as_end_user',
                    default: 'View dialects as an end user would view them',
                  })}
                  .
                </p>
              }
            />
          </ListItem>
        </List>
      </Collapse>,
      <ListItem
        key="navTasks"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/tasks')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/tasks'))
        }}
      >
        <ListItemText primary={this.intl.translate({ key: 'tasks', default: 'Tasks', case: 'first' })} />
      </ListItem>,
      this.navCommon.kids,
      this.navCommon.contribute,
      ...additionalEntries,
      <Divider key="navDivider" />,
      <ListItem key="navSignOut" button component="a" href={NavigationHelpers.getBaseURL() + 'logout'}>
        <ListItemText
          primary={this.intl.translate({
            key: 'sign_out',
            default: 'Sign Out',
            case: 'words',
          })}
        />
      </ListItem>,
    ]
    const navLoggedOut = [
      this.navCommon.home,
      this.navCommon.getStarted,
      <ListItem
        key="navExplore"
        button
        component="a"
        href={NavigationHelpers.generateStaticURL('/explore/FV/sections/Data')}
        onClick={(e) => {
          e.preventDefault()
          this.handleNavClick(NavigationHelpers.generateStaticURL('/explore/FV/sections/Data'))
        }}
      >
        <ListItemText
          primary={this.intl.translate({ key: 'general.explore', default: 'Explore Languages', case: 'first' })}
        />
      </ListItem>,
      this.navCommon.kids,
      this.navCommon.contribute,
      ...additionalEntries,
    ]

    return <List>{isLoggedIn ? navLoggedIn : navLoggedOut}</List>
  }

  handleNavClick = (path) => {
    NavigationHelpers.navigate(path, this.props.pushWindowPath, false)
    this.props.toggleMenuAction()
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, nuxeo } = state

  const { computeLogin } = nuxeo
  const { computeLoadNavigation, computeToggleMenuAction, properties } = navigation

  return {
    computeLogin,
    computeLoadNavigation,
    computeToggleMenuAction,
    properties,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  toggleMenuAction,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLeftNav)
