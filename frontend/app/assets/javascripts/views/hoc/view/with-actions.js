import React, { Component } from 'react'
import selectn from 'selectn'
import StringHelpers from 'common/StringHelpers'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar/Toolbar'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import Dialog from '@material-ui/core/Dialog'
import IntlService from 'views/services/intl'
import { WORKSPACES } from 'common/Constants'
import '!style-loader!css-loader!./ViewWithActions.css'

const intl = IntlService.instance
export default function withActions(ComposedFilter, publishWarningEnabled = false) {
  class ViewWithActions extends Component {
    state = {
      deleteSuccessDialogOpen: false,
      deleteDialogOpen: false,
      prePublishDialogOpen: false,
      prePublishCompleteAction: null,
      publishToggleCancelled: false,
    }

    render() {
      if (!this.props.routeParams || this.props.routeParams.area != WORKSPACES) {
        return <ComposedFilter {...this.props} {...this.state} />
      }

      return (
        <div className="ViewWithActions row">
          <div className="col-xs-12">
            {(() => {
              if (selectn('response', this.props.computeItem)) {
                return (
                  <PageToolbar
                    label={StringHelpers.toTitleCase(this.props.labels.single)}
                    handleNavigateRequest={this.props.onNavigateRequest}
                    computeEntity={this.props.computeItem}
                    computePermissionEntity={this.props.permissionEntry}
                    computeLogin={this.props.computeLogin}
                    publishToggleAction={this._publishToggleAction}
                    publishChangesAction={this._publishChangesAction}
                    enableToggleAction={this._enableToggleAction}
                    {...this.props}
                  >
                    &nbsp;
                  </PageToolbar>
                )
              }
            })()}
          </div>

          <div className="col-xs-12">
            <ComposedFilter {...this.props} {...this.state} />
          </div>

          <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', this.props.computeItem) }}>
            <Dialog
              className="ViewWithActions__dialog"
              contentStyle={{ height: '20vh' }}
              autoScrollBodyContent
              title={intl.trans(
                'views.hoc.view.publish_x',
                'Publish ' + StringHelpers.toTitleCase(this.props.labels.single),
                'first',
                [StringHelpers.toTitleCase(this.props.labels.single)]
              )}
              actions={[
                <button
                  data-testid="ViewWithActions__buttonCancel"
                  type="button"
                  key="0"
                  className="FlatButton FlatButton--secondary ViewWithActions__button"
                  onClick={(e) => {
                    e.preventDefault()
                    this.setState({
                      prePublishDialogOpen: false,
                      publishToggleCancelled: true,
                      prePublishCompleteAction: null,
                    })
                  }}
                >
                  {intl.trans('cancel', 'Cancel', 'first')}
                </button>,
                <button
                  data-testid="ViewWithActions__buttonPublish"
                  type="button"
                  key="1"
                  className="FlatButton FlatButton--primary ViewWithActions__button"
                  keyboardFocused
                  onClick={(e) => {
                    e.preventDefault()
                    this.state.prePublishCompleteAction()
                  }}
                >
                  {intl.trans('publish', 'Publish', 'first')}
                </button>,
              ]}
              modal={false}
              open={this.state.prePublishDialogOpen}
              onRequestClose={() =>
                this.setState({
                  prePublishDialogOpen: false,
                  publishToggleCancelled: true,
                  prePublishCompleteAction: null,
                })
              }
            >
              {(() => {
                if (this.props.tabs && this.props.tabs.length > 0) {
                  return (
                    <div>
                      <p>
                        {intl.trans(
                          'views.hoc.view.warning1_x',
                          'Publishing this ' +
                            this.props.labels.single +
                            ' will also publish (or republish) the following related items',
                          'first',
                          [this.props.labels.single]
                        )}
                        :
                      </p>
                      <Tabs>{this.props.tabs}</Tabs>
                    </div>
                  )
                }
                return (
                  <div>
                    <p>
                      {intl.trans(
                        'views.hoc.view.warning2_x',
                        'Publishing this ' +
                          this.props.labels.single +
                          ' all the media and child items associated with it',
                        'first',
                        [this.props.labels.single]
                      )}
                    </p>
                  </div>
                )
              })()}
            </Dialog>
          </AuthorizationFilter>

          <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', this.props.computeItem) }}>
            <div className="col-xs-12" style={{ marginTop: '15px' }}>
              <Toolbar className="toolbar">
                <div key={0} float="right">
                  <Button
                    variant="contained"
                    icon={<Icon className="material-icons">delete</Icon>}
                    onClick={() => this.setState({ deleteDialogOpen: true })}
                    color="secondary"
                  >
                    {intl.trans(
                      'views.hoc.view.delete_x',
                      'Delete ' + StringHelpers.toTitleCase(this.props.labels.single),
                      'first',
                      [StringHelpers.toTitleCase(this.props.labels.single)]
                    )}
                  </Button>
                </div>
              </Toolbar>

              <Dialog
                className="ViewWithActions__dialog"
                title={intl.trans(
                  'views.hoc.view.deleting_x',
                  'Deleting ' + StringHelpers.toTitleCase(this.props.labels.single),
                  'first',
                  [StringHelpers.toTitleCase(this.props.labels.single)]
                )}
                actions={[
                  <button
                    data-testid="ViewWithActions__buttonCancel"
                    key="0"
                    type="button"
                    className="FlatButton FlatButton--secondary ViewWithActions__button"
                    onClick={(e) => {
                      e.preventDefault()
                      this.setState({ deleteDialogOpen: false })
                    }}
                  >
                    {intl.trans('cancel', 'Cancel', 'first')}
                  </button>,
                  <button
                    data-testid="ViewWithActions__buttonDelete"
                    key="1"
                    className="FlatButton FlatButton--primary ViewWithActions__button"
                    keyboardFocused
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      this._delete(selectn('response', this.props.computeItem))
                    }}
                  >
                    {intl.trans('delete', 'Delete', 'first')}
                  </button>,
                ]}
                modal={false}
                open={this.state.deleteDialogOpen}
                onRequestClose={this._handleCancelDelete}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: intl.trans(
                      'views.hoc.delete_confirm_x_x_x',
                      'Are you sure you would like to delete the ' +
                        this.props.labels.single +
                        ' <strong>' +
                        selectn('response.title', this.props.computeItem) +
                        '</strong>?<br/>' +
                        'Proceeding will also delete all published versions of this ' +
                        this.props.labels.single,
                      'first',
                      [
                        this.props.labels.single,
                        selectn('response.title', this.props.computeItem),
                        this.props.labels.single,
                      ]
                    ),
                  }}
                />
              </Dialog>

              <Dialog
                className="ViewWithActions__dialog"
                title={intl.trans(
                  'views.hoc.view.delete_x',
                  'Delete ' + StringHelpers.toTitleCase(this.props.labels.single) + ' Success',
                  'words',
                  [StringHelpers.toTitleCase(this.props.labels.single)]
                )}
                actions={[
                  <button
                    data-testid="ViewWithActions__buttonReturn"
                    type="button"
                    key="0"
                    className="FlatButton FlatButton--secondary ViewWithActions__button"
                    onClick={() => window.history.back()}
                  >
                    {intl.trans('views.hoc.view.return_to_previous_page', 'Return to Previous Page', 'words')}
                  </button>,
                  <button
                    data-testid="ViewWithActions__buttonHome"
                    type="button"
                    key="1"
                    className="FlatButton FlatButton--primary ViewWithActions__button"
                    keyboardFocused
                    onClick={(e) => {
                      e.preventDefault()
                      const url = this.props.splitWindowPath.slice(0, this.props.splitWindowPath.length - 2).join('/')
                      this.props.onNavigateRequest(`/${url}`)
                    }}
                  >
                    {intl.trans('views.hoc.view.go_to_dialect_language_home', 'Go to Dialect Language Home', 'words')}
                  </button>,
                ]}
                modal
                open={this.state.deleteSuccessDialogOpen}
              >
                {intl.trans(
                  'views.hoc.view.delete_x_success',
                  'The ' +
                    this.props.labels.single +
                    ' <strong>' +
                    selectn('response.title', this.props.computeItem) +
                    '</strong> has been successfully deleted.',
                  'first',
                  [this.props.labels.single, selectn('response.title', this.props.computeItem)]
                )}
              </Dialog>
            </div>
          </AuthorizationFilter>
        </div>
      )
    }

    _delete = (item) => {
      this.props.deleteAction(item.uid)
      this.setState({ deleteDialogOpen: false, deleteSuccessDialogOpen: true })
    }

    // Toggle (enabled/disabled)
    _enableToggleAction = (toggled, workflow) => {
      if (toggled) {
        if (workflow) {
          this.props.askToEnableAction(
            this.props.itemPath,
            {
              id: 'FVEnableLanguageAsset',
              start: 'true',
            },
            null,
            intl.trans(
              'views.hoc.view.request_to_enable_x_successfully_submitted',
              'Request to enable ' + this.props.labels.single + ' successfully submitted!',
              'first',
              [this.props.labels.single]
            ),
            null
          )
        } else {
          this.props.enableAction(
            this.props.itemPath,
            null,
            null,
            intl.trans(
              'views.hoc.view.x_enabled',
              StringHelpers.toTitleCase(this.props.labels.single) + ' Enabled!',
              'first',
              [StringHelpers.toTitleCase(this.props.labels.single)]
            )
          )
        }
      } else {
        if (workflow) {
          this.props.askToDisableAction(
            this.props.itemPath,
            {
              id: 'FVDisableLanguageAsset',
              start: 'true',
            },
            null,
            intl.trans(
              'views.hoc.view.request_to_disable_x_successfully_submitted',
              'Request to disable ' + this.props.labels.single + ' successfully submitted!',
              'first',
              [this.props.labels.single]
            ),
            null
          )
        } else {
          this.props.disableAction(
            this.props.itemPath,
            null,
            null,
            intl.trans(
              'views.hoc.view.x_disabled',
              StringHelpers.toTitleCase(this.props.labels.single) + ' Disabled!',
              'first',
              [StringHelpers.toTitleCase(this.props.labels.single)]
            )
          )
        }
      }
    }

    // Publish changes
    _publishChangesAction = () => {
      const publishChangesAction = () => {
        this.props.publishAction(
          this.props.itemPath,
          null,
          null,
          intl.trans(
            'views.hoc.view.x_published_successfully',
            StringHelpers.toTitleCase(this.props.labels.single) + ' Published Successfully!',
            'first',
            [StringHelpers.toTitleCase(this.props.labels.single)]
          )
        )
        this.setState({ prePublishCompleteAction: null, prePublishDialogOpen: false })
      }

      if (publishWarningEnabled) {
        this.setState({
          prePublishDialogOpen: true,
          prePublishCompleteAction: publishChangesAction,
        })
      } else {
        publishChangesAction()
      }
    }

    // Toggle published
    _publishToggleAction = (toggled, workflow) => {
      if (toggled) {
        if (workflow) {
          const askToPublishToggleAction = () => {
            this.props.askToPublishAction(
              this.props.itemPath,
              {
                id: 'FVPublishLanguageAsset',
                start: 'true',
              },
              null,
              intl.trans(
                'views.hoc.view.request_to_publish_x_successfully_submitted',
                'Request to publish ' + this.props.labels.single + ' successfully submitted!',
                'first',
                [this.props.labels.single]
              ),
              null
            )

            this.setState({ prePublishCompleteAction: null, prePublishDialogOpen: false })
          }

          if (publishWarningEnabled) {
            this.setState({
              prePublishDialogOpen: true,
              prePublishCompleteAction: askToPublishToggleAction,
            })
          } else {
            askToPublishToggleAction()
          }
        } else {
          const publishToggleAction = () => {
            this.props.publishAction(
              this.props.itemPath,
              null,
              null,
              intl.trans(
                'views.hoc.view.x_published_successfully',
                StringHelpers.toTitleCase(this.props.labels.single) + ' Published Successfully!',
                'first',
                [StringHelpers.toTitleCase(this.props.labels.single)]
              )
            )
            this.setState({ prePublishCompleteAction: null, prePublishDialogOpen: false })
          }

          if (publishWarningEnabled) {
            this.setState({
              prePublishDialogOpen: true,
              prePublishCompleteAction: publishToggleAction,
            })
          } else {
            publishToggleAction()
          }
        }
      } else {
        if (workflow) {
          this.props.askToUnpublishAction(
            this.props.itemPath,
            {
              id: 'FVUnpublishLanguageAsset',
              start: 'true',
            },
            null,
            intl.trans(
              'views.hoc.view.request_to_unpublish_x_successfully_submitted',
              'Request to unpublish ' + this.props.labels.single + ' successfully submitted!',
              'first',
              [this.props.labels.single]
            ),
            null
          )
        } else {
          this.props.unpublishAction(
            this.props.itemPath,
            null,
            null,
            intl.trans(
              'views.hoc.view.x_unpublished_successfully',
              StringHelpers.toTitleCase(this.props.labels.single) + ' Unpublished Successfully!',
              'first',
              [StringHelpers.toTitleCase(this.props.labels.single)]
            )
          )
        }
      }
    }
  }

  return ViewWithActions
}
