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

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

import withForm from 'views/hoc/view/with-form';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const EditViewWithForm = withForm(PromiseWrapper, true);

@provide
export default class ExploreDialectEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        fetchPortal: PropTypes.func.isRequired,
        computePortal: PropTypes.object.isRequired,
        updatePortal: PropTypes.func.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        // Bind methods to 'this'
        ['_handleSave', '_handleCancel'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
        newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
            this.fetchData(nextProps);
        }
    }

    shouldComponentUpdate(newProps) {

        const portalPath = this.props.routeParams.dialect_path + '/Portal';

        switch (true) {
            case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computePortal, portalPath) != ProviderHelpers.getEntry(this.props.computePortal, portalPath)):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) != ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)):
                return true;
                break;
        }

        return false;
    }

    _handleSave(portal, formValue) {
        // TODO: Find better way to construct object then accessing internal function
        let portalDoc = new Document(portal.response, {
            'repository': portal.response._repository,
            'nuxeo': portal.response._nuxeo
        });

        // Set new value property on document
        portalDoc.set(formValue);

        // Save document
        this.props.updatePortal(portalDoc, null, null);
    }

    _handleCancel() {
        NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath);
    }

    render() {

        const portalPath = this.props.routeParams.dialect_path + '/Portal';

        const computeEntities = Immutable.fromJS([{
            'id': portalPath,
            'entity': this.props.computePortal
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computePortal = ProviderHelpers.getEntry(this.props.computePortal, portalPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        let initialValues = {};

        // Set initial values
        if (selectn('response', computeDialect2) && selectn('response', computePortal)) {
            initialValues = Object.assign(
                selectn('response', computeDialect2),
                {initialValues: selectn("response.properties", computePortal)}
            );
        }

        return <div>

            <h1>{intl.trans('views.pages.explore.dialect.edit_x_community_portal',
                'Edit ' + selectn('response.title', computeDialect2) + ' Community Portal',
                null, [selectn('response.title', computeDialect2)])}</h1>

            <EditViewWithForm
                computeEntities={computeEntities}
                initialValues={initialValues}
                itemId={portalPath}
                fields={fields}
                options={options}
                saveMethod={this._handleSave}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={this.props.replaceWindowPath}
                type="FVPortal"
                routeParams={this.props.routeParams}/>

        </div>
    }
}