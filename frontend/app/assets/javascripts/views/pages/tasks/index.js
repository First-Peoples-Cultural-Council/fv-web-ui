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

const intl = IntlService.instance

@provide
export default class Tasks extends React.Component {
  static propTypes = {
    fetchUserDialects: PropTypes.func.isRequired,
    computeUserDialects: PropTypes.object.isRequired,
    fetchUserTasks: PropTypes.func.isRequired,
    computeUserTasks: PropTypes.object.isRequired,
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
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
      preApprovalDialogOpen: false,
      selectedTask: null,
      selectedPreapprovalTask: null,
      lastActionedTaskId: null,
      userRegistrationTasksPath: "/management/registrationRequests/",
    }

    // Bind methods to 'this'
    ;[
      "_handleTaskActions",
      "_handleRegistrationActions",
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

  _handleRegistrationActions(id, action) {
    switch (action) {
      case "approve":
        this.props.approveRegistration(
          id,
          {
            value: "approve",
          },
          null,
          intl.trans("views.pages.tasks.request_approved", "Request Approved Successfully", "words")
        )
        break

      case "reject":
        this.props.rejectRegistration(
          id,
          {
            value: "reject",
          },
          null,
          intl.trans("views.pages.tasks.request_rejected", "Request Rejected Successfully", "words")
        )
        break
    }

    this.setState({ lastActionedTaskId: id })
  }

  fetchData(newProps) {
    let userId = selectn("response.id", newProps.computeLogin)
    newProps.fetchUserTasks(userId)
    ProviderHelpers.fetchIfMissing(userId, newProps.fetchUserDialects, newProps.computeUserDialects)
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

  _saveMethod(properties) {
    this.props.approveRegistration(
      properties.id,
      {
        comment: properties.comment,
        group: properties.group,
        appurl: ConfGlobal.baseWebUIURL,
      },
      null,
      intl.trans("views.pages.tasks.request_approved", "Request Approved Successfully", "words")
    )

    this.setState({
      selectedPreapprovalTask: null,
      preApprovalDialogOpen: false,
    })
  }

  _handleOpen(id) {
    this.setState({ open: true, selectedTask: id })
  }

  _handlePreApprovalOpen(task) {
    this.props.fetchDialect2(selectn("properties.docinfo:documentId", task))
    this.setState({ preApprovalDialogOpen: true, selectedPreapprovalTask: task })
  }

  _handleClose() {
    this.setState({ open: false, preApprovalDialogOpen: false, selectedPreapprovalTask: null, selectedTask: null })
  }

  render() {
    const userID = selectn("response.id", this.props.computeLogin)

    const computeEntities = Immutable.fromJS([
      {
        id: userID,
        entity: this.props.computeUserTasks,
      },
      {
        id: userID,
        entity: this.props.computeUserDialects,
      },
      {
        id: this.state.lastActionedTaskId,
        entity: this.props.computeUserTasksReject,
      },
    ])

    const computeUserDialects = ProviderHelpers.getEntry(this.props.computeUserDialects, userID)
    const computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, userID)

    const computeDialect = ProviderHelpers.getEntry(
      this.props.computeDialect2,
      selectn("properties.docinfo:documentId", this.state.selectedPreapprovalTask)
    )

    let userTasks = []
    let userRegistrationTasks = []

    // Compute General Tasks
    ;(selectn("response", computeUserTasks) || []).map(
      function(task, i) {
        let tableRow = (
          <TableRow key={i}>
            <TableRowColumn>
              <a onTouchTap={this._handleOpen.bind(this, task.docref)}>{task.documentTitle}</a>
            </TableRowColumn>
            <TableRowColumn>
              <span>{intl.searchAndReplace(task.name)}</span>
            </TableRowColumn>
            <TableRowColumn>
              <RaisedButton
                label={intl.trans("approve", "Approve", "first")}
                secondary={true}
                onTouchTap={this._handleTaskActions.bind(this, task.id, "approve")}
              />{" "}
              &nbsp;
              <RaisedButton
                label={intl.trans("reject", "Reject", "first")}
                secondary={true}
                onTouchTap={this._handleTaskActions.bind(this, task.id, "reject")}
              />
            </TableRowColumn>
            <TableRowColumn>{task.dueDate}</TableRowColumn>
          </TableRow>
        )

        userTasks.push(tableRow)
      }.bind(this)
    )

    // Compute User Registration Tasks
    ;(selectn("response.entries", computeUserDialects) || []).map(
      function(dialect, i) {
        let uid = selectn("uid", dialect)

        let tableRow = (
          <li key={i}>
            <a href={"/tasks/users/" + uid}>
              Click here to view user registration requests to join{" "}
              <strong>{selectn("properties.dc:title", dialect)}</strong>
            </a>
          </li>
        )

        userRegistrationTasks.push(tableRow)
      }.bind(this)
    )

    return (
      <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
        <div>
          <h1>{intl.trans("tasks", "Tasks", "first")}</h1>

          <ul>{userRegistrationTasks}</ul>

          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>{intl.trans("document_title", "Document Title", "words")}</TableHeaderColumn>
                <TableHeaderColumn>{intl.trans("task_type", "Task Type", "words")}</TableHeaderColumn>
                <TableHeaderColumn>{intl.trans("actions", "Actions", "words")}</TableHeaderColumn>
                <TableHeaderColumn>{intl.trans("task_due_date", "Task Due Date", "words")}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{userTasks}</TableBody>
          </Table>

          <p>
            {userTasks.length == 0 && userRegistrationTasks.length == 0
              ? intl.trans("views.pages.tasks.no_tasks", "There are currently No tasks.")
              : ""}
          </p>

          <Dialog open={this.state.open} onRequestClose={this._handleClose} autoScrollBodyContent={true}>
            <DocumentView id={this.state.selectedTask} />
          </Dialog>

          <GroupAssignmentDialog
            title={intl.trans("approve", "Approve", "first")}
            fieldMapping={{
              id: "uid",
              title: "properties.dc:title",
            }}
            open={this.state.preApprovalDialogOpen}
            saveMethod={this._saveMethod}
            closeMethod={this._handleClose}
            selectedItem={this.state.selectedPreapprovalTask}
            dialect={computeDialect}
          />
        </div>
      </PromiseWrapper>
    )
  }
}
