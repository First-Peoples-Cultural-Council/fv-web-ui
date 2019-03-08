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
export default class PageDialectAlphabetCharacterEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchCharacter: PropTypes.func.isRequired,
        computeCharacter: PropTypes.object.isRequired,
        updateCharacter: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        character: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            character: null,
            characterPath: props.routeParams.dialect_path + '/Alphabet/' + props.routeParams.character,
            formValue: null
        };

        // Bind methods to 'this'
        ['_handleSave', '_handleCancel'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(this.props.routeParams.dialect_path);
        newProps.fetchCharacter(this.state.characterPath);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentCharacter, nextCharacter;

        if (this.state.characterPath != null) {
            currentCharacter = ProviderHelpers.getEntry(this.props.computeCharacter, this.state.characterPath);
            nextCharacter = ProviderHelpers.getEntry(nextProps.computeCharacter, this.state.characterPath);
        }

        // 'Redirect' on success
        if (selectn('wasUpdated', currentCharacter) != selectn('wasUpdated', nextCharacter) && selectn('wasUpdated', nextCharacter) === true) {
            nextProps.replaceWindowPath('/' + nextProps.routeParams.theme + selectn('response.path', nextCharacter).replace('Dictionary', 'learn/alphabet'));
        }
    }

    _handleSave(character, formValue) {

        let newDocument = new Document(character.response, {
            'repository': character.response._repository,
            'nuxeo': character.response._nuxeo
        });

        // Set new value property on document
        newDocument.set(formValue);

        // Save document
        this.props.updateCharacter(newDocument);

        this.setState({formValue: formValue});
    }

    _handleCancel() {
        NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath);
    }

    render() {

        let context;

        const computeEntities = Immutable.fromJS([{
            'id': this.state.characterPath,
            'entity': this.props.computeCharacter
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeCharacter = ProviderHelpers.getEntry(this.props.computeCharacter, this.state.characterPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        // Additional context (in order to store origin)
        if (selectn("response", computeDialect2)) {
            context = Object.assign(selectn("response", computeDialect2), {otherContext: {'parentId': selectn("response.uid", computeCharacter)}});
        }

        return <div>

            <h1>{intl.trans('views.pages.explore.dialect.learn.alphabet.edit_x_character',
                'Edit ' + selectn("response.properties.dc:title", computeCharacter) + ' character', 'first', [selectn("response.properties.dc:title", computeCharacter)])}</h1>

            <EditViewWithForm
                computeEntities={computeEntities}
                initialValues={context}
                itemId={this.state.characterPath}
                fields={fields}
                options={options}
                saveMethod={this._handleSave}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={this.props.replaceWindowPath}
                type="FVCharacter"
                routeParams={this.props.routeParams}/>

        </div>;
    }
}