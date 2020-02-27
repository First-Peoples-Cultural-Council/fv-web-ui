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

import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  approveRegistration,
  approveTask,
  fetchUserTasks,
  rejectRegistration,
  rejectTask,
} from 'providers/redux/reducers/tasks'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchUserDialects } from 'providers/redux/reducers/fvUser'
import Link from 'views/components/Link'
import selectn from 'selectn'
import FVButton from 'views/components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import StringHelpers from 'common/StringHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import DocumentView from 'views/components/Document/view'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import GroupAssignmentDialog from 'views/pages/users/group-assignment-dialog'
import IntlService from 'views/services/intl'
import '!style-loader!css-loader!./Tasks.css'
import { dictionaryListSmallScreenColumnDataTemplate } from 'views/components/Browsing/DictionaryListSmallScreen'
const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))
const intl = IntlService.instance

const { func, object } = PropTypes
export class Tasks extends Component {
  static propTypes = {
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeUserDialects: object.isRequired,
    computeUserRegistrationApprove: object.isRequired,
    computeUserRegistrationReject: object.isRequired,
    computeUserTasks: object.isRequired,
    computeUserTasksApprove: object.isRequired,
    computeUserTasksReject: object.isRequired,
    // REDUX: actions/dispatch/func
    approveRegistration: func.isRequired,
    approveTask: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchUserDialects: func.isRequired,
    fetchUserTasks: func.isRequired,
    rejectRegistration: func.isRequired,
    rejectTask: func.isRequired,
  }

  state = {
    open: false,
    preApprovalDialogOpen: false,
    selectedTask: null,
    selectedPreapprovalTask: null,
    lastActionedTaskId: null,
    userRegistrationTasksPath: '/management/registrationRequests/',
  }

  componentDidUpdate(prevProps) {
    const updatedUserId =
      selectn('response.id', prevProps.computeLogin) != selectn('response.id', this.props.computeLogin)
    const updatedUserTasksApprove = prevProps.computeUserTasksApprove != this.props.computeUserTasksApprove
    const updatedUserTasksReject = prevProps.computeUserTasksReject != this.props.computeUserTasksReject
    const updatedUserRegistrationApprove =
      prevProps.computeUserRegistrationApprove != this.props.computeUserRegistrationApprove
    const updatedUserRegistrationReject =
      prevProps.computeUserRegistrationReject != this.props.computeUserRegistrationReject

    if (
      updatedUserId ||
      updatedUserTasksApprove ||
      updatedUserTasksReject ||
      updatedUserRegistrationApprove ||
      updatedUserRegistrationReject
    ) {
      this.fetchData(this.props)
    }
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  render() {
    const userID = selectn('response.id', this.props.computeLogin)

    const _computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, userID)

    const computeDialect = ProviderHelpers.getEntry(
      this.props.computeDialect2,
      selectn('properties.docinfo:documentId', this.state.selectedPreapprovalTask)
    )

    const computeUserDialects = ProviderHelpers.getEntry(this.props.computeUserDialects, userID)
    const userRegistrationTasks = this.generateUserRegistrationTasks(selectn('response.entries', computeUserDialects))
    const userRegistrationTaskList = userRegistrationTasks.length > 0 ? <ul>{userRegistrationTasks}</ul> : null

    const hasTasks = (selectn('response', _computeUserTasks) || []).length > 0 || userRegistrationTasks.length > 0

    return (
      <PromiseWrapper
        renderOnError
        computeEntities={Immutable.fromJS([
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
        ])}
      >
        <>
          <h1>{intl.trans('tasks', 'Tasks', 'first')}</h1>

          {hasTasks === false && <h2>{intl.trans('views.pages.tasks.no_tasks', 'There are currently No tasks.')}</h2>}

          {userRegistrationTaskList}

          {hasTasks && (
            <Suspense fallback={<div>Loading...</div>}>
              <DictionaryList
                // Listview: Batch
                // batchTitleSelect="Deselect all"
                // batchTitleDeselect="Select all"
                // batchFooterIsConfirmOrDenyTitle="Delete selected phrase books?"
                // batchFooterBtnInitiate="Delete"
                // batchFooterBtnDeny="No, do not delete the selected phrase books"
                // batchFooterBtnConfirm="Yes, delete the selected phrase books"
                // batchConfirmationAction={(uids) => {}}
                // Listview: view mode buttons
                hasViewModeButtons={false}
                // Listview: computed data
                columns={this.getColumns()}
                computedData={_computeUserTasks}
                items={selectn('response', _computeUserTasks)}
                // sortHandler={(sortData) => {}}
                // Pagination
                // fetcher={(fetcherParams) => {
                //   console.log('fetcher', fetcherParams)
                //   debugger
                // }}
                // fetcherParams={{ currentPageIndex: page, pageSize: pageSize }}
                // hasPagination
                // metadata={selectn('response', _computeUserTasks)}
                dictionaryListSmallScreenTemplate={({ templateData }) => {
                  return (
                    <span className="DictionaryListSmallScreen__ContributorsListView">
                      {templateData.documentTitle}
                      <div>
                        {templateData.taskName}
                        {templateData.dueDate}
                      </div>
                      {templateData.taskActions}
                    </span>
                  )
                }}
              />
            </Suspense>
          )}

          {hasTasks && (
            <Dialog fullWidth maxWidth="md" open={this.state.open} onClose={this.handleClose}>
              <DialogContent>{this.state.selectedTask && <DocumentView id={this.state.selectedTask} />}</DialogContent>
            </Dialog>
          )}

          {hasTasks && (
            <GroupAssignmentDialog
              title={intl.trans('approve', 'Approve', 'first')}
              fieldMapping={{
                id: 'uid',
                title: 'properties.dc:title',
              }}
              open={this.state.preApprovalDialogOpen}
              saveMethod={this.saveMethod}
              closeMethod={this.handleClose}
              selectedItem={this.state.selectedPreapprovalTask}
              dialect={computeDialect}
            />
          )}
        </>
      </PromiseWrapper>
    )
  }

  fetchData = (newProps) => {
    const userId = selectn('response.id', newProps.computeLogin)
    newProps.fetchUserTasks(userId)
    ProviderHelpers.fetchIfMissing(userId, newProps.fetchUserDialects, newProps.computeUserDialects)
  }

  generateUserRegistrationTasks = (computeUserDialectsResponseEntries = []) => {
    return computeUserDialectsResponseEntries.map((dialect, i) => {
      return (
        <li key={i}>
          <Link href={`/tasks/users/${selectn('uid', dialect)}`}>
            Click here to view user registration requests to join{' '}
            <strong>{selectn('properties.dc:title', dialect)}</strong>
          </Link>
        </li>
      )
    })
  }
  /*
id: "14b1a4e4-4838-4f3e-ad32-1637d671dc27"
docref: "879a140b-8391-4c46-90da-05773070b7d4"
name: "Approve/Reject Request to Enable"
taskName: "Approve/Reject Request to Enable"
directive: "Approval to Enable required"
comment: ""
dueDate: "2020-02-13T00:45:29.116Z"
documentTitle: "WORD"
documentLink: "nxpath/default/FV/Workspaces/Data/Test/Test/TestLanguageOne/Dictionary/1581551249254@view_documents"
startDate: "2020-02-13T00:45:29.120Z"
expired: true
*/
  getColumns = () => {
    return [
      {
        name: 'documentTitle',
        title: intl.trans('document_title', 'Document Title', 'words'),
        columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRenderTypography,
        render: (v, data) => {
          return (
            <FVButton
              variant="outlined"
              color="secondary"
              className="Tasks__taskTitle"
              onClick={this.handleOpen.bind(this, data.docref)}
            >
              {v}
            </FVButton>
          )
        },
        // sortBy: 'documentTitle',
      },
      {
        name: 'taskName',
        title: intl.trans('task_type', 'Task Type', 'words'),
        render: (v) => {
          return <span className="Tasks__taskType">{intl.searchAndReplace(v)}</span>
        },
        // sortBy: 'taskName',
      },
      {
        name: 'taskActions',
        title: intl.trans('actions', 'Actions', 'words'),
        render: (v, data) => {
          return (
            <div data-testid="Tasks__approveRejectContainer" className="Tasks__approveRejectContainer">
              <FVButton
                className="Tasks__approve"
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  this.handleTaskActions(data.id, 'approve')
                }}
              >
                {intl.trans('approve', 'Approve', 'first')}
              </FVButton>

              <FVButton
                className="Tasks__reject"
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  this.handleTaskActions(data.id, 'reject')
                }}
              >
                {intl.trans('reject', 'Reject', 'first')}
              </FVButton>
            </div>
          )
        },
      },
      {
        name: 'dueDate',
        title: intl.trans('task_due_date', 'Task Due Date', 'words'),
        render: (v) => {
          return StringHelpers.formatUTCDateString(v)
        },
        // sortBy: 'dueDate',
      },
      // {
      //   name: 'actions',
      //   title: 'ACTIONS',
      //   columnDataTemplate: dictionaryListSmallScreenColumnDataTemplate.cellRender,
      //   render: (v, data) => {
      //     const uid = data.uid
      //     const url = `/${siteTheme}${dialect_path}/edit/phrasebook/${uid}`

      //     return (
      //       <ul className="Phrasebooks__actions">
      //         <li className="Phrasebooks__actionContainer Phrasebooks__actionDelete">
      //           <ConfirmationDelete
      //             reverse
      //             compact
      //             copyIsConfirmOrDenyTitle={copy.isConfirmOrDenyTitle}
      //             copyBtnInitiate={copy.btnInitiate}
      //             copyBtnDeny={copy.btnDeny}
      //             copyBtnConfirm={copy.btnConfirm}
      //             confirmationAction={() => {
      //               props.deleteCategory(uid)
      //               setDeletedUids([...deletedUids, uid])
      //             }}
      //           />
      //         </li>
      //         <li className="Phrasebooks__actionContainer">
      //           <a
      //             href={url}
      //             onClick={(e) => {
      //               e.preventDefault()
      //               NavigationHelpers.navigate(url, props.pushWindowPath, false)
      //             }}
      //           >
      //             {copy.actions.edit}
      //           </a>
      //         </li>
      //       </ul>
      //     )
      //   },
      // },
    ]
  }

  handleClose = () => {
    this.setState({ open: false, preApprovalDialogOpen: false, selectedPreapprovalTask: null, selectedTask: null })
  }

  handleOpen = (id) => {
    this.setState({ open: true, selectedTask: id })
  }

  handleTaskActions = (id, action) => {
    switch (action) {
      case 'approve':
        this.props.approveTask(
          id,
          {
            comment: '',
            status: 'validate',
          },
          null,
          intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
        )
        break

      case 'reject':
        this.props.rejectTask(
          id,
          {
            comment: '',
            status: 'reject',
          },
          null,
          intl.trans('views.pages.tasks.request_rejected', 'Request Rejected Successfully', 'words')
        )
        break
      default: // NOTE: do nothing
    }

    this.setState({ lastActionedTaskId: id })
  }

  saveMethod = (properties) => {
    this.props.approveRegistration(
      properties.id,
      {
        comment: properties.comment,
        group: properties.group,
        appurl: NavigationHelpers.getBaseWebUIURL(),
      },
      null,
      intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
    )

    this.setState({
      selectedPreapprovalTask: null,
      preApprovalDialogOpen: false,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvUser, tasks, nuxeo } = state

  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeUserDialects } = fvUser
  const {
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
    computeUserTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
  } = tasks

  return {
    computeDialect2,
    computeLogin,
    computeUserDialects,
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
    computeUserTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  approveRegistration,
  approveTask,
  fetchDialect2,
  fetchUserDialects,
  fetchUserTasks,
  rejectRegistration,
  rejectTask,
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
