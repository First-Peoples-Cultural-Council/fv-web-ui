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

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

import withForm from 'views/hoc/view/with-form';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const EditViewWithForm = withForm(PromiseWrapper, true);

@provide
export default class Edit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchCategory: PropTypes.func.isRequired,
        computeCategory: PropTypes.object.isRequired,
        updateCategory: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        dialect: PropTypes.object,
        routeParams: PropTypes.object.isRequired,
        phraseBook: PropTypes.object,
        value: PropTypes.string,
        onDocumentCreated: PropTypes.func,
        cancelMethod: PropTypes.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            phraseBook: null,
            phraseBookPath: (!props.value) ? props.routeParams.dialect_path + '/Phrase Books/' + props.routeParams.phraseBook : props.value,
            formValue: null
        };

        // Bind methods to 'this'
        ['_handleSave', '_handleCancel'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        if (!newProps.dialect) {
            newProps.fetchDialect2(this.props.routeParams.dialect_path);
        }

        newProps.fetchCategory(this.state.phraseBookPath);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentPhraseBook, nextPhraseBook;

        if (this.state.phraseBookPath != null) {
            currentPhraseBook = ProviderHelpers.getEntry(this.props.computeCategory, this.state.phraseBookPath);
            nextPhraseBook = ProviderHelpers.getEntry(nextProps.computeCategory, this.state.phraseBookPath);
        }

        // Complete on success
        if (selectn('wasUpdated', currentPhraseBook) != selectn('wasUpdated', nextPhraseBook) && selectn('wasUpdated', nextPhraseBook) === true) {
            if (nextProps.onDocumentCreated) {
                nextProps.onDocumentCreated(selectn('response', nextPhraseBook));
            }
        }
    }

    shouldComponentUpdate(newProps, newState) {

        let previousPhraseBook = this.props.computeCategory;
        let nextPhraseBook = newProps.computeCategory;

        let previousDialect = this.props.computeDialect2;
        let nextDialect = newProps.computeDialect2;

        switch (true) {

            case (newProps.routeParams.phraseBook != this.props.routeParams.phraseBook):
                return true;
                break;

            case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
                return true;
                break;

            case (typeof nextPhraseBook.equals === 'function' && nextPhraseBook.equals(previousPhraseBook) === false):
                return true;
                break;

            case (typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false):
                return true;
                break;
        }

        return false;
    }

    _handleSave(phraseBook, formValue) {

        let newDocument = new Document(phraseBook.response, {
            'repository': phraseBook.response._repository,
            'nuxeo': phraseBook.response._nuxeo
        });

        // Set new value property on document
        newDocument.set(formValue);

        // Save document
        this.props.updateCategory(newDocument, null, null);

        this.setState({formValue: formValue});
    }

    _handleCancel() {
        if (this.props.cancelMethod) {
            this.props.cancelMethod();
        } else {
            NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath);
        }
    }

    render() {

        let context;

        const computeEntities = Immutable.fromJS([{
            'id': this.state.phraseBookPath,
            'entity': this.props.computeCategory
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeCategory = ProviderHelpers.getEntry(this.props.computeCategory, this.state.phraseBookPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        // Additional context (in order to store origin), and initial filter value
        if (selectn("response", computeDialect2) && selectn("response", computeCategory)) {
            let providedFilter = selectn("response.properties.fv-phraseBook:definitions[0].translation", computeCategory) || selectn("response.properties.fv:literal_translation[0].translation", computeCategory);
            context = Object.assign(selectn("response", computeDialect2), {
                otherContext: {
                    'parentId': selectn("response.uid", computeCategory),
                    'providedFilter': providedFilter
                }
            });
        }

        return <div>

            <h1>{selectn("response.properties.dc:title", computeCategory)}: {intl.trans('views.pages.explore.dialect.phrases.edit_phrase_book', 'Edit PhraseBook', 'words')}</h1>

            <EditViewWithForm
                computeEntities={computeEntities}
                initialValues={context}
                itemId={this.state.phraseBookPath}
                fields={fields}
                options={options}
                saveMethod={this._handleSave}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={() => {
                }}
                type="FVPhraseBook"
                routeParams={this.props.routeParams}/>

        </div>;
    }
}