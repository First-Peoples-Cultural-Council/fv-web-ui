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
import Immutable, { List } from 'immutable'

import classNames from 'classnames'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchTasks } from 'providers/redux/reducers/tasks'

import ProviderHelpers from 'common/ProviderHelpers'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import VisibilityMinimal from 'components/VisibilityMinimal'
import AdminMenu from 'components/AdminMenu'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import { WORKSPACES, SECTIONS } from 'common/Constants'

import '!style-loader!css-loader!./PageToolbar.css'

const { array, bool, func, node, object, string } = PropTypes

export class PageToolbar extends Component {
  static propTypes = {
    classes: object, // MAT-UI
    actions: array,
    children: node,
    computeEntity: object.isRequired,
    computePermissionEntity: object,
    enableToggleAction: func,
    handleNavigateRequest: func,
    intl: object.isRequired,
    label: string,
    publishChangesAction: func,
    publishToggleAction: func,
    showPublish: bool,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computeTasks: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchTasks: func.isRequired,
  }
  static defaultProps = {
    publishChangesAction: null,
    handleNavigateRequest: null,
    showPublish: true,
    actions: [],
    // actions: ['workflow', 'edit', 'add-child', 'publish-toggle', 'enable-toggle', 'publish', 'more-options'],
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      enableActions: 0,
      disableActions: 0,
      publishActions: 0,
      unpublishActions: 0,
      showActionsMobile: false,
      anchorEl: null,
    }

    // Bind methods to 'this'
    ;[
      '_documentActionsToggleEnabled',
      '_documentActionsTogglePublished',
      '_documentActionsStartWorkflow',
      '_publishChanges',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  /**
   * Publish changes directly
   */
  _publishChanges() {
    if (this.props.publishChangesAction === null) {
      this.props.publishToggleAction(true, false, selectn('response.path', this.props.computeEntity))
    } else {
      this.props.publishChangesAction()
    }
  }

  /**
   * Toggle document (enabled/disabled)
   */
  _documentActionsToggleEnabled(event, toggled) {
    this.props.enableToggleAction(toggled, false, selectn('response.path', this.props.computeEntity))
  }

  /**
   * Toggle published document
   */
  _documentActionsTogglePublished(event, toggled) {
    this.props.publishToggleAction(toggled, false, selectn('response.path', this.props.computeEntity))
  }

  /**
   * Start a workflow
   */
  _documentActionsStartWorkflow(workflow) {
    const path = selectn('response.path', this.props.computeEntity)

    switch (workflow) {
      case 'enable':
        this.props.enableToggleAction(true, true, path)
        this.setState({ enableActions: this.state.enableActions + 1 })
        break

      case 'disable':
        this.props.enableToggleAction(false, true, path)
        this.setState({ disableActions: this.state.disableActions + 1 })
        break

      case 'publish':
        this.props.publishToggleAction(true, true, path)
        this.setState({ publishActions: this.state.publishActions + 1 })
        break

      case 'unpublish':
        this.props.publishToggleAction(false, true, path)
        this.setState({ unpublishActions: this.state.unpublishActions + 1 })
        break
      default: // Note: do nothing
    }
  }

  componentDidMount() {
    this.props.fetchTasks(selectn('response.uid', this.props.computeEntity))
  }

  render() {
    const { classes, computeEntity, computePermissionEntity, computeLogin } = this.props

    const enableTasks = []
    const disableTasks = []
    const publishTasks = []
    const unpublishTasks = []

    const documentPublished = selectn('response.state', computeEntity) === 'Published'

    const permissionEntity = selectn('response', computePermissionEntity) ? computePermissionEntity : computeEntity

    // Compute related tasks
    const _computeTasks = ProviderHelpers.getEntry(
      this.props.computeTasks,
      selectn('response.uid', this.props.computeEntity)
    )

    if (selectn('response.entries', _computeTasks)) {
      const taskList = new List(selectn('response.entries', _computeTasks))

      taskList.forEach(function taskListForEach(value) {
        switch (selectn('properties.nt:type', value)) {
          case 'Task2300':
            enableTasks.push(value)
            break

          case 'Task297b':
            disableTasks.push(value)
            break

          case 'Task6b8':
            publishTasks.push(value)
            break

          case 'Task11b1':
            unpublishTasks.push(value)
            break
          default: // Note: do nothing
        }
      })
    }

    const isRecorderWithApproval = ProviderHelpers.isRecorderWithApproval(computeLogin)

    const requestButtonGroupText = isRecorderWithApproval ? (
      'Request approval from the Language Admin to'
    ) : (
      <FVLabel transKey="request" defaultStr="Request" transform="first" />
    )

    const computeEntities = Immutable.fromJS([
      {
        id: selectn('response.uid', computeEntity),
        entity: computeEntity,
      },
    ])

    const dialectPublishedMessage = documentPublished ? (
      <div>
        This dialect is <strong>public</strong>. Contact us to make it private.
      </div>
    ) : (
      <div>
        This dialect is <strong>private</strong>. Contact hello@firstvoices.com to make it public.
      </div>
    )

    return (
      <AppBar color="primary" position="static" className="PageToolbar" classes={classes}>
        <Toolbar>
          <div
            className={classNames({
              'hidden-xs': !this.state.showActionsMobile,
            })}
          >
            {this.props.children}
            {this.props.actions.includes('dialect') ? (
              <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}>
                <div className="PageToolbar__publishUiContainer">{dialectPublishedMessage}</div>
              </AuthorizationFilter>
            ) : null}
            {this.props.actions.includes('publish-toggle') ? (
              <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}>
                <VisibilityMinimal.Container
                  docId={selectn('response.uid', computeEntity)}
                  docState={selectn('response.state', computeEntity)}
                  computeEntities={computeEntities || Immutable.List()}
                />
              </AuthorizationFilter>
            ) : null}
            {this.getStateToggles()}
            {this.props.actions.includes('workflow') ? (
              <AuthorizationFilter
                filter={{
                  role: 'Record',
                  entity: selectn('response', permissionEntity),
                  secondaryPermission: 'Write',
                  login: computeLogin,
                }}
              >
                <div className="PageToolbar__request">
                  <span>{requestButtonGroupText}:</span>
                  {/* Button: Enable */}
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    disabled={
                      selectn('response.state', computeEntity) !== 'Disabled' &&
                      selectn('response.state', computeEntity) !== 'New'
                    }
                    onClick={this._documentActionsStartWorkflow.bind(this, 'enable')}
                    variant="contained"
                  >
                    <FVLabel transKey="enable" defaultStr="Enable" transform="first" />
                    {' (' + (enableTasks.length + this.state.enableActions) + ')'}
                  </FVButton>
                  {/* Button: Disable */}
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    disabled={
                      selectn('response.state', computeEntity) !== 'Enabled' &&
                      selectn('response.state', computeEntity) !== 'New'
                    }
                    onClick={this._documentActionsStartWorkflow.bind(this, 'disable')}
                    variant="contained"
                  >
                    <FVLabel transKey="disable" defaultStr="Disable" transform="first" />
                    {' (' + (disableTasks.length + this.state.disableActions) + ')'}
                  </FVButton>
                  {/* Button: Publish */}
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    disabled={selectn('response.state', computeEntity) !== 'Enabled'}
                    onClick={this._documentActionsStartWorkflow.bind(this, 'publish')}
                    variant="contained"
                  >
                    <FVLabel transKey="publish" defaultStr="Publish" transform="first" />
                    {' (' + (publishTasks.length + this.state.publishActions) + ')'}
                  </FVButton>
                  {/* Button: Unpublish */}
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    disabled={selectn('response.state', computeEntity) !== 'Published'}
                    onClick={this._documentActionsStartWorkflow.bind(this, 'unpublish')}
                    variant="contained"
                  >
                    <FVLabel transKey="unpublish" defaultStr="Unpublish" transform="first" />
                    {' (' + (unpublishTasks.length + this.state.unpublishActions) + ')'}
                  </FVButton>
                </div>
              </AuthorizationFilter>
            ) : null}
          </div>
          <div className={classNames({ 'hidden-xs': !this.state.showActionsMobile, PageToolbar__menuGroup: true })}>
            <div>
              {/* Button: Publish Changes */}
              {this.props.actions.includes('publish') ? (
                <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}>
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    data-guide-role="publish-changes"
                    disabled={!documentPublished}
                    onClick={this._publishChanges}
                    variant="contained"
                  >
                    <FVLabel transKey="publish_changes" defaultStr="Publish Changes" transform="words" />
                  </FVButton>
                </AuthorizationFilter>
              ) : null}
              {/* Button: Edit */}
              {this.props.actions.includes('edit') ? (
                <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}>
                  <FVButton
                    className="PageToolbar__button"
                    color="primary"
                    onClick={this.props.handleNavigateRequest.bind(
                      this,
                      this.props.windowPath.replace(SECTIONS, WORKSPACES) + '/edit'
                    )}
                    variant="contained"
                  >
                    <FVLabel transKey="edit" defaultStr="Edit" transform="first" />
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {' ' + this.props.intl.searchAndReplace(this.props.label)}
                    </span>
                  </FVButton>
                </AuthorizationFilter>
              ) : null}

              {/* Button: New */}
              {this.props.actions.includes('add-child') ? (
                <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}>
                  <FVButton
                    className="PageToolbar__button"
                    color="secondary"
                    onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/create')}
                    variant="contained"
                  >
                    <FVLabel transKey="add_new_page" defaultStr="Add New Page" transform="words" />
                  </FVButton>
                </AuthorizationFilter>
              ) : null}
            </div>

            {/* Menu */}
            {this.props.actions.includes('more-options') ? <AdminMenu.Container /> : null}
          </div>
        </Toolbar>
      </AppBar>
    )
  }

  getStateToggles = () => {
    const { computeEntity, computePermissionEntity, routeParams } = this.props
    const documentEnabled = selectn('response.state', computeEntity) === 'Enabled'
    const documentPublished = selectn('response.state', computeEntity) === 'Published'
    const dialectName = routeParams.dialect_name + ' '

    const permissionEntity = selectn('response', computePermissionEntity) ? computePermissionEntity : computeEntity

    let enableToggle = null
    let publishToggle = null

    if (this.props.actions.includes('enable-toggle')) {
      enableToggle = (
        <FormControlLabel
          control={
            <Switch
              checked={documentEnabled || documentPublished}
              onChange={this._documentActionsToggleEnabled}
              disabled={documentPublished}
              name="enabled"
              value="enabled"
            />
          }
          label={
            <Typography variant="body2">
              {documentEnabled || documentPublished ? (
                <>
                  {dialectName}
                  <FVLabel transKey="members" defaultStr="Members" transform="first" />
                </>
              ) : (
                <>
                  {dialectName}
                  <FVLabel transKey="team_only" defaultStr="Team Only" transform="first" />
                </>
              )}
            </Typography>
          }
        />
      )
    }
    if (this.props.actions.includes('publish-toggle')) {
      if (this.props.showPublish) {
        publishToggle = (
          <FormControlLabel
            control={
              <Switch
                checked={documentPublished === true}
                onChange={this._documentActionsTogglePublished}
                disabled={!documentEnabled && !documentPublished}
                name="published"
                value="published"
              />
            }
            label={
              <Typography variant="body2">
                {documentPublished ? (
                  <FVLabel transKey="public" defaultStr="Public" transform="first" />
                ) : (
                  <FVLabel transKey="private" defaultStr="Private" transform="first" />
                )}
              </Typography>
            }
          />
        )
      }
    }

    return (
      <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}>
        <div className="PageToolbar__publishUiContainer">
          {enableToggle}
          {publishToggle}
        </div>
      </AuthorizationFilter>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { tasks, navigation, nuxeo, windowPath, locale } = state

  const { _windowPath } = windowPath
  const { computeLogin } = nuxeo
  const { computeTasks } = tasks
  const { properties } = navigation
  const { intlService } = locale

  return {
    computeLogin,
    computeTasks,
    properties,
    routeParams: navigation.route.routeParams,
    windowPath: _windowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchTasks,
}

const styles = {
  colorPrimary: {
    backgroundColor: '#4d948d',
  },
  colorSecondary: {
    backgroundColor: '#000',
  },
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PageToolbar))
