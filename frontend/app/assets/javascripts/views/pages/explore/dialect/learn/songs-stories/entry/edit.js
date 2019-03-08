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
import React, {Component, PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
@provide
export default class PageDialectBookEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        fetchBookEntry: PropTypes.func.isRequired,
        computeBookEntry: PropTypes.object.isRequired,
        updateBookEntry: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        entry: PropTypes.object,
        bookEntry: PropTypes.object,
        dialectEntry: PropTypes.object,
        handlePageSaved: PropTypes.func,
        book: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            book: null,
            bookEntryPath: selectn('path', props.entry) || props.routeParams.dialect_path + '/Stories & Songs/' + props.routeParams.parentBookName + '/' + props.routeParams.bookName,
            formValue: null
        };

        // Bind methods to 'this'
        ['_onRequestSaveForm'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        if (newProps.dialectEntry == null && !this.getDialect(newProps)) {
            newProps.fetchDialect2(newProps.routeParams.dialect_path);
        }

        newProps.fetchBookEntry(this.state.bookEntryPath);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_book_entry"].getValue();

        // Passed validation
        if (formValue) {
            let bookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath);

            // TODO: Find better way to construct object then accessing internal function
            // Create new document rather than modifying the original document
            let newDocument = new Document(bookEntry.response, {
                'repository': bookEntry.response._repository,
                'nuxeo': bookEntry.response._nuxeo
            });

            // Set new value property on document
            newDocument.set(formValue);

            // Save document
            this.props.updateBookEntry(newDocument);

            // Call other methods (e.g. close dialog)
            if (typeof this.props.handlePageSaved == 'function') {
                this.props.handlePageSaved();
            }

            this.setState({formValue: formValue});
        } else {
            window.scrollTo(0, 0);
        }
    }

    _getDialect(props = this.props) {
        return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path);
    }

    render() {

        const computeBookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath) || {'response': this.props.entry};
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path) || this.props.dialectEntry;

        return <div>

            <h1>{intl.trans('edit_page', 'Edit Page', 'words')}</h1>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm}>
                        <t.form.Form
                            ref="form_book_entry"
                            type={t.struct(selectn("FVBookEntry", fields))}
                            context={selectn("response", computeDialect2)}
                            value={this.state.formValue || selectn("response.properties", computeBookEntry)}
                            options={selectn("FVBookEntry", options)}/>
                        <div className="form-group">
                            <button type="submit"
                                    className="btn btn-primary">{intl.trans('save', 'Save', 'first')}</button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
            ;
    }
}