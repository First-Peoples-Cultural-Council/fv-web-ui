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

import NavigationHelpers from 'common/NavigationHelpers';
import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
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
export default class PageDialectMediaEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        changeTitleParams: PropTypes.func.isRequired,
        overrideBreadcrumbs: PropTypes.func.isRequired,
        fetchResource: PropTypes.func.isRequired,
        computeResource: PropTypes.object.isRequired,
        updateResource: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        resource: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            formValue: null
        };

        // Bind methods to 'this'
        ['_handleSave', '_handleCancel'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(this.props.routeParams.dialect_path);
        newProps.fetchResource(this._getResourcePath());
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentResource, nextResource;

        if (this._getResourcePath() != null) {
            currentResource = ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath());
            nextResource = ProviderHelpers.getEntry(nextProps.computeResource, this._getResourcePath());
        }

        // 'Redirect' on success
        if (selectn('wasUpdated', currentResource) != selectn('wasUpdated', nextResource) && selectn('wasUpdated', nextResource) === true) {
            NavigationHelpers.navigate(NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextResource), 'media'), nextProps.replaceWindowPath, true);
        }
    }

    shouldComponentUpdate(newProps, newState) {

        switch (true) {

            case (newProps.routeParams.media != this.props.routeParams.media):
                return true;
                break;

            case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computeResource, this._getResourcePath()) != ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath())):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) != ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)):
                return true;
                break;
        }

        return false;
    }

    _handleSave(phrase, formValue) {

        let newDocument = new Document(phrase.response, {
            'repository': phrase.response._repository,
            'nuxeo': phrase.response._nuxeo
        });

        // Set new value property on document
        newDocument.set(formValue);

        // Save document
        this.props.updateResource(newDocument, null, null);

        this.setState({formValue: formValue});
    }

    _handleCancel() {
        NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath);
    }

    _getResourcePath(props = null) {

        if (props == null) {
            props = this.props;
        }

        if (StringHelpers.isUUID(props.routeParams.media)){
            return props.routeParams.media;
        } else {
            return props.routeParams.dialect_path + '/Resources/' + StringHelpers.clean(props.routeParams.media);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let media = selectn('response', ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath()));
        let title = selectn('properties.dc:title', media);
        let uid = selectn('uid', media);

        if (title && selectn('pageTitleParams.media', this.props.properties) != title) {
            this.props.changeTitleParams({'media': title});
            this.props.overrideBreadcrumbs({find: uid, replace: 'pageTitleParams.media'});
        }
    }

    render() {

        let context;

        const computeEntities = Immutable.fromJS([{
            'id': this._getResourcePath(),
            'entity': this.props.computeResource
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }]);

        const computeResource = ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath());
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        let type = selectn("response.type", computeResource);

        // Additional context (in order to store file content for display)
        if (selectn("response", computeDialect2) && selectn("response", computeResource)) {
            context = Object.assign(selectn("response", computeDialect2), {
                otherContext: {
                    'file': selectn("response.properties.file:content", computeResource)
                }
            });
        }

        return <div>

            <h1>Edit {selectn("response.properties.dc:title", computeResource)} resource</h1>

            {(() => {

                if (type) {

                    // Remove file upload for editing...
                    let modifiedFields = Immutable.fromJS(fields).deleteIn([type, 'file']).toJS();

                    return <EditViewWithForm
                                computeEntities={computeEntities}
                                initialValues={context}
                                itemId={this._getResourcePath()}
                                fields={modifiedFields}
                                options={options}
                                saveMethod={this._handleSave}
                                cancelMethod={this._handleCancel}
                                currentPath={this.props.splitWindowPath}
                                navigationMethod={this.props.replaceWindowPath}
                                type={type}
                                routeParams={this.props.routeParams}/>;
                }

            })()}

        </div>;
    }
}