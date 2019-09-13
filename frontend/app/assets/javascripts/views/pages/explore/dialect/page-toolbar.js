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
import { List } from 'immutable'

import classNames from 'classnames'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchTasks } from 'providers/redux/reducers/tasks'

import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'

import { IconButton } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import Toolbar from '@material-ui/core/Toolbar/Toolbar'
import Switch from '@material-ui/core/Switch'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconMenu from '@material-ui/icons/Menu'
import NavigationExpandMoreIcon from '@material-ui/icons/ExpandMore'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import { WORKSPACES, SECTIONS } from 'common/Constants'

import IntlService from 'views/services/intl'

const intl = IntlService.instance

const { array, bool, func, node, object, string } = PropTypes

export class PageToolbar extends Component {
  static propTypes = {
    actions: array,
    children: node,
    computeEntity: object.isRequired,
    computePermissionEntity: object,
    enableToggleAction: func,
    handleNavigateRequest: func,
    label: string,
    publishChangesAction: func,
    publishToggleAction: func,
    showPublish: bool,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computeTasks: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchTasks: func.isRequired,
  }
  static defaultProps = {
    publishChangesAction: null,
    handleNavigateRequest: null,
    showPublish: true,
    actions: [], // ['workflow', 'edit', 'add-child', 'publish-toggle', 'enable-toggle', 'publish', 'more-options']
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      enableActions: 0,
      disableActions: 0,
      publishActions: 0,
      unpublishActions: 0,
      showActionsMobile: false,
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
    const { computeEntity, computePermissionEntity, computeLogin } = this.props

    const enableTasks = []
    const disableTasks = []
    const publishTasks = []
    const unpublishTasks = []

    const toolbarGroupItem = {
      float: 'left',
      // margin: `${(this.context.muiTheme.toolbar.height - this.context.muiTheme.button.height) / 2}px ${
      //   this.context.muiTheme.baseTheme.spacing.desktopGutter
      // }px`,
      position: 'relative',
    }

    const documentEnabled = selectn('response.state', computeEntity) === 'Enabled'
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
    const requestButtonGroupText = isRecorderWithApproval
      ? 'Request approval from the Language Admin to'
      : `${intl.trans('request', 'Request', 'first')}`
    const toolbarStyles = isRecorderWithApproval
      ? { height: 'auto' /*, minHeight: `${this.context.muiTheme.toolbar.height}px`*/ }
      : {}

    const toolbarGroupItemIsRecorderWithApproval = {
      clear: 'both',
      // margin: `${(this.context.muiTheme.toolbar.height - this.context.muiTheme.button.height) / 2}px 0`,
      position: 'relative',
    }
    const requestButtonGroupStyles = isRecorderWithApproval ? toolbarGroupItemIsRecorderWithApproval : toolbarGroupItem
    return (
      <Toolbar
        style={toolbarStyles}
        className={classNames({ isRecorderWithApproval, clearfix: true, 'page-toolbar': true })}
      >
        <div className="visible-xs" style={{ textAlign: 'right' }}>
          <IconButton
            onClick={(e) => {
              this.setState({ showActionsMobile: !this.state.showActionsMobile })
              e.preventDefault()
            }}
          >
            menu
          </IconButton>
        </div>

        <div
          float="left"
          className={classNames({ 'hidden-xs': !this.state.showActionsMobile, isRecorderWithApproval, clearfix: true })}
        >
          {this.props.children}

          {(() => {
            if (this.props.actions.includes('enable-toggle')) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}
                  style={toolbarGroupItem}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      float: 'left',
                      margin: '17px 5px 10px 5px',
                      position: 'relative',
                    }}
                  >
                    <Switch
                      checked={documentEnabled || documentPublished}
                      onChange={this._documentActionsToggleEnabled}
                      ref="enabled" // TODO: DEPRECATED
                      disabled={documentPublished}
                      name="enabled"
                      value="enabled"
                      label={intl.trans('enabled', 'Enabled', 'first')}
                    />
                  </div>
                </AuthorizationFilter>
              )
            }
          })()}

          {(() => {
            if (this.props.actions.includes('publish-toggle')) {
              if (this.props.showPublish) {
                return (
                  <AuthorizationFilter
                    filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}
                    style={toolbarGroupItem}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        float: 'left',
                        margin: '17px 5px 10px 5px',
                        position: 'relative',
                      }}
                    >
                      <Switch
                        toggled={documentPublished}
                        onToggle={this._documentActionsTogglePublished}
                        disabled={!documentEnabled && !documentPublished}
                        name="published"
                        value="published"
                        label={intl.trans('published', 'Published', 'first')}
                      />
                    </div>
                  </AuthorizationFilter>
                )
              }

              if (documentPublished) {
                return (
                  <div
                    style={{
                      display: 'inline-block',
                      float: 'left',
                      paddingTop: '16px',
                    }}
                  >
                    This dialect is <strong>public</strong>. Contact us to make it private.
                  </div>
                )
              }
              return (
                <div
                  style={{
                    display: 'inline-block',
                    float: 'left',
                    paddingTop: '16px',
                  }}
                >
                  This dialect is <strong>private</strong>. Contact us to make it public.
                </div>
              )
            }
          })()}

          {(() => {
            if (this.props.actions.includes('workflow')) {
              return (
                <AuthorizationFilter
                  filter={{
                    role: 'Record',
                    entity: selectn('response', permissionEntity),
                    secondaryPermission: 'Write',
                    login: computeLogin,
                  }}
                  style={requestButtonGroupStyles}
                >
                  <div>
                    <span style={{ paddingRight: '15px' }}>{`${requestButtonGroupText}: `}</span>

                    <Button
                      variant="contained"
                      disabled={
                        selectn('response.state', computeEntity) !== 'Disabled' &&
                        selectn('response.state', computeEntity) !== 'New'
                      }
                      style={{ marginRight: '5px', marginLeft: '0' }}
                      color="secondary"
                      onClick={this._documentActionsStartWorkflow.bind(this, 'enable')}
                    >
                      {intl.trans('enable', 'Enable', 'first') +
                        ' (' +
                        (enableTasks.length + this.state.enableActions) +
                        ')'}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={
                        selectn('response.state', computeEntity) !== 'Enabled' &&
                        selectn('response.state', computeEntity) !== 'New'
                      }
                      style={{ marginRight: '5px', marginLeft: '0' }}
                      color="secondary"
                      onClick={this._documentActionsStartWorkflow.bind(this, 'disable')}
                    >
                      {intl.trans('disable', 'Disable', 'first') +
                        ' (' +
                        (disableTasks.length + this.state.disableActions) +
                        ')'}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={selectn('response.state', computeEntity) !== 'Enabled'}
                      style={{ marginRight: '5px', marginLeft: '0' }}
                      color="secondary"
                      onClick={this._documentActionsStartWorkflow.bind(this, 'publish')}
                    >
                      {intl.trans('publish', 'Publish', 'first') +
                        ' (' +
                        (publishTasks.length + this.state.publishActions) +
                        ')'}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={selectn('response.state', computeEntity) !== 'Published'}
                      style={{ marginRight: '5px', marginLeft: '0' }}
                      color="secondary"
                      onClick={this._documentActionsStartWorkflow.bind(this, 'unpublish')}
                    >
                      {intl.trans('unpublish', 'Unpublish', 'first') +
                        ' (' +
                        (unpublishTasks.length + this.state.unpublishActions) +
                        ')'}
                    </Button>
                  </div>
                </AuthorizationFilter>
              )
            }
          })()}
        </div>

        <div float="right" className={classNames({ 'hidden-xs': !this.state.showActionsMobile })}>
          {(() => {
            if (this.props.actions.includes('publish')) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}
                  style={toolbarGroupItem}
                >
                  <Button
                    variant="contained"
                    data-guide-role="publish-changes"
                    disabled={!documentPublished}
                    style={{ marginRight: '5px', marginLeft: '0' }}
                    color="secondary"
                    onClick={this._publishChanges}
                  >
                    {intl.trans('publish_changes', 'Publish Changes', 'words')}
                  </Button>
                </AuthorizationFilter>
              )
            }
          })()}

          {(() => {
            if (this.props.actions.includes('edit')) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}
                  style={toolbarGroupItem}
                >
                  <Button
                    variant="contained"
                    style={{ marginRight: '5px', marginLeft: '0' }}
                    color="primary"
                    onClick={this.props.handleNavigateRequest.bind(
                      this,
                      this.props.windowPath.replace(SECTIONS, WORKSPACES) + '/edit'
                    )}
                  >
                    {intl.trans('edit', 'Edit', 'first') + ' ' + intl.searchAndReplace(this.props.label)}
                  </Button>
                </AuthorizationFilter>
              )
            }
          })()}

          {(() => {
            if (this.props.actions.includes('add-child')) {
              return (
                <AuthorizationFilter
                  filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}
                  style={toolbarGroupItem}
                >
                  <Button
                    variant="contained"
                    style={{ marginRight: '5px', marginLeft: '0' }}
                    onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/create')}
                    color="primary"
                  >
                    {intl.trans('add_new_page', 'Add New Page', 'words')}
                  </Button>
                </AuthorizationFilter>
              )
            }
          })()}

          <div className="hidden-xs" />

          {(() => {
            if (this.props.actions.includes('more-options')) {
              const children = [
                <MenuItem
                  onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/reports')}
                  key="reports"
                >
                  {intl.trans('reports', 'Reports', 'first')}
                </MenuItem>,
                <MenuItem
                  onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/media')}
                  key="media"
                  primaryText={intl.trans('views.pages.explore.dialect.media_browser', 'Media Browser', 'words')}
                />,
                // <MenuItem
                //   key="contributors"
                //   primaryText={intl.trans('views.pages.explore.dialect.nav_contributors', 'Contributors', 'words')}
                //   onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/contributors')}
                // />,
                // <MenuItem
                //   key="recorders"
                //   primaryText={intl.trans('views.pages.explore.dialect.nav_recorders', 'Recorders', 'words')}
                //   onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/recorders')}
                // />,
                <MenuItem
                  key="phrasebooks"
                  onClick={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/phrasebooks')}
                >
                  {intl.trans('views.pages.explore.dialect.nav_phrase_books', 'Phrase books', 'words')}
                </MenuItem>,
              ]

              return React.createElement(
                UIHelpers.isViewSize('xs') ? Menu : IconMenu,
                {
                  anchorOrigin: { horizontal: 'right', vertical: 'top' },
                  targetOrigin: { horizontal: 'right', vertical: 'top' },
                  iconButtonElement: (
                    <IconButton
                      tooltip={intl.trans('views.pages.explore.dialect.more_options', 'More Options', 'words')}
                      tooltipPosition="top-center"
                      touch
                      className={classNames({ 'hidden-xs': !this.state.showActionsMobile })}
                    >
                      <NavigationExpandMoreIcon />
                    </IconButton>
                  ),
                },
                children
              )
            }
          })()}
        </div>
      </Toolbar>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { tasks, nuxeo, windowPath } = state

  const { computeLogin } = nuxeo
  const { computeTasks } = tasks
  const { _windowPath } = windowPath

  return {
    computeLogin,
    computeTasks,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchTasks,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageToolbar)
