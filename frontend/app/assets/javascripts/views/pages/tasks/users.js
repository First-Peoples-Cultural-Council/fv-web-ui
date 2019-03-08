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
import Immutable, { List, Map } from "immutable"
import classNames from "classnames"
import provide from "react-redux-provide"
import selectn from "selectn"

import ConfGlobal from "conf/local.json"

import t from "tcomb-form"

import Dialog from "material-ui/lib/dialog"

import ProviderHelpers from "common/ProviderHelpers"
import StringHelpers from "common/StringHelpers"

import RaisedButton from "material-ui/lib/raised-button"
import FlatButton from "material-ui/lib/flat-button"

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui/lib/table"

import SelectFactory from "views/components/Editor/fields/select"
import DocumentView from "views/components/Document/view"
import PromiseWrapper from "views/components/Document/PromiseWrapper"

import GroupAssignmentDialog from "views/pages/users/group-assignment-dialog"
import IntlService from "views/services/intl"

import AuthorizationFilter from "views/components/Document/AuthorizationFilter"

const intl = IntlService.instance

@provide
export default class UserTasks extends React.Component {
  static propTypes = {
    fetchUserRegistrationTasks: PropTypes.func.isRequired,
    computeUserRegistrationTasks: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    approveTask: PropTypes.func.isRequired,
    computeUserTasksApprove: PropTypes.object.isRequired,
    approveRegistration: PropTypes.func.isRequired,
    computeUserRegistrationApprove: PropTypes.object.isRequired,
    rejectTask: PropTypes.func.isRequired,
    computeUserTasksReject: PropTypes.object.isRequired,
    rejectRegistration: PropTypes.func.isRequired,
    computeUserRegistrationReject: PropTypes.object.isRequired,
    userUpgrade: PropTypes.func.isRequired,
    computeUserUpgrade: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
      selectedTask: null,
      selectedPreapprovalTask: null,
      lastActionedTaskId: null,
      savedItems: new List(),
      userRegistrationTasksPath: "/management/registrationRequests/",
    }

    // Bind methods to 'this'
    ;[
      "_handleTaskActions",
      "_handleOpen",
      "_handlePreApprovalOpen",
      "_handleClose",
      "fetchData",
      "_saveMethod",
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _handleTaskActions(id, action) {
    switch (action) {
      case "approve":
        this.props.approveTask(
          id,
          {
            comment: "",
            status: "validate",
          },
          null,
          intl.trans("views.pages.tasks.request_approved", "Request Approved Successfully", "words")
        )
        break

      case "reject":
        this.props.rejectTask(
          id,
          {
            comment: "",
            status: "reject",
          },
          null,
          intl.trans("views.pages.tasks.request_rejected", "Request Rejected Successfully", "words")
        )
        break
    }

    this.setState({ lastActionedTaskId: id })
  }

  _getRoleLabel(role) {
    let roleLabel = selectn("text", ProviderHelpers.userRegistrationRoles.find((rolesVal) => rolesVal.value == role))
    if (roleLabel && roleLabel != "undefined") return roleLabel.replace("I am", "")
  }

  fetchData(newProps) {
    newProps.fetchUserRegistrationTasks(this.state.userRegistrationTasksPath, {
      dialectID: selectn("routeParams.dialect", newProps),
      pruneAction: "accepted",
    })
    newProps.fetchDialect2(selectn("routeParams.dialect", newProps))
  }

  componentWillReceiveProps(newProps) {
    if (newProps.computeLogin != this.props.computeLogin) {
      this.fetchData(newProps)
    } else if (newProps.computeUserTasksApprove != this.props.computeUserTasksApprove) {
      this.fetchData(newProps)
    } else if (newProps.computeUserTasksReject != this.props.computeUserTasksReject) {
      this.fetchData(newProps)
    } else if (newProps.computeUserRegistrationApprove != this.props.computeUserRegistrationApprove) {
      this.fetchData(newProps)
    } else if (newProps.computeUserRegistrationReject != this.props.computeUserRegistrationReject) {
      this.fetchData(newProps)
    }
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  _saveMethod(properties, selectedItem) {
    this.props.userUpgrade(selectn("properties.fvuserinfo:requestedSpace", selectedItem), {
      userNames: selectn("properties.userinfo:login", selectedItem),
      groupName: properties.group,
    })

    this.setState({
      selectedPreapprovalTask: null,
      open: false,
      savedItems: this.state.savedItems.push(selectn("uid", selectedItem)),
    })
  }

  _handleOpen(id) {
    this.setState({ open: true, selectedTask: id })
  }

  _handlePreApprovalOpen(task) {
    this.setState({ open: true, selectedPreapprovalTask: task })
  }

  _handleClose() {
    this.setState({ open: false, open: false, selectedPreapprovalTask: null, selectedTask: null })
  }

  render() {
    let serverErrorMessage = ""

    const userID = selectn("response.id", this.props.computeLogin)

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.userRegistrationTasksPath,
        entity: this.props.computeUserRegistrationTasks,
      },
      {
        id: this.state.lastActionedTaskId,
        entity: this.props.computeUserTasksReject,
      },
    ])

    const computeUserRegistrationTasks = ProviderHelpers.getEntry(
      this.props.computeUserRegistrationTasks,
      this.state.userRegistrationTasksPath
    )
    const computeDialect = ProviderHelpers.getEntry(
      this.props.computeDialect2,
      selectn("routeParams.dialect", this.props)
    )
    const computeUserUpgrade = ProviderHelpers.getEntry(
      this.props.computeUserUpgrade,
      selectn("routeParams.dialect", this.props)
    )

    let userTasks = []
    let userRegistrationTasks = []

    if (selectn("success", computeUserUpgrade)) {
      switch (selectn("response.value.status", computeUserUpgrade)) {
        case 403:
          serverErrorMessage = (
            <div className={classNames("alert", "alert-danger")} role="alert">
              {selectn("response.value.entity", computeUserUpgrade)}
            </div>
          )
          break
        case 200:
          serverErrorMessage = ""
          break
      }
    }

    // Compute User Registration Tasks
    ;(selectn("response.entries", computeUserRegistrationTasks) || []).map(
      function(task, i) {
        let uid = selectn("uid", task)

        if (this.state.savedItems.includes(uid)) {
          return
        }

        let title = selectn("properties.dc:title", task)
        let firstName = selectn("properties.userinfo:firstName", task)
        let lastName = selectn("properties.userinfo:lastName", task)
        let email = selectn("properties.userinfo:email", task)
        let role = selectn("properties.fvuserinfo:role", task)
        let comment = selectn("properties.fvuserinfo:comment", task)
        let dateCreated = selectn("properties.dc:created", task)

        let tableRow = (
          <tr style={{ borderBottom: "1px solid #000" }} key={i}>
            <td>{lastName}</td>
            <td>{firstName}</td>
            <td>{email}</td>
            <td>{this._getRoleLabel(role)}</td>
            <td>{comment}</td>
            <td>{StringHelpers.formatUTCDateString(dateCreated)}</td>
            <td>
              <RaisedButton
                label={intl.trans("add_to_group", "Add to Group", "first")}
                secondary={true}
                onTouchTap={this._handlePreApprovalOpen.bind(this, task, "approve")}
              />
            </td>
          </tr>
        )

        userRegistrationTasks.push(tableRow)
      }.bind(this)
    )

    return (
      <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
        <div>
          <h1>User Registration Requests</h1>
          <p>
            The following users have marked your community portal as as their default language.
            <br />
            You can promote them to direct members of your community portal by clicking the ADD TO GROUP button.
          </p>

          {serverErrorMessage}

          <AuthorizationFilter
            showAuthError={true}
            filter={{
              role: ["Everything"],
              entity: selectn("response", computeDialect),
              login: this.props.computeLogin,
            }}
          >
            <div>
              <table border="1" style={{ width: "100%" }}>
                <thead adjustForCheckbox={false} displaySelectAll={false}>
                  <tr style={{ borderBottom: "1px solid #000" }}>
                    <th style={{ minWidth: "100px" }}>{intl.trans("last_name", "Last Name", "words")}</th>
                    <th style={{ minWidth: "100px" }}>{intl.trans("first_name", "First Name", "words")}</th>
                    <th>{intl.trans("email", "Email", "words")}</th>
                    <th style={{ minWidth: "100px" }}>{intl.trans("role", "Role", "words")}</th>
                    <th style={{ minWidth: "120px" }}>{intl.trans("comments", "Comments", "words")}</th>
                    <th>{intl.trans("date_created", "Date Created", "words")}</th>
                    <th style={{ minWidth: "150px" }}>{intl.trans("actions", "Actions", "words")}</th>
                  </tr>
                </thead>

                <tbody displayRowCheckbox={false}>
                  {userTasks}
                  {userRegistrationTasks}
                </tbody>
              </table>

              <p>
                {userTasks.length == 0 && userRegistrationTasks.length == 0
                  ? intl.trans("views.pages.tasks.no_tasks", "There are currently No tasks.")
                  : ""}
              </p>
            </div>
          </AuthorizationFilter>

          <GroupAssignmentDialog
            title={intl.trans("group_assignment", "Group Assignment", "words")}
            fieldMapping={{
              id: "uid",
              title: "properties.dc:title",
            }}
            open={this.state.open}
            saveMethod={this._saveMethod}
            closeMethod={this._handleClose}
            selectedItem={this.state.selectedPreapprovalTask}
            dialect={computeDialect}
            userUpgrade={this.props.userUpgrade}
            computeUserUpgrade={this.props.computeUserUpgrade}
          />
        </div>
      </PromiseWrapper>
    )
  }
}
