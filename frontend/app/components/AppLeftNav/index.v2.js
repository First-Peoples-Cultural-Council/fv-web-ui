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
import { toggleMenuAction } from 'reducers/navigation'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import { Collapse, Divider, Drawer, List, ListItem, ListItemText, Toolbar } from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Close from '@material-ui/icons/Close'
import { withTheme } from '@material-ui/core/styles'

import '!style-loader!css-loader!./AppLeftNav.css'
import FVLabel from 'components/FVLabel'

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
    intlService: object.isRequired,
  }
  state = {
    navExploreOpen: false,
  }
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
        <ListItemText
          primary={this.props.intlService.translate({ key: 'home', default: 'Home', case: 'first' })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
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
        <ListItemText
          primary={this.props.intlService.translate({ key: 'get_started', default: 'Get Started', case: 'first' })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
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
        <ListItemText
          primary={this.props.intlService.translate({ key: 'kids', default: 'Kids', case: 'first' })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
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
        <ListItemText
          primary={this.props.intlService.translate({ key: 'contribute', default: 'Contribute', case: 'first' })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
      </ListItem>
    ),
  }
  render() {
    const _backgroundColor = selectn('theme.appBar.backgroundColor', this.props)
    const backgroundColor = _backgroundColor ? _backgroundColor : 'transparent'
    return (
      <Drawer
        style={{ height: 'auto' }}
        open={this.props.computeToggleMenuAction.menuVisible}
        onClose={() => {
          this.props.toggleMenuAction()
        }}
      >
        <div data-testid="LeftNav">
          <Toolbar disableGutters style={{ backgroundColor }}>
            <div className="AppLeftNav__toolbar">
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
              <div className="AppLeftNav__logo">
                <img src="assets/images/logo.png" alt={this.props.properties.title} />
              </div>
            </div>
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
        <ListItemText
          primary={selectn('properties.dc:title', item)}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
      </ListItem>
    ))

    const navLoggedIn = [
      this.navCommon.home,
      this.navCommon.getStarted,
      <ListItem key="navExploreLoggedIn" button onClick={this.handleNestedClick}>
        <ListItemText
          primary={this.props.intlService.translate({
            key: 'general.explore',
            default: 'Explore Languages',
            case: 'first',
          })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
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
              primary={this.props.intlService.translate({
                key: 'views.components.navigation.workspace_dialects',
                default: 'Workspace Dialects',
              })}
              primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
              secondary={
                <span>
                  <FVLabel
                    transKey="views.components.navigation.view_work_in_progress"
                    defaultStr="View work in progress or unpublished content"
                  />
                  .
                </span>
              }
              secondaryTypographyProps={{ style: { fontSize: '1.4rem' } }}
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
              primary={this.props.intlService.translate({
                key: 'views.components.navigation.published_dialects',
                default: 'Published Dialects',
              })}
              primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
              secondary={
                <span>
                  <FVLabel
                    transKey="views.components.navigation.view_dialects_as_end_user"
                    defaultStr="View dialects as an end user would view them"
                  />
                  .
                </span>
              }
              secondaryTypographyProps={{ style: { fontSize: '14px' } }}
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
        <ListItemText
          primary={this.props.intlService.translate({ key: 'tasks', default: 'Tasks', case: 'first' })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
        />
      </ListItem>,
      this.navCommon.kids,
      this.navCommon.contribute,
      ...additionalEntries,
      <Divider key="navDivider" />,
      <ListItem key="navSignOut" button component="a" href={NavigationHelpers.getBaseURL() + 'logout'}>
        <ListItemText
          primary={this.props.intlService.translate({
            key: 'sign_out',
            default: 'Sign Out',
            case: 'words',
          })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
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
          primary={this.props.intlService.translate({
            key: 'general.explore',
            default: 'Explore Languages',
            case: 'first',
          })}
          primaryTypographyProps={{ style: { fontSize: '1.6rem' } }}
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
  const { navigation, nuxeo, locale } = state

  const { computeLogin } = nuxeo
  const { computeLoadNavigation, computeToggleMenuAction, properties } = navigation
  const { intlService } = locale

  return {
    computeLogin,
    computeLoadNavigation,
    computeToggleMenuAction,
    properties,
    intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  toggleMenuAction,
  pushWindowPath,
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(AppLeftNav))
