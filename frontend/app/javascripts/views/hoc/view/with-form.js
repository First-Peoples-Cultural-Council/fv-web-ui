import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List } from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'

import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'

import { Popover } from '@material-ui/core'
import FVButton from 'views/components/FVButton'
import FVLabel from '../../components/FVLabel/index'
import WarningBanner from 'components/WarningBanner'
import RequestReview from 'components/RequestReview'
import '!style-loader!css-loader!./ViewWith.css'

const confirmationButtonsStyle = { padding: '4px', marginLeft: '5px', border: '1px solid gray' }

export default function withForm(ComposedFilter /*, publishWarningEnabled = false*/) {
  class ViewWithForm extends Component {
    static propTypes = {
      // routeParams: PropTypes.object,
      initialValues: PropTypes.object,
      fields: PropTypes.object.isRequired,
      options: PropTypes.object.isRequired,
      type: PropTypes.string.isRequired,
      itemId: PropTypes.string.isRequired,
      saveMethod: PropTypes.func.isRequired,
      cancelMethod: PropTypes.func,
      currentPath: PropTypes.array,
      navigationMethod: PropTypes.func,
      computeEntities: PropTypes.instanceOf(List).isRequired,
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
      }
    }

    _getComputeItem(props) {
      const { computeEntities, itemId } = props

      const item = computeEntities.find((value /*, key*/) => value.get('id') === itemId)

      return ProviderHelpers.getEntry(item.get('entity'), itemId)
    }

    _onRequestSaveForm = (e, portal) => {
      // Prevent default behaviour
      e.preventDefault()
      const formValue = this['form_' + this.props.type].getValue()
      const properties = {}
      // Passed validation
      if (formValue) {
        for (const key in formValue) {
          if (formValue.hasOwnProperty(key) && key) {
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
        this.props.saveMethod(portal, properties)

        this.setState({
          saved: true,
          formValue: properties,
        })
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
      }

      this.setState({
        cancelButtonEl: e.currentTarget,
        showCancelWarning: true,
      })
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

    componentWillReceiveProps(nextProps) {
      if (this.state.saved) {
        const currentWord = this._getComputeItem(this.props)
        const nextWord = this._getComputeItem(nextProps)

        const currentWordWasUpdated = selectn('wasUpdated', currentWord)
        const currentWordWasCreated = selectn('wasCreated', currentWord)

        const nextWordWasUpdated = selectn('wasUpdated', nextWord)
        const nextWordWasCreated = selectn('wasCreated', nextWord)

        // 'Redirect' on update or creation success
        if (
          (nextWordWasUpdated && currentWordWasUpdated != nextWordWasUpdated) ||
          (nextWordWasCreated && currentWordWasCreated != nextWordWasCreated)
        ) {
          if (nextWordWasUpdated) {
            NavigationHelpers.navigateUp(this.props.currentPath, this.props.navigationMethod)
          } else if (nextWordWasCreated) {
            //navigateForwardReplace
            //nextProps.replaceWindowPath('/' + nextProps.routeParams.siteTheme + selectn('response.path', nextWord).replace('Dictionary', 'learn/words'));
          }
        }
      }
    }

    render() {
      const { initialValues, fields, options, type } = this.props
      const computeItem = this._getComputeItem(this.props)
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
                    <FVButton variant="text" onClick={this._onRequestCancelForm} style={{ marginRight: '10px' }}>
                      {<FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />}
                    </FVButton>
                    <FVButton
                      data-testid="withForm__saveBtn"
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        this._onRequestSaveForm(e, computeItem)
                      }}
                    >
                      {<FVLabel transKey="save" defaultStr="Save" transform="first" />}
                    </FVButton>
                    {this._hasPendingReview(selectn('response', computeItem))}
                  </div>

                  <t.form.Form
                    ref={(element) => {
                      this['form_' + type] = element
                    }}
                    type={t.struct(selectn(type, fields))}
                    context={initialValues}
                    value={this.state.formValue || selectn('response.properties', computeItem)}
                    options={selectn(type, options)}
                  />

                  <div data-testid="withForm__btnGroup2" className="form-group" style={{ textAlign: 'right' }}>
                    {this._hasPendingReview(selectn('response', computeItem))}
                    <FVButton variant="text" onClick={this._onRequestCancelForm} style={{ marginRight: '10px' }}>
                      {<FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />}
                    </FVButton>
                    <FVButton
                      data-testid="withForm__saveBtn"
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        this._onRequestSaveForm(e, computeItem)
                      }}
                    >
                      {<FVLabel transKey="save" defaultStr="Save" transform="first" />}
                    </FVButton>

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
                  </div>
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
                    {(selectn('response.properties.dc:contributors', computeItem) || []).join(',')}
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
        </div>
      )
    }
  }

  const mapStateToProps = (state) => {
    const { locale } = state
    const { intlService } = locale

    return {
      intl: intlService,
    }
  }

  return connect(mapStateToProps)(ViewWithForm)
}
