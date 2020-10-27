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
import Immutable, { is, Map } from 'immutable'

import NavigationHelpers from 'common/NavigationHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { toggleMenuAction } from 'reducers/navigation'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core'
import ListItem from '@material-ui/core'
import ListItemText from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'

import NavigationClose from '@material-ui/icons/Close'

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

  /**
   * Initial state
   */
  _getInitialState = () => {
    const routes = Immutable.fromJS([
      {
        id: 'home',
        label: this.props.intlService.translate({ key: 'home', default: 'Home', case: 'first' }),
        path: NavigationHelpers.generateStaticURL('/home'),
      },
      {
        id: 'get-started',
        label: this.props.intlService.translate({ key: 'get_started', default: 'Get Started', case: 'first' }),
        path: NavigationHelpers.generateStaticURL('/content/get-started'),
      },
      {
        id: 'explore',
        label: this.props.intlService.translate({
          key: 'general.explore',
          default: 'Explore Languages',
          case: 'first',
        }),
        path: NavigationHelpers.generateStaticURL('/explore/FV/sections/Data'),
      },
      {
        id: 'kids',
        label: this.props.intlService.translate({ key: 'kids', default: 'Kids', case: 'first' }),
        path: NavigationHelpers.generateStaticURL('/kids'),
      },
      {
        id: 'contribute',
        label: this.props.intlService.translate({ key: 'contribute', default: 'Contribute', case: 'first' }),
        path: NavigationHelpers.generateStaticURL('/content/contribute'),
      },
    ])

    return {
      routes: routes,
    }
  }

  state = this._getInitialState()

  componentDidUpdate() {
    if (this.props.computeToggleMenuAction.menuVisible) {
      this.AppLeftNavClose.focus()
    }
    /**
     * If the user is connected, display modified routes (splitting Explore path)
     */
    if (selectn('isConnected', this.props.computeLogin)) {
      const nestedItems = [
        <ListItem
          button
          onClick={this._onListItemClick(NavigationHelpers.generateStaticURL('/explore/FV/Workspaces/Data/'))}
          key="Workspaces"
        >
          <ListItemText
            primary={this.props.intlService.translate({
              key: 'views.components.navigation.workspace_dialects',
              default: 'Workspace Dialects',
            })}
            secondary={
              <p>
                <FVLabel
                  transKey="views.components.navigation.view_work_in_progress"
                  defaultStr="View work in progress or unpublished content"
                />
                .
              </p>
            }
            style={{ paddingLeft: '16px' }}
            primaryTypographyProps={{ style: { fontSize: '16px' } }}
            secondaryTypographyProps={{ style: { fontSize: '14px' } }}
          />
        </ListItem>,

        <ListItem
          button
          onClick={this._onListItemClick(NavigationHelpers.generateStaticURL('/explore/FV/sections/Data/'))}
          key="sections"
        >
          <ListItemText
            primary={this.props.intlService.translate({
              key: 'views.components.navigation.published_dialects',
              default: 'Published Dialects',
            })}
            secondary={
              <p>
                <FVLabel
                  transKey="views.components.navigation.view_dialects_as_end_user"
                  defaultStr="View dialects as an end user would view them"
                />
                .
              </p>
            }
            style={{ paddingLeft: '16px' }}
            primaryTypographyProps={{ style: { fontSize: '16px' } }}
            secondaryTypographyProps={{ style: { fontSize: '14px' } }}
          />
        </ListItem>,
      ]

      const exploreEntry = this.state.routes.findEntry((value) => value.get('id') === 'explore')

      const newExploreEntry = exploreEntry[1].set('path', null).set('nestedItems', nestedItems)

      let newStateRoutes = this.state.routes.set(exploreEntry[0], newExploreEntry)

      // Insert Tasks after explore
      const currentTasksEntry = newStateRoutes.findEntry((value) => value.get('id') === 'tasks')

      if (currentTasksEntry === null) {
        newStateRoutes = newStateRoutes.insert(
          exploreEntry[0],
          new Map({
            id: 'tasks',
            label: this.props.intlService.translate({ key: 'tasks', default: 'Tasks', case: 'first' }),
            path: '/tasks/',
          })
        )
      }

      // NOTE: below triggers infinite loop
      // this.setState({ routes: newStateRoutes })

      /* NOTE:
      Had a hard time working with Immutable to determine if newStateRoutes !== this.state.routes
      Opted for converting from Immutable > JS and
      checking if `nestedItems` exists in the array that has id='explore'
      */
      const routesCurrent = this.state.routes.toJS()
      const routesCurrentExplore = routesCurrent.filter((entry) => {
        return entry.id === 'explore'
      })
      if (routesCurrentExplore[0].nestedItems === undefined) {
        this.setState({ routes: newStateRoutes })
      }
    } else {
      // NOTE: added test to prevent infinite loop
      // If user logged out, revert to initial state
      const initialState = this._getInitialState()
      if (is(initialState.routes, this.state.routes) === false) {
        this.setState(initialState)
      }
    }
  }

  render() {
    const entries = selectn('response.entries', this.props.computeLoadNavigation)
    this.additionalEntries = entries
      ? entries.map((d) => (
        <ListItem
          button
          onClick={this._onListItemClick(
            NavigationHelpers.generateStaticURL('/content/' + selectn('properties.fvpage:url', d))
          )}
          key={selectn('uid', d)}
        >
          <ListItemText
            primary={selectn('properties.dc:title', d)}
            primaryTypographyProps={{ style: { fontSize: '16px' } }}
          />
        </ListItem>
      ))
      : null

    return (
      <Drawer
        style={{ height: 'auto' }}
        open={this.props.computeToggleMenuAction.menuVisible}
        onClose={this._onRequestChange}
      >
        <div data-testid="LeftNav">
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton onClick={this._onRequestChange} color="inherit">
                <NavigationClose />
              </IconButton>
              <img src="assets/images/logo.png" style={{ padding: '0 0 5px 0' }} alt={this.props.properties.title} />
            </Toolbar>
          </AppBar>

          <List value={location.pathname} onChange={this._onNavigateRequest}>
            {this.state.routes.map((d, i) => (
              <div key={i}>
                <ListItem button onClick={this._onListItemClick(d.get('path'))} key={d.get('id')}>
                  <ListItemText primary={d.get('label')} primaryTypographyProps={{ style: { fontSize: '16px' } }} />
                </ListItem>
                {d.get('nestedItems') && <List disablePadding>{d.get('nestedItems')}</List>}
              </div>
            ))}

            {this.additionalEntries}
          </List>

          <Divider />

          {(() => {
            if (selectn('isConnected', this.props.computeLogin)) {
              return (
                <List value={location.pathname} onChange={this._onNavigateRequest}>
                  {/* <ListItem button onClick={this._onListItemClick('/profile/')} key="profile">
                    <ListItemText
                      primary={this.props.intlService.translate({
                        key: 'views.pages.users.profile.my_profile',
                        default: 'My Profile',
                        case: 'words',
                      })}
                      primaryTypographyProps={{ style: { fontSize: '16px' } }}
                    />
                  </ListItem> */}

                  <ListItem button onClick={this._onListItemClick('/logout/')} key="sign-out">
                    <ListItemText
                      primary={this.props.intlService.translate({
                        key: 'sign_out',
                        default: 'Sign Out',
                        case: 'words',
                      })}
                      primaryTypographyProps={{ style: { fontSize: '16px' } }}
                    />
                  </ListItem>
                </List>
              )
            }
          })()}
        </div>
      </Drawer>
    )
  }

  _onListItemClick(path) {
    return (event) => {
      this._onNavigateRequest(event, path)
    }
  }

  _onNavigateRequest = (event, path) => {
    if (path === null) {
      return
    }
    if (path === 'logout') {
      window.location.href = NavigationHelpers.getBaseURL() + 'logout'
    } else {
      NavigationHelpers.navigate(path, this.props.pushWindowPath, false)
    }

    // Close side-menu
    this.props.toggleMenuAction()
  }

  _onRequestChange = () => {
    // Close side-menu
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

export default connect(mapStateToProps, mapDispatchToProps)(AppLeftNav)
