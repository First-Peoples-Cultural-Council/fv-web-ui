import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import t from 'tcomb-form';

import fields from 'models/schemas/filter-fields';
import options from 'models/schemas/filter-options';

import withToggle from 'views/hoc/view/with-toggle';

import ProviderHelpers from 'common/ProviderHelpers';
import FormHelpers from 'common/FormHelpers';

import {RaisedButton, FlatButton, FontIcon} from 'material-ui';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const FiltersWithToggle = withToggle();

/**
 * Return 'true' if value was found, 'false' otherwise.
 */
const defaultFilterFunc = function (propertyToSearch, filterValue) {

    if (!propertyToSearch)
        return true;

    if (Array.isArray(propertyToSearch)) {
        return !(propertyToSearch.indexOf(filterValue) === -1);
    } else {
        return !(propertyToSearch.search(new RegExp(filterValue, "i")) === -1);
    }

    return true;
}

export default function withFilter(ComposedFilter, DefaultFetcherParams) {
    class FilteredGridList extends Component {

        static defaultProps = {
            filterOptionsKey: "Default",
            fullWidth: false
        }

        static propTypes = {
            fetcher: PropTypes.func,
            fixedList: PropTypes.bool,
            fixedListFetcher: PropTypes.func,
            fetcherParams: PropTypes.object,
            initialValues: PropTypes.object,
            filterOptionsKey: PropTypes.string.isRequired,
            applyDefaultFormValues: PropTypes.bool,
            fullWidth: PropTypes.bool,
            metadata: PropTypes.object,
            area: PropTypes.string
        }

        constructor(props, context) {
            super(props, context);

            this.state = {
                options: options,
                formValue: props.initialFormValue || props.formValues,
                defaultFormValue: props.formValues,
                initialFormValue: props.initialFormValue
            };

            ['_onReset', '_doFilter', '_onFilterSaveForm'].forEach((method => this[method] = this[method].bind(this)));
        }

        componentDidMount() {
            // Only auto-apply with a fixed list
            if (this.props.fixedList && this.props.applyDefaultFormValues) {
                this._onFilterSaveForm(null);
            }
        }

        _doFilter(filters, props = this.props) {

            // Filter a fixed list (i.e. all items sent to component)
            if (this.props.fixedList) {
                let filteredList = new List(props.items).filter(function (item) {

                    // Test each of the filters against item
                    for (let filterKey in filters) {

                        let filterOptions = selectn([props.filterOptionsKey, 'fields', filterKey], options);
                        let filterFunc = (filterOptions && filterOptions.hasOwnProperty('filterFunc')) ? filterOptions.filterFunc : defaultFilterFunc;

                        let filterValue = filters[filterKey];
                        let propertyToSearch = selectn(filterKey, item);

                        if (!filterFunc(propertyToSearch, filterValue)) {
                            return false;
                        }
                    }

                    return true;

                }.bind(this));

                props.fixedListFetcher(filteredList);
            }
            // Filter a remote list (i.e. partial list sent to component)
            else {
                let preparedFilters = FormHelpers.prepareFilters(filters, options, this.props.filterOptionsKey);

                this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
                    currentPageIndex: 1,
                    filters: preparedFilters
                }));
            }
        }

        _onReset(event, props = this.props) {

            let form = this.refs["filter_form"];

            // Reset all controlled inputs
            let inputs = Object.assign({}, selectn('refs.input.refs', form), selectn('inputRef.childRefs',form));

            let properties = FormHelpers.getProperties(form);

            for (let inputKey in inputs) {
                if (typeof inputs[inputKey].forceReset === 'function') {
                    inputs[inputKey].forceReset();
                }
            }

            this.setState({
                formValue: this.state.defaultFormValue || null
            });

            if (props.fixedList) {
                if (this.state.defaultFormValue) {
                    this._doFilter(this.state.defaultFormValue, props);
                }
                else {
                    props.fixedListFetcher(props.items);
                }
            }
            else {
                this._doFilter(DefaultFetcherParams.filters, props);
            }
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.area != this.props.area) {
                this._onReset(null, nextProps);
            }

            // Items may change in a fixed list (e.g. deleted, added)
            let nextPropsItemsList = Immutable.fromJS(nextProps.items);
            let prevPropsItemsList = Immutable.fromJS(this.props.items);

            if (this.props.fixedList && nextPropsItemsList.equals(prevPropsItemsList) === false) {
                this._onReset(null, nextProps);
            }
        }

        _onFilterSaveForm(e) {

            // Prevent default behaviour
            if (e) {
                e.preventDefault();
            }

            let form = this.refs["filter_form"];
            let properties = FormHelpers.getProperties(form);

            if (Object.keys(properties).length != 0) {
                this.setState({
                    formValue: properties
                });

                this._doFilter(properties);
            } else {
                this._onReset(null);
            }
        }

        render() {

            let options = Map(selectn(this.props.filterOptionsKey, this.state.options));

            // Replace proxied properties where necessary
            if (this.props.area) {

                let fields = Map(options.get('fields')).map(function (field) {
                    if (field.hasOwnProperty('nxql')) {
                        field.nxql = ProviderHelpers.replaceAllWorkspaceSectionKeys(field.nxql, this.props.area);
                    }

                    return field;
                }.bind(this));

                options = options.set('fields', fields);
            }

            return (
                <div>

                    <div className="row">

                        <div className={classNames('col-xs-12', {
                            'col-md-3': !this.props.fullWidth,
                            'col-md-12': this.props.fullWidth
                        })}>

                            <form onSubmit={this._onFilterSaveForm}>

                                <FiltersWithToggle
                                    label={intl.trans('views.pages.search.filter_items', 'Filter items', 'first')}
                                    mobileOnly={true}>
                                    <t.form.Form
                                        ref="filter_form"
                                        type={t.struct(selectn(this.props.filterOptionsKey, fields))}
                                        context={this.props.initialValues}
                                        value={this.state.formValue}
                                        options={options.toJS()}/>
                                    <RaisedButton
                                        onTouchTap={this._onReset}
                                        label={intl.trans('reset', 'Reset', 'first')}
                                        primary={true}/> &nbsp;
                                    <RaisedButton
                                        type="submit"
                                        label={intl.trans('filter', 'Filter', 'first')}
                                        primary={true}/>
                                </FiltersWithToggle>

                            </form>

                        </div>

                        <div className={classNames('col-xs-12', {
                            'col-md-9': !this.props.fullWidth,
                            'col-md-12': this.props.fullWidth
                        })}>
                            <ComposedFilter
                                {...this.state}
                                {...this.props}
                            />
                        </div>

                    </div>


                </div>)
                ;
        }
    }

    return FilteredGridList;
}