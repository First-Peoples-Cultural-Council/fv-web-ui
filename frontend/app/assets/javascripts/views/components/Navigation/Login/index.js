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
import ReactDOM from "react-dom"

import ConfGlobal from "conf/local.json"

import provide from "react-redux-provide"
import selectn from "selectn"

// Components
import Popover from "material-ui/lib/popover/popover"
import FlatButton from "material-ui/lib/flat-button"
import IconButton from "material-ui/lib/icon-button"
import RaisedButton from "material-ui/lib/raised-button"
import TextField from "material-ui/lib/text-field"

import ActionExitToAppIcon from "material-ui/lib/svg-icons/action/exit-to-app"

import CircularProgress from "material-ui/lib/circular-progress"

import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect"
import IntlService from "views/services/intl"

@provide
export default class Login extends Component {
  intl = IntlService.instance

  static propTypes = {
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    routeParams: PropTypes.object,
  }

  componentDidUpdate(prevProps) {
    //if (prevProps.userStore.currentUser !== this.props.userStore.currentUser) {
    //  this._handleClose();
    //}
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
      loginAttempted: false,
      loginAttemptCleared: false,
    }

    this.anchorEl = null
    ;["_handleOpen", "_handleClose", "_onNavigateRequest"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _handleOpen(event) {
    event.preventDefault()

    if (isMobile) {
      this._onNavigateRequest("login")
      return
    }

    this.setState({
      open: true,
    })
  }

  _handleClose() {
    this.setState({
      open: false,
    })
  }

  _onNavigateRequest(path) {
    let dest = "/" + path + "/"

    if (selectn("routeParams.dialect_path", this.props) && path === "register") {
      dest = "/explore" + this.props.routeParams.dialect_path + "/" + path
    }

    this._handleClose()
    this.props.pushWindowPath(dest)
  }

  render() {
    const themePalette = this.props.properties.theme.palette.rawTheme.palette
    const TextFieldStyle = {
      border: "1px solid",
      borderColor: "#a2291d",
      width: "100%",
      paddingLeft: "5px",
      height: "34px",
      lineHeight: "10px",
      fontSize: "14px",
    }

    let loginFeedbackMessage = ""

    if (this.props.computeLogin.isFetching) {
      return (
        <div style={{ display: "inline-block", paddingRight: "10px", color: "#fff" }}>
          {this.intl.translate({
            key: "views.components.navigation.processing_request",
            default: "Processing request",
            case: "first",
          })}
          ...
        </div>
      )
    }

    // Handle success (anonymous or actual)
    if (this.props.computeLogin.success && this.props.computeLogin.isConnected) {
      return (
        <div className="hidden-xs" style={{ display: "inline-block", paddingRight: "15px" }}>
          {this.intl.translate({ key: "general.welcome", default: "WELCOME", case: "upper" })},{" "}
          {selectn("response.properties.firstName", this.props.computeLogin)}
        </div>
      )
    } else {
      if (this.state.loginAttempted) {
        loginFeedbackMessage = this.intl.translate({
          key: "pages.users.login.incorrect_username_password",
          default: "Username or password incorrect",
          case: "first",
        })
        if (this.props.computeLogin.isError) {
          loginFeedbackMessage = this.props.computeLogin.error
        }
      }
    }

    return (
      <div style={{ display: "inline-block", padding: "0 0 0 10px" }}>
        <a className="nav_link" href={ConfGlobal.baseURL + "login.jsp"}>
          SIGN IN
        </a>
      </div>
    )
  }
}
