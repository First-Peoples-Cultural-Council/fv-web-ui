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
import React, { Component, PropTypes } from "react"
import Immutable, { Map } from "immutable"

import ConfGlobal from "conf/local.json"

import provide from "react-redux-provide"
import selectn from "selectn"

import { Divider, List, ListItem, LeftNav, AppBar } from "material-ui/lib"

import IconButton from "material-ui/lib/icon-button"
import NavigationClose from "material-ui/lib/svg-icons/navigation/close"

import { SelectableContainerEnhance } from "material-ui/lib/hoc/selectable-enhance"
import IntlService from "views/services/intl"

const SelectableList = SelectableContainerEnhance(List)

@provide
export default class AppLeftNav extends Component {
  static propTypes = {
    toggleMenuAction: PropTypes.func.isRequired,
    computeToggleMenuAction: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computeLoadNavigation: PropTypes.object.isRequired,
  }

  intl = IntlService.instance

  constructor(props, context) {
    super(props, context)

    this.state = this._getInitialState()

    // Bind methods to 'this'
    ;["_onNavigateRequest", "_onRequestChange"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  /**
   * Initial state
   */
  _getInitialState() {
    const routes = Immutable.fromJS([
      {
        id: "home",
        label: this.intl.translate({ key: "home", default: "Home", case: "first" }),
        path: "/",
      },
      {
        id: "get-started",
        label: this.intl.translate({ key: "get_started", default: "Get Started", case: "first" }),
        path: "/content/get-started/",
      },
      {
        id: "explore",
        label: this.intl.translate({ key: "general.explore", default: "Explore Languages", case: "first" }),
        path: "/explore/FV/sections/Data/",
      },
      {
        id: "kids",
        label: this.intl.translate({ key: "kids", default: "Kids", case: "first" }),
        path: "/kids",
      },
      {
        id: "contribute",
        label: this.intl.translate({ key: "contribute", default: "Contribute", case: "first" }),
        path: "/content/contribute/",
      },
    ])

    return {
      routes: routes,
    }
  }

  componentWillReceiveProps() {
    /**
     * If the user is connected, display modified routes (splitting Explore path)
     */
    if (selectn("isConnected", this.props.computeLogin)) {
      const nestedItems = [
        <ListItem
          key="Workspaces"
          value="/explore/FV/Workspaces/Data/"
          secondaryText={
            <p>
              {this.intl.translate({
                key: "views.components.navigation.view_work_in_progress",
                default: "View work in progress or unpublished content",
              })}
              .
            </p>
          }
          secondaryTextLines={2}
          primaryText={this.intl.translate({
            key: "views.components.navigation.workspace_dialects",
            default: "Workspace Dialects",
          })}
        />,

        <ListItem
          key="sections"
          value="/explore/FV/sections/Data/"
          secondaryText={
            <p>
              {this.intl.translate({
                key: "views.components.navigation.view_dialects_as_end_user",
                default: "View dialects as an end user would view them",
              })}
              .
            </p>
          }
          secondaryTextLines={2}
          primaryText={this.intl.translate({
            key: "views.components.navigation.published_dialects",
            default: "Published Dialects",
          })}
        />,
      ]

      const exploreEntry = this.state.routes.findEntry((value) => value.get("id") === "explore")

      const newExploreEntry = exploreEntry[1].set("path", null).set("nestedItems", nestedItems)

      let newState = this.state.routes.set(exploreEntry[0], newExploreEntry)

      // Insert Tasks after explore
      const currentTasksEntry = newState.findEntry((value) => value.get("id") === "tasks")

      if (currentTasksEntry === null) {
        newState = newState.insert(
          exploreEntry[0],
          new Map({
            id: "tasks",
            label: this.intl.translate({ key: "tasks", default: "Tasks", case: "first" }),
            path: "/tasks/",
          })
        )
      }
      this.setState({ routes: newState })
    } else {
      // If user logged out, revert to initial state
      this.setState(this._getInitialState())
    }
  }

  _onNavigateRequest(event, path) {
    if (path === null) {
      return
    }
    if (path === ConfGlobal.baseURL + "logout") {
      window.location.href = ConfGlobal.baseURL + "logout?requestedUrl=logout-success.jsp"
    } else {
      // Request to navigate to
      this.props.pushWindowPath(path)
    }

    // Close side-menu
    this.props.toggleMenuAction()
  }

  _onRequestChange() {
    // Close side-menu
    this.props.toggleMenuAction()
  }

  render() {
    const entries = selectn("response.entries", this.props.computeLoadNavigation)
    this.additionalEntries = entries
      ? entries.map((d) => (
          <ListItem
            className="2"
            key={selectn("uid", d)}
            value={"/content/" + selectn("properties.fvpage:url", d) + "/"}
            primaryText={selectn("properties.dc:title", d)}
          />
        ))
      : null

    return (
      <LeftNav
        docked
        style={{ height: "auto" }}
        open={this.props.computeToggleMenuAction.menuVisible}
        onRequestChange={this._onRequestChange}
      >
        <AppBar
          iconElementLeft={
            <IconButton onTouchTap={this._onRequestChange}>
              <NavigationClose />
            </IconButton>
          }
          title={
            <img src="/assets/images/logo.png" style={{ padding: "0 0 5px 0" }} alt={this.props.properties.title} />
          }
        />

        <SelectableList
          valueLink={{
            value: location.pathname,
            requestChange: this._onNavigateRequest,
          }}
        >
          {this.state.routes.map((d) => (
            <ListItem
              className="1"
              key={d.get("id")}
              value={d.get("path")}
              nestedItems={d.get("nestedItems")}
              primaryText={d.get("label")}
            />
          ))}

          {this.additionalEntries}
        </SelectableList>

        <Divider />

        {(() => {
          if (selectn("isConnected", this.props.computeLogin)) {
            return (
              <SelectableList
                valueLink={{
                  value: location.pathname,
                  requestChange: this._onNavigateRequest,
                }}
              >
                {/* <ListItem
                  key="profile"
                  value="/profile/"
                  primaryText={this.intl.translate({
                    key: "views.pages.users.profile.my_profile",
                    default: "My Profile",
                    case: "words",
                  })}
                /> */}

                <ListItem
                  key="sign-out"
                  value={ConfGlobal.baseURL + "logout"}
                  primaryText={this.intl.translate({
                    key: "sign_out",
                    default: "Sign Out",
                    case: "words",
                  })}
                />
              </SelectableList>
            )
          }
        })()}
      </LeftNav>
    )
  }
}
