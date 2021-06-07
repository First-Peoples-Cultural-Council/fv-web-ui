import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List } from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'
import { Document } from 'nuxeo'
import t from 'tcomb-form'

// Material UI
import { Popover } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// FPCC
import { updateDocument, updateAndPublishDocument } from 'reducers/document'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import FVSnackbar from 'components/FVSnackbar'
import WarningBanner from 'components/WarningBanner'
import RequestReview from 'components/RequestReview'
import './withForm.css'

const confirmationButtonsStyle = { padding: '4px', marginLeft: '5px', border: '1px solid gray' }

export default function withForm(ComposedFilter) {
  const _navigateOnSave = (path, method) => {
    setTimeout(function navigateAfterTimeout() {
      NavigationHelpers.navigateUp(path, method)
    }, 1000)
  }
  class ViewWithForm extends Component {
    static propTypes = {
      context: PropTypes.object,
      fields: PropTypes.object.isRequired,
      options: PropTypes.object.isRequired,
      type: PropTypes.string.isRequired,
      initialValues: PropTypes.object,
      itemId: PropTypes.string.isRequired,
      cancelMethod: PropTypes.func,
      currentPath: PropTypes.array,
      navigationMethod: PropTypes.func,
      computeEntities: PropTypes.instanceOf(List).isRequired,
      computeDialect: PropTypes.object.isRequired,
      computeLogin: PropTypes.object.isRequired,
      updateDocument: PropTypes.func.isRequired,
      updateAndPublishDocument: PropTypes.func.isRequired,
    }

    static defaultProps = {
      cancelMethod: () => {},
    }

    constructor(props, context) {
      super(props, context)

      this.state = {
        formValue: null,
        showCancelWarning: false,
        saved: false,
        snackBarOpen: false,
      }
    }

    _getComputeItem(props) {
      const { computeEntities, itemId } = props

      const item = computeEntities.find((value /*, key*/) => value.get('id') === itemId)

      return ProviderHelpers.getEntry(item.get('entity'), itemId)
    }

    _onRequestSaveForm = (e, computedItem, publish = false) => {
      e.preventDefault()
      const formValue = this['form_' + this.props.type].getValue()
      const properties = {}
      if (formValue) {
        for (const key in formValue) {
          if (Object.prototype.hasOwnProperty.call(formValue, key) && key) {
            // NOTE: we can encounter checkboxes that have formValue[key] === false.
            // If we just used `if (formValue[key])` in the following conditional,
            // we'd toss out unselected checkboxes
            if (formValue[key] !== undefined && formValue[key] !== '') {
              // Filter out null values in an array
              if (formValue[key] instanceof Array) {
                const formValueKey = formValue[key].filter((item) => item !== null)
                properties[key] = formValueKey
              } else {
                properties[key] = formValue[key]
              }
            }
          }
        }
        const newDocument = new Document(computedItem.response, {
          repository: computedItem.response._repository,
          nuxeo: computedItem.response._nuxeo,
        })
        // Set new value property on document
        newDocument.set(properties)

        if (publish) {
          this.props.updateAndPublishDocument(newDocument)
        } else {
          this.props.updateDocument(newDocument)
        }

        this.setState({
          snackBarOpen: true,
          saved: true,
          formValue: properties,
        })

        _navigateOnSave(this.props.currentPath, this.props.navigationMethod)
      } else {
        window.scrollTo(0, 0)
      }
    }

    _onRequestCancelForm = (e, force = false) => {
      if (force) {
        if (this.props.cancelMethod) {
          this.props.cancelMethod()
        } else {
          NavigationHelpers.navigateUp(this.props.currentPath, this.props.navigationMethod)
        }
      } else {
        e.preventDefault()
        const formValue = this['form_' + this.props.type].getValue()
        this.setState({
          cancelButtonEl: e.currentTarget,
          showCancelWarning: true,
          formValue: formValue,
        })
      }
    }

    _handleSnackbarClose = () => {
      this.setState({ snackBarOpen: false })
    }

    _hasPendingReview = (item) => {
      return item ? (
        <div className="ViewWithForm__warning">
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
      ) : null
    }

    _setInitialFormValues = (value) => {
      if (value) {
        this.setState({ formValue: value })
      }
    }

    componentDidMount() {
      const { initialValues } = this.props
      this._setInitialFormValues(initialValues)
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.saved) {
        const currentWord = this._getComputeItem(this.props)
        const nextWord = this._getComputeItem(nextProps)
        const currentWordWasUpdated = selectn('wasUpdated', currentWord)
        const nextWordWasUpdated = selectn('wasUpdated', nextWord)
        // 'Redirect' on update
        if (nextWordWasUpdated && currentWordWasUpdated != nextWordWasUpdated) {
          NavigationHelpers.navigateUp(this.props.currentPath, this.props.navigationMethod)
        }
      }
    }

    render() {
      const { computeLogin, context, fields, options, type, initialValues } = this.props

      const isRecorderWithApproval = ProviderHelpers.isRecorderWithApproval(computeLogin)
      const isAdmin = ProviderHelpers.isAdmin(computeLogin)
      const hasWritePriveleges = isRecorderWithApproval || isAdmin

      const computeItem = this._getComputeItem(this.props)
      const isPublicDialect =
        selectn('response.state', this.props.computeDialect) === 'Published' ||
        selectn('response.state', this.props.computeDialect) === 'Republish'
      const submitButtons = (
        <>
          <FVButton variant="text" onClick={this._onRequestCancelForm} style={{ marginRight: '5px' }}>
            {<FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />}
          </FVButton>
          <FVButton
            data-testid="withForm__saveBtn"
            variant="contained"
            color="primary"
            onClick={(e) => {
              this._onRequestSaveForm(e, computeItem)
            }}
            style={{ marginRight: '5px' }}
          >
            {<FVLabel transKey="save" defaultStr="Save" transform="first" />}
          </FVButton>
          {isPublicDialect && hasWritePriveleges ? (
            <FVButton
              data-testid="withForm__saveAndPublishBtn"
              variant="contained"
              color="secondary"
              onClick={(e) => {
                this._onRequestSaveForm(e, computeItem, true)
              }}
            >
              {<FVLabel transKey="save & publish" defaultStr="Save & Publish" transform="first" />}
            </FVButton>
          ) : null}
        </>
      )

      const contributors = selectn('response.properties.dc:contributors', computeItem) || []

      return (
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-9')}>
            <ComposedFilter renderOnError {...this.props} {...this.state}>
              <div className="form-horizontal" style={{ padding: '0 15px' }}>
                <form
                  onSubmit={(e) => {
                    this._onRequestSaveForm(e, computeItem)
                  }}
                >
                  <div data-testid="withForm__btnGroup1" className="form-group" style={{ textAlign: 'right' }}>
                    {submitButtons}
                    {this._hasPendingReview(selectn('response', computeItem))}
                  </div>

                  <t.form.Form
                    ref={(element) => {
                      this['form_' + type] = element
                    }}
                    type={t.struct(selectn(type, fields))}
                    context={context}
                    value={this.state.formValue || initialValues || selectn('response.properties', computeItem)}
                    options={selectn(type, options)}
                  />

                  <div data-testid="withForm__btnGroup2" className="form-group" style={{ textAlign: 'right' }}>
                    {this._hasPendingReview(selectn('response', computeItem))}
                    {submitButtons}
                  </div>

                  <Popover
                    open={this.state.showCancelWarning}
                    anchorEl={this.state.cancelButtonEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
                    transformOrigin={{ horizontal: 'right', vertical: 'center' }}
                    onClose={() => this.setState({ showCancelWarning: false })}
                  >
                    <div style={{ padding: '10px', margin: '0 15px', borderRadius: '5px' }}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.intl.trans(
                            'views.hoc.view.discard_warning',
                            'Are you sure you want to <strong>discard your changes</strong>?',
                            'first'
                          ),
                        }}
                      />
                      <FVButton
                        variant="text"
                        size="small"
                        style={confirmationButtonsStyle}
                        onClick={(e) => {
                          this._onRequestCancelForm(e, true)
                        }}
                      >
                        <FVLabel transKey="yes" defaultStr="Yes" transform="first" />!
                      </FVButton>
                      <FVButton
                        variant="text"
                        size="small"
                        style={confirmationButtonsStyle}
                        onClick={() => this.setState({ showCancelWarning: false })}
                      >
                        <FVLabel transKey="no" defaultStr="No" transform="first" />!
                      </FVButton>
                    </div>
                  </Popover>
                </form>
              </div>
            </ComposedFilter>
          </div>

          <div className={classNames('col-xs-12', 'col-md-3')}>
            <div style={{ marginTop: '60px', marginRight: '15px' }}>
              <div className="ViewWithForm__panelHeading">
                <FVLabel transKey="metadata" defaultStr="METADATA" transform="upper" />
              </div>

              <ul className="list-group">
                <li className="list-group-item">
                  <span className={classNames('label', 'label-default')}>
                    <FVLabel transKey="last_modified" defaultStr="Last Modified" transform="first" />
                  </span>
                  <div className="ViewWithForm__listGroupItem">
                    {StringHelpers.formatLocalDateString(selectn('response.lastModified', computeItem))}
                  </div>
                </li>

                <li className="list-group-item">
                  <span className={classNames('label', 'label-default')}>
                    <FVLabel transKey="last_contributor" defaultStr="Last Contributor" transform="first" />
                  </span>
                  <div className="ViewWithForm__listGroupItem">
                    {selectn('response.properties.dc:lastContributor', computeItem)}
                  </div>
                </li>

                <li className="list-group-item">
                  <span className={classNames('label', 'label-default')}>
                    <FVLabel transKey="date_created" defaultStr="Date Added to FirstVoices" />
                  </span>
                  <div className="ViewWithForm__listGroupItem">
                    {StringHelpers.formatLocalDateString(selectn('response.properties.dc:created', computeItem))}
                  </div>
                </li>

                <li className="list-group-item">
                  <span className={classNames('label', 'label-default')}>
                    <FVLabel transKey="contributors" defaultStr="Contributors" transform="first" />
                  </span>
                  <div className="ViewWithForm__listGroupItem">
                    {contributors.map((contributor, i) => {
                      return <p key={i}>{contributor}</p>
                    })}
                  </div>
                </li>

                <li className="list-group-item">
                  <span className={classNames('label', 'label-default')}>
                    <FVLabel transKey="version" defaultStr="Version" transform="first" />
                  </span>
                  <div className="ViewWithForm__listGroupItem">
                    {selectn('response.properties.uid:major_version', computeItem)}.
                    {selectn('response.properties.uid:minor_version', computeItem)}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <FVSnackbar
            open={this.state.snackBarOpen}
            autoHideDuration={3000}
            onClose={this._handleSnackbarClose}
            message="Saved!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={this._handleSnackbarClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </div>
      )
    }
  }

  const mapStateToProps = (state) => {
    const { locale, nuxeo } = state
    const { intlService } = locale
    const { computeLogin } = nuxeo

    return {
      intl: intlService,
      computeLogin,
    }
  }

  // REDUX: actions/dispatch/func
  const mapDispatchToProps = {
    updateDocument,
    updateAndPublishDocument,
  }

  return connect(mapStateToProps, mapDispatchToProps)(ViewWithForm)
}
