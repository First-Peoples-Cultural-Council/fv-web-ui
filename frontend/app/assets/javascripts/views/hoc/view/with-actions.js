import React, { Component } from 'react'
import selectn from 'selectn'
import StringHelpers from 'common/StringHelpers'

import AppBar from '@material-ui/core/AppBar'
import FVButton from 'views/components/FVButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar/Toolbar'

import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import { WORKSPACES } from 'common/Constants'
import '!style-loader!css-loader!./ViewWithActions.css'
import FVLabel from '../../components/FVLabel/index'
import { connect } from 'react-redux'

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
              fullWidth
              maxWidth="md"
              className="ViewWithActions__dialog"
              data-testid="ViewWithActions__dialog"
              open={this.state.prePublishDialogOpen}
              onClose={() =>
                this.setState({
                  prePublishDialogOpen: false,
                  publishToggleCancelled: true,
                  prePublishCompleteAction: null,
                })
              }
            >
              <DialogTitle>
                <FVLabel
                  transKey="views.hoc.view.publish_x"
                  defaultStr={'Publish ' + StringHelpers.toTitleCase(this.props.labels.single)}
                  transform="first"
                  params={[StringHelpers.toTitleCase(this.props.labels.single)]}
                />
              </DialogTitle>
              <DialogContent>
                {(() => {
                  if (this.props.tabs && this.props.tabs.length > 0) {
                    return (
                      <div>
                        <p>
                          <FVLabel
                            transKey="views.hoc.view.warning1_x"
                            defaultStr={
                              'Publishing this ' +
                              this.props.labels.single +
                              ' will also publish (or republish) the following related items'
                            }
                            transform="first"
                            params={[this.props.labels.single]}
                          />
                          :
                        </p>
                        <Tabs>{this.props.tabs}</Tabs>
                      </div>
                    )
                  }
                  return (
                    <div>
                      <p>
                        <FVLabel
                          transKey="views.hoc.view.warning2_x"
                          defaultStr={
                            'Publishing this ' +
                            this.props.labels.single +
                            ' all the media and child items associated with it'
                          }
                          transform="first"
                          params={[this.props.labels.single]}
                        />
                      </p>
                    </div>
                  )
                })()}
              </DialogContent>
              <DialogActions>
                <FVButton
                  data-testid="ViewWithActions__buttonCancel"
                  // className="FlatButton FlatButton--secondary ViewWithActions__button"
                  variant="contained"
                  color="secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    this.setState({
                      prePublishDialogOpen: false,
                      publishToggleCancelled: true,
                      prePublishCompleteAction: null,
                    })
                  }}
                >
                  <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
                </FVButton>
                <FVButton
                  data-testid="ViewWithActions__buttonPublish"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault()
                    this.state.prePublishCompleteAction()
                  }}
                >
                  <FVLabel transKey="publish" defaultStr="Publish" transform="first" />
                </FVButton>
              </DialogActions>
            </Dialog>
          </AuthorizationFilter>
          <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', this.props.computeItem) }}>
            <div className="col-xs-12">
              <AppBar position="static" className="PageToolbar__secondary">
                <Toolbar style={{ justifyContent: 'flex-end' }}>
                  <FVButton
                    variant="contained"
                    onClick={() => this.setState({ deleteDialogOpen: true })}
                    color="secondary"
                    data-testid="ViewWithActions__buttonDelete"
                  >
                    <DeleteIcon />
                    <FVLabel
                      transKey="views.hoc.view.delete_x"
                      defaultStr={'Delete ' + StringHelpers.toTitleCase(this.props.labels.single)}
                      transform="first"
                      params={[StringHelpers.toTitleCase(this.props.labels.single)]}
                    />
                  </FVButton>
                </Toolbar>
              </AppBar>
              <Dialog
                data-testid="ViewWithActions__dialog"
                fullWidth
                maxWidth="md"
                open={this.state.deleteDialogOpen}
                onClose={this._handleCancelDelete}
              >
                <DialogTitle>
                  <FVLabel
                    transKey="views.hoc.view.deleting_x"
                    defaultStr={'Deleting ' + StringHelpers.toTitleCase(this.props.labels.single)}
                    transform="first"
                    params={[StringHelpers.toTitleCase(this.props.labels.single)]}
                  />
                </DialogTitle>
                <DialogContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.intl.trans(
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
                </DialogContent>
                <DialogActions>
                  <FVButton
                    data-testid="ViewWithActions__buttonCancel"
                    // className="FlatButton FlatButton--secondary ViewWithActions__button"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault()
                      this.setState({ deleteDialogOpen: false })
                    }}
                  >
                    <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
                  </FVButton>
                  <FVButton
                    data-testid="ViewWithActions__buttonDelete"
                    // className="FlatButton FlatButton--primary ViewWithActions__button"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault()
                      this._delete(selectn('response', this.props.computeItem))
                    }}
                  >
                    <FVLabel transKey="delete" defaultStr="Delete" transform="first" />
                  </FVButton>
                </DialogActions>
              </Dialog>

              <Dialog
                data-testid="ViewWithActions__dialog"
                fullWidth
                maxWidth="md"
                open={this.state.deleteSuccessDialogOpen}
              >
                <DialogTitle>
                  <FVLabel
                    transKey="views.hoc.view.delete_x"
                    defaultStr={'Delete ' + StringHelpers.toTitleCase(this.props.labels.single) + ' Success'}
                    transform="words"
                    params={[StringHelpers.toTitleCase(this.props.labels.single)]}
                  />
                </DialogTitle>
                <DialogContent>
                  <FVLabel
                    transKey="views.hoc.view.delete_x_success"
                    defaultStr={
                      'The ' +
                      this.props.labels.single +
                      ' <strong>' +
                      selectn('response.title', this.props.computeItem) +
                      '</strong> has been successfully deleted.'
                    }
                    transform="first"
                    params={[this.props.labels.single, selectn('response.title', this.props.computeItem)]}
                  />
                </DialogContent>
                <DialogActions>
                  <FVButton
                    data-testid="ViewWithActions__buttonReturn"
                    // className="FlatButton FlatButton--secondary ViewWithActions__button"
                    variant="text"
                    color="secondary"
                    onClick={() => window.history.back()}
                  >
                    <FVLabel
                      transKey="views.hoc.view.return_to_previous_page"
                      defaultStr="Return to Previous Page"
                      transform="words"
                    />
                  </FVButton>
                  <FVButton
                    data-testid="ViewWithActions__buttonHome"
                    // className="FlatButton FlatButton--primary ViewWithActions__button"
                    variant="text"
                    color="primary"
                    onClick={this.props.onNavigateRequest.bind(
                      this,
                      '/' + this.props.splitWindowPath.slice(0, this.props.splitWindowPath.length - 2).join('/')
                    )}
                  >
                    <FVLabel
                      transKey="views.hoc.view.go_to_dialect_language_home"
                      defaultStr="Go to Dialect Language Home"
                      transform="words"
                    />
                  </FVButton>
                </DialogActions>
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
            this.props.intl.trans(
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
            this.props.intl.trans(
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
            this.props.intl.trans(
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
            this.props.intl.trans(
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
          this.props.intl.trans(
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
              this.props.intl.trans(
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
              this.props.intl.trans(
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
            this.props.intl.trans(
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
            this.props.intl.trans(
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

  const mapStateToProps = (state) => {
    const { locale } = state
    const { intlService } = locale

    return {
      intl: intlService,
    }
  }

  return connect(mapStateToProps)(ViewWithActions)
}
