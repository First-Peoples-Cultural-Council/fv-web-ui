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
import Immutable from 'immutable'

import classNames from 'classnames'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchTasks } from 'providers/redux/reducers/tasks'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import ProviderHelpers from 'common/ProviderHelpers'

import AdminMenu from 'components/AdminMenu'
import RequestReview from 'components/RequestReview'
import VisibilityMinimal from 'components/VisibilityMinimal'

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
    computeLogin: object.isRequired,
    computePermissionEntity: object,
    handleNavigateRequest: func,
    intl: object.isRequired,
    label: string,
    publishChangesAction: func,
    showPublish: bool,
    // REDUX: reducers/state
    properties: object.isRequired,
    windowPath: string.isRequired,
  }
  static defaultProps = {
    publishChangesAction: null,
    handleNavigateRequest: null,
    showPublish: true,
    actions: [],
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showActionsMobile: false,
      anchorEl: null,
    }

    // Bind methods to 'this'
    ;['_publishChanges'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  /**
   * Publish changes directly
   */
  _publishChanges() {
    if (this.props.publishChangesAction !== null) {
      this.props.publishChangesAction()
    }
  }

  render() {
    const { actions, classes, computeEntity, computePermissionEntity } = this.props
    const documentPublished = selectn('response.state', computeEntity) === 'Published'
    const permissionEntity = selectn('response', computePermissionEntity) ? computePermissionEntity : computeEntity
    const computeEntities = Immutable.fromJS([{ id: selectn('response.uid', computeEntity), entity: computeEntity }])
    const isRecorderWithApproval = ProviderHelpers.isRecorderWithApproval(this.props.computeLogin)
    const isAdmin = ProviderHelpers.isAdmin(this.props.computeLogin)
    const hasWritePriveleges = isRecorderWithApproval || isAdmin
    const dialectPublishedMessage = documentPublished ? (
      <div>
        This site is <strong>public</strong>. Contact hello@firstvoices.com to make it private.
      </div>
    ) : (
      <div>
        This site is <strong>private</strong>. Contact hello@firstvoices.com to make it public.
      </div>
    )

    return (
      <AppBar color="primary" position="static" classes={classes} className="PageToolbar">
        <Toolbar>
          <div
            className={classNames({
              'hidden-xs': !this.state.showActionsMobile,
            })}
          >
            {this.props.children}
            {/* Dialect Message */}
            {actions.includes('dialect') && hasWritePriveleges ? (
              <div className="PageToolbar__publishUiContainer">{dialectPublishedMessage}</div>
            ) : null}
            {/* Select: Visibility */}
            {actions.includes('visibility') ? (
              <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', computeEntity) }}>
                <VisibilityMinimal.Container
                  docId={selectn('response.uid', computeEntity)}
                  docState={selectn('response.state', computeEntity)}
                  computeEntities={computeEntities || Immutable.List()}
                />
              </AuthorizationFilter>
            ) : null}
          </div>
          <div className={classNames({ 'hidden-xs': !this.state.showActionsMobile, PageToolbar__menuGroup: true })}>
            <div>
              {/* Button: Request Review */}
              {actions.includes('workflow') ? (
                <AuthorizationFilter
                  filter={{
                    role: 'Record',
                    entity: selectn('response', permissionEntity),
                    secondaryPermission: 'Write',
                    login: this.props.computeLogin,
                  }}
                >
                  <RequestReview.Container
                    docId={selectn('response.uid', computeEntity)}
                    docState={selectn('response.state', computeEntity)}
                    docType={selectn('response.type', computeEntity)}
                    computeEntities={computeEntities || Immutable.List()}
                  />
                </AuthorizationFilter>
              ) : null}
              {/* Button: Publish Changes */}
              {actions.includes('publish') && documentPublished ? (
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
              {actions.includes('edit') ? (
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
              {actions.includes('add-child') ? (
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
            {actions.includes('more-options') && hasWritePriveleges ? <AdminMenu.Container /> : null}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, windowPath, locale } = state

  const { _windowPath } = windowPath
  const { properties } = navigation
  const { intlService } = locale

  return {
    properties,
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
