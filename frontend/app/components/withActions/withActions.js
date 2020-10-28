import React, { Component } from 'react'
import selectn from 'selectn'
import { connect } from 'react-redux'
import StringHelpers from 'common/StringHelpers'

import AppBar from '@material-ui/core/AppBar'
import FVButton from 'components/FVButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Toolbar from '@material-ui/core/Toolbar/Toolbar'

import PageToolbar from 'components/PageToolbar'
import AuthorizationFilter from 'components/AuthorizationFilter'
import { WORKSPACES } from 'common/Constants'
import '!style-loader!css-loader!./withActions.css'
import FVLabel from 'components/FVLabel'
import WarningBanner from 'components/WarningBanner'
import RequestReview from 'components/RequestReview'

import PublishDialog from 'components/PublishDialog'

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

      const permissionEntity = selectn('response', this.props.permissionEntry)
        ? this.props.permissionEntry
        : this.props.computeItem

      return (
        <div className="ViewWithActions row">
          <div>
            {(() => {
              if (selectn('response', this.props.computeItem)) {
                return (
                  <>
                    <PageToolbar
                      label={StringHelpers.toTitleCase(this.props.labels.single)}
                      handleNavigateRequest={this.props.onNavigateRequest}
                      computeEntity={this.props.computeItem}
                      computePermissionEntity={this.props.permissionEntry}
                      computeLogin={this.props.computeLogin}
                      publishChangesAction={this._publishChangesAction}
                      {...this.props}
                    >
                      &nbsp;
                    </PageToolbar>
                    {this._hasPendingReview(selectn('response', this.props.computeItem))}
                  </>
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
                  if (this.props.tabsData) {
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
                        <PublishDialog.Container data={this.props.tabsData} />
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
          <AuthorizationFilter filter={{ permission: 'Write', entity: selectn('response', permissionEntity) }}>
            <div>
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

    _hasPendingReview = (item) => {
      return item ? (
        <div className="col-xs-12">
          <div className="ViewWithActions__warning ">
            <RequestReview.Data docId={item.uid} docState={item.state} docType={item.type}>
              {({ hasRelatedTasks, docTypeName }) => {
                return hasRelatedTasks && docTypeName ? (
                  <WarningBanner.Presentation
                    message={
                      'A review task exists for this ' +
                      docTypeName +
                      ', any saved changes to this ' +
                      docTypeName +
                      ' will clear that task.'
                    }
                  />
                ) : null
              }}
            </RequestReview.Data>
          </div>
        </div>
      ) : null
    }

    _delete = (item) => {
      this.props.deleteAction(item.uid)
      this.setState({ deleteDialogOpen: false, deleteSuccessDialogOpen: true })
    }

    // Publish changes
    _publishChangesAction = () => {
      const publishChangesAction = () => {
        this.props.publishAction(
          this.props.itemPath,
          { value: 'Republish' },
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
