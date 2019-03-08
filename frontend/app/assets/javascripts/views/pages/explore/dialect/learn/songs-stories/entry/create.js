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
import NavigationHelpers from 'common/NavigationHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import Snackbar from 'material-ui/lib/snackbar';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Create book entry
 */
@provide
export default class PageDialectStoriesAndSongsBookEntryCreate extends Component {

    static propTypes = {
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        fetchBook: PropTypes.func.isRequired,
        computeBook: PropTypes.object.isRequired,
        createBookEntry: PropTypes.func.isRequired,
        computeBookEntry: PropTypes.object.isRequired,
        typePlural: PropTypes.string.isRequired,
        routeParams: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            formValue: null,
            dialectPath: null,
            parentBookPath: null,
            bookEntryPath: null
        };

        // Bind methods to 'this'
        ['_onNavigateRequest', '_onRequestSaveForm'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {

        let parentBookPath = newProps.routeParams.parentBookName;

        newProps.fetchDialect2(newProps.routeParams.dialect_path);
        newProps.fetchBook(parentBookPath);

        this.setState({
            dialectPath: newProps.routeParams.dialect_path,
            parentBookPath: parentBookPath
        });
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentBookEntry, nextBookEntry, parentBook;

        if (this.state.bookEntryPath != null) {
            currentBookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath);
            nextBookEntry = ProviderHelpers.getEntry(nextProps.computeBookEntry, this.state.bookEntryPath);
            parentBook = ProviderHelpers.getEntry(nextProps.computeBook, this.state.parentBookPath);
        }

        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }

        // 'Redirect' on success
        if (selectn('success', currentBookEntry) != selectn('success', nextBookEntry) && selectn('success', nextBookEntry) === true && selectn('response', parentBook) !== undefined) {
            NavigationHelpers.navigate(NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', parentBook), nextProps.typePlural.toLowerCase()), nextProps.replaceWindowPath, true);
        }
    }

    shouldComponentUpdate(newProps, newState) {

        switch (true) {
            case (newProps.windowPath != this.props.windowPath):
                return true;
                break;

            case (newProps.computeDialect2 != this.props.computeDialect2):
                return true;
                break;

            case (newProps.computeBook != this.props.computeBook):
                return true;
                break;

            case (newProps.computeBookEntry != this.props.computeBookEntry):
                return true;
                break;
        }

        return false;
    }

    _onNavigateRequest(path) {
        //this.props.pushWindowPath('/' + path);
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_book_entry_create"].getValue();

        let properties = {};

        for (let key in formValue) {
            if (formValue.hasOwnProperty(key) && key) {
                if (formValue[key] && formValue[key] != '') {
                    properties[key] = formValue[key];
                }
            }
        }

        this.setState({
            formValue: properties
        })

        // Passed validation
        if (formValue) {
            let now = Date.now();
            this.props.createBookEntry(this.state.parentBookPath, {
                type: 'FVBookEntry',
                name: formValue['dc:title'],
                properties: properties
            }, null, now);

            this.setState({
                bookEntryPath: this.state.parentBookPath + '/' + formValue['dc:title'] + '.' + now
            });
        } else {
            window.scrollTo(0, 0);
        }

    }

    render() {

        let FVBookEntryOptions = Object.assign({}, selectn("FVBookEntry", options));

        const computeEntities = Immutable.fromJS([{
            'id': this.state.bookEntryPath,
            'entity': this.props.computeBookEntry
        }, {
            'id': this.state.parentBookPath,
            'entity': this.props.computeBook
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.parentBookPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        // Set default value on form
        if (selectn('response.properties.fvdialect:dominant_language', this.props.computeDialect2)) {

            if (selectn("fields.fv:literal_translation.item.fields.language.attrs", FVBookEntryOptions)) {
                FVBookEntryOptions['fields']['fv:literal_translation']['item']['fields']['language']['attrs']['defaultValue'] = selectn('response.properties.fvdialect:dominant_language', this.props.computeDialect2);
            }

            if (selectn("fields.fvbookentry:dominant_language_text.item.fields.language.attrs", FVBookEntryOptions)) {
                FVBookEntryOptions['fields']['fvbookentry:dominant_language_text']['item']['fields']['language']['attrs']['defaultValue'] = selectn('response.properties.fvdialect:dominant_language', this.props.computeDialect2);
            }
        }

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <h1>{intl.trans('views.pages.explore.dialect.learn.songs_stories.add_new_entry_to_x_book',
                'Add New Entry to ' + selectn('response.properties.dc:title', computeBook) + ' Book', 'words', [selectn('response.properties.dc:title', computeBook)])}</h1>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm}>
                        <t.form.Form
                            ref="form_book_entry_create"
                            type={t.struct(selectn("FVBookEntry", fields))}
                            context={selectn('response', computeDialect2)}
                            value={this.state.formValue}
                            options={FVBookEntryOptions}/>
                        <div className="form-group">
                            <button type="submit"
                                    className="btn btn-primary">{intl.trans('save', 'Save', 'first')}</button>
                        </div>
                    </form>
                </div>

                <div className={classNames('col-xs-4', 'col-md-2')}>

                    <Paper style={{padding: '15px', margin: '20px 0'}} zDepth={2}>

                        <div className="subheader">{intl.trans('metadata', 'Metadata', 'first')}</div>

                    </Paper>

                </div>
            </div>
        </PromiseWrapper>;
    }
}