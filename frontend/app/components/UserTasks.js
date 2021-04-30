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

import React from 'react'
import PropTypes from 'prop-types'
import Immutable, { List } from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchUserRegistrationTasks } from 'reducers/tasks'
import { fetchDialect2 } from 'reducers/fvDialect'
import { userUpgrade } from 'reducers/fvUser'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import FVButton from 'components/FVButton'
import PromiseWrapper from 'components/PromiseWrapper'

import GroupAssignmentDialog from 'components/Users/group-assignment-dialog'

import AuthorizationFilter from 'components/AuthorizationFilter'
import FVLabel from 'components/FVLabel'

const { func, object } = PropTypes
export class UserTasks extends React.Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeUserRegistrationTasks: object.isRequired,
    computeUserUpgrade: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchUserRegistrationTasks: func.isRequired,
    userUpgrade: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false,
      selectedTask: null,
      selectedPreapprovalTask: null,
      lastActionedTaskId: null,
      savedItems: new List(),
      userRegistrationTasksPath: '/management/registrationRequests/',
    }

    // Bind methods to 'this'
    ;['_handleOpen', '_handlePreApprovalOpen', '_handleClose', 'fetchData', '_saveMethod'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  _getRoleLabel(role) {
    const roleLabel = selectn(
      'text',
      ProviderHelpers.userRegistrationRoles.find((rolesVal) => rolesVal.value == role)
    )
    if (roleLabel && roleLabel != 'undefined') return roleLabel.replace('I am', '')
  }

  fetchData(newProps) {
    newProps.fetchUserRegistrationTasks(this.state.userRegistrationTasksPath, {
      dialectID: selectn('routeParams.dialect', newProps),
      pruneAction: 'accepted',
    })
    newProps.fetchDialect2(selectn('routeParams.dialect', newProps))
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  _saveMethod(properties, selectedItem) {
    this.props.userUpgrade(selectn('properties.fvuserinfo:requestedSpace', selectedItem), {
      userNames: selectn('properties.userinfo:login', selectedItem),
      groupName: properties.group,
    })

    this.setState({
      selectedPreapprovalTask: null,
      open: false,
      savedItems: this.state.savedItems.push(selectn('uid', selectedItem)),
    })
  }

  _handleOpen(id) {
    this.setState({ open: true, selectedTask: id })
  }

  _handlePreApprovalOpen(task) {
    this.setState({ open: true, selectedPreapprovalTask: task })
  }

  _handleClose() {
    this.setState({ open: false, selectedPreapprovalTask: null, selectedTask: null })
  }

  render() {
    let serverErrorMessage = ''

    // const userID = selectn('response.id', this.props.computeLogin)

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.userRegistrationTasksPath,
        entity: this.props.computeUserRegistrationTasks,
      },
    ])

    const computeUserRegistrationTasks = ProviderHelpers.getEntry(
      this.props.computeUserRegistrationTasks,
      this.state.userRegistrationTasksPath
    )
    const computeDialect = ProviderHelpers.getEntry(
      this.props.computeDialect2,
      selectn('routeParams.dialect', this.props)
    )
    const computeUserUpgrade = ProviderHelpers.getEntry(
      this.props.computeUserUpgrade,
      selectn('routeParams.dialect', this.props)
    )

    const userTasks = []
    const userRegistrationTasks = []

    if (selectn('success', computeUserUpgrade)) {
      switch (selectn('response.value.status', computeUserUpgrade)) {
        case 403:
          serverErrorMessage = (
            <div className={classNames('alert', 'alert-danger')} role="alert">
              {selectn('response.value.entity', computeUserUpgrade)}
            </div>
          )
          break
        case 200:
          serverErrorMessage = ''
          break
        default: // NOTE: do nothing
      }
    }

    // Compute User Registration Tasks
    ;(selectn('response.entries', computeUserRegistrationTasks) || []).map(
      function registrationTasksMap(task, i) {
        const uid = selectn('uid', task)

        if (this.state.savedItems.includes(uid)) {
          return
        }

        // const title = selectn('properties.dc:title', task)
        const firstName = selectn('properties.userinfo:firstName', task)
        const lastName = selectn('properties.userinfo:lastName', task)
        const email = selectn('properties.userinfo:email', task)
        const role = selectn('properties.fvuserinfo:role', task)
        const comment = selectn('properties.fvuserinfo:comment', task)
        const dateCreated = selectn('properties.dc:created', task)

        const tableRow = (
          <tr style={{ borderBottom: '1px solid #000' }} key={i}>
            <td>{lastName}</td>
            <td>{firstName}</td>
            <td>{email}</td>
            <td>{this._getRoleLabel(role)}</td>
            <td>{comment}</td>
            <td>{StringHelpers.formatUTCDateString(dateCreated)}</td>
            <td>
              <FVButton
                variant="contained"
                color="secondary"
                onClick={this._handlePreApprovalOpen.bind(this, task, 'approve')}
              >
                <FVLabel transKey="add_to_group" defaultStr="Add to Group" transform="first" />
              </FVButton>
            </td>
          </tr>
        )

        userRegistrationTasks.push(tableRow)
      }.bind(this)
    )

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div>
          <h1>User Registration Requests</h1>
          <p>
            The following users have marked your community portal as as their default language.
            <br />
            You can promote them to direct members of your community portal by clicking the ADD TO GROUP button.
          </p>

          {serverErrorMessage}

          <AuthorizationFilter
            showAuthError
            filter={{
              role: ['Everything'],
              entity: selectn('response', computeDialect),
              login: this.props.computeLogin,
            }}
          >
            <div>
              <table border="1" style={{ width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #000' }}>
                    <th style={{ minWidth: '100px' }}>
                      <FVLabel transKey="last_name" defaultStr="Last Name" transform="words" />
                    </th>
                    <th style={{ minWidth: '100px' }}>
                      <FVLabel transKey="first_name" defaultStr="First Name" transform="words" />
                    </th>
                    <th>
                      <FVLabel transKey="email" defaultStr="Email" transform="words" />
                    </th>
                    <th style={{ minWidth: '100px' }}>
                      <FVLabel transKey="role" defaultStr="Role" transform="words" />
                    </th>
                    <th style={{ minWidth: '120px' }}>
                      <FVLabel transKey="comments" defaultStr="Comments" transform="words" />
                    </th>
                    <th>
                      <FVLabel transKey="date_created" defaultStr="Date Added to FirstVoices" transform="words" />
                    </th>
                    <th style={{ minWidth: '150px' }}>
                      <FVLabel transKey="actions" defaultStr="Actions" transform="words" />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {userTasks}
                  {userRegistrationTasks}
                </tbody>
              </table>

              <p>
                {userTasks.length === 0 && userRegistrationTasks.length === 0 ? (
                  <FVLabel transKey="views.pages.tasks.no_tasks" defaultStr="There are currently No tasks." />
                ) : (
                  ''
                )}
              </p>
            </div>
          </AuthorizationFilter>

          <GroupAssignmentDialog
            title={this.props.intl.trans('group_assignment', 'Group Assignment', 'words')}
            fieldMapping={{
              id: 'uid',
              title: 'properties.dc:title',
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

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvUser, tasks, nuxeo, locale } = state

  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeUserRegistrationTasks } = tasks
  const { computeUserUpgrade } = fvUser
  const { intlService } = locale
  return {
    computeDialect2,
    computeLogin,
    computeUserRegistrationTasks,
    computeUserUpgrade,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchUserRegistrationTasks,
  userUpgrade,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTasks)
