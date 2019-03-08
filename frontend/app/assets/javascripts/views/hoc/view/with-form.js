import React, {Component, PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import t from 'tcomb-form';

import fields from 'models/schemas/filter-fields';
import options from 'models/schemas/filter-options';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import {RaisedButton, FlatButton, Popover} from 'material-ui';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const confirmationButtonsStyle = {padding: '0', marginLeft: '5px', minWidth: 'auto', border: '1px solid gray'};

export default function withForm(ComposedFilter, publishWarningEnabled = false) {
    class ViewWithForm extends Component {

        static propTypes = {
            routeParams: PropTypes.object,
            initialValues: PropTypes.object,
            fields: PropTypes.object.isRequired,
            options: PropTypes.object.isRequired,
            type: PropTypes.string.isRequired,
            itemId: PropTypes.string.isRequired,
            saveMethod: PropTypes.func.isRequired,
            cancelMethod: PropTypes.func,
            currentPath: PropTypes.array,
            navigationMethod: PropTypes.func,
            computeEntities: PropTypes.instanceOf(List).isRequired
        };

        static defaultProps = {
            cancelMethod: () => {
            }
        }

        constructor(props, context) {
            super(props, context);

            this.state = {
                formValue: null,
                showCancelWarning: false,
                saved: false
            };

            ['_onRequestSaveForm', '_onRequestCancelForm'].forEach((method => this[method] = this[method].bind(this)));
        }

        _getComputeItem(props) {

            const {computeEntities, itemId} = props;

            const item = computeEntities.find((value, key) =>
                value.get('id') === itemId
            );

            return ProviderHelpers.getEntry(item.get('entity'), itemId);
        }

        _onRequestSaveForm(portal, e) {

            // Prevent default behaviour
            e.preventDefault();

            let formValue = this.refs["form_" + this.props.type].getValue();

            // Passed validation
            if (formValue) {
                this.props.saveMethod(portal, formValue);

                this.setState({
                    saved: true,
                    formValue: formValue
                });
            } else {
                window.scrollTo(0, 0);
            }
        }

        _onRequestCancelForm(e, force = false) {

            if (force) {
                if (this.props.cancelMethod) {
                    this.props.cancelMethod();
                }
                else {
                    NavigationHelpers.navigateUp(this.props.currentPath, this.props.navigationMethod);
                }
            } else {
                e.preventDefault();
            }

            this.setState({
                cancelButtonEl: e.currentTarget,
                showCancelWarning: true
            })
        }

        componentWillReceiveProps(nextProps) {

            if (this.state.saved) {
                let currentWord = this._getComputeItem(this.props);
                let nextWord = this._getComputeItem(nextProps);

                let currentWordWasUpdated = selectn('wasUpdated', currentWord);
                let currentWordWasCreated = selectn('wasCreated', currentWord);

                let nextWordWasUpdated = selectn('wasUpdated', nextWord);
                let nextWordWasCreated = selectn('wasCreated', nextWord);

                // 'Redirect' on update or creation success
                if ((nextWordWasUpdated && currentWordWasUpdated != nextWordWasUpdated) || (nextWordWasCreated && currentWordWasCreated != nextWordWasCreated)) {

                    if (nextWordWasUpdated) {
                        NavigationHelpers.navigateUp(this.props.currentPath, this.props.navigationMethod);
                    } else if (nextWordWasCreated) {
                        //navigateForwardReplace
                        //nextProps.replaceWindowPath('/' + nextProps.routeParams.theme + selectn('response.path', nextWord).replace('Dictionary', 'learn/words'));
                    }
                }
            }
        }

        render() {

            const {initialValues, fields, options, type} = this.props;
            const computeItem = this._getComputeItem(this.props);

            return (
                <div className="row">
                    <div className={classNames('col-xs-12', 'col-md-9')}>
                        <ComposedFilter renderOnError={true} {...this.props} {...this.state}>

                            <div className="form-horizontal" style={{padding: '0 15px'}}>

                                <form onSubmit={this._onRequestSaveForm.bind(this, computeItem)}>


                                    <div className="form-group" style={{textAlign: 'right'}}>

                                        <FlatButton onTouchTap={this._onRequestCancelForm} style={{marginRight: '10px'}}
                                                label={intl.trans('cancel', 'Cancel', 'first')}/>
                                        <RaisedButton onTouchTap={this._onRequestSaveForm.bind(this, computeItem)}
                                                primary={true} label={intl.trans('save', 'Save', 'first')}/>

                                    </div>

                                    <hr/>

                                    <t.form.Form
                                        ref={"form_" + type}
                                        type={t.struct(selectn(type, fields))}
                                        context={initialValues}
                                        value={this.state.formValue || selectn("response.properties", computeItem)}
                                        options={selectn(type, options)}/>

                                    <hr/>

                                    <div className="form-group" style={{textAlign: 'right'}}>

                                        <FlatButton onTouchTap={this._onRequestCancelForm} style={{marginRight: '10px'}}
                                                    label={intl.trans('cancel', 'Cancel', 'first')}/>
                                        <RaisedButton onTouchTap={this._onRequestSaveForm.bind(this, computeItem)}
                                                      primary={true} label={intl.trans('save', 'Save', 'first')}/>

                                        <Popover
                                            open={this.state.showCancelWarning}
                                            anchorEl={this.state.cancelButtonEl}
                                            anchorOrigin={{horizontal: 'left', vertical: 'center'}}
                                            targetOrigin={{horizontal: 'right', vertical: 'center'}}
                                            onRequestClose={() => this.setState({showCancelWarning: false})}>
                                            <div style={{padding: '10px', margin: '0 15px', borderRadius: '5px'}}>
                                                <span dangerouslySetInnerHTML={{__html: intl.trans('views.hoc.view.discard_warning', 'Are you sure you want to <strong>discard your changes</strong>?', 'first')}}></span>
                                                <FlatButton style={confirmationButtonsStyle}
                                                            onTouchTap={this._onRequestCancelForm.bind(this, true)}
                                                            label={intl.trans('yes', 'Yes', 'first') + '!'}/>
                                                <FlatButton style={confirmationButtonsStyle}
                                                            onTouchTap={() => this.setState({showCancelWarning: false})}
                                                            label={intl.trans('no', 'No', 'first') + '!'}/>
                                            </div>
                                        </Popover>

                                    </div>

                                </form>

                            </div>

                        </ComposedFilter>
                    </div>

                    <div className={classNames('hidden-xs', 'col-md-3')}>

                        <div style={{marginTop: '25px'}} className={classNames('panel', 'panel-primary')}>

                            <div className="panel-heading">Metadata</div>

                            <ul className="list-group">

                                <li className="list-group-item">
                                    <span
                                        className={classNames('label', 'label-default')}>{intl.trans('last_modified', 'Last Modified', 'first')}</span><br/>
                                    {selectn("response.lastModified", computeItem)}
                                </li>

                                <li className="list-group-item">
                                    <span
                                        className={classNames('label', 'label-default')}>{intl.trans('last_contributor', 'Last Contributor', 'first')}</span><br/>
                                    {selectn("response.properties.dc:lastContributor", computeItem)}
                                </li>

                                <li className="list-group-item">
                                    <span
                                        className={classNames('label', 'label-default')}>{intl.trans('date_created', 'Date Created', 'first')}</span><br/>
                                    {selectn("response.properties.dc:created", computeItem)}
                                </li>

                                <li className="list-group-item">
                                    <span
                                        className={classNames('label', 'label-default')}>{intl.trans('contributors', 'Contributors', 'first')}</span><br/>
                                    {(selectn("response.properties.dc:contributors", computeItem) || []).join(',')}
                                </li>

                                <li className="list-group-item">
                                    <span
                                        className={classNames('label', 'label-default')}>{intl.trans('version', 'Version', 'first')}</span><br/>
                                    {selectn("response.properties.uid:major_version", computeItem)}.{selectn("response.properties.uid:minor_version", computeItem)}
                                </li>

                            </ul>

                        </div>

                    </div>
                </div>);
        }
    }

    return ViewWithForm;
}