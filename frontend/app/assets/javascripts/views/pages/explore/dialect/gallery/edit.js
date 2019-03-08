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
import StringHelpers from 'common/StringHelpers';
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
export default class PageDialectGalleryEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        changeTitleParams: PropTypes.func.isRequired,
        overrideBreadcrumbs: PropTypes.func.isRequired,
        fetchGallery: PropTypes.func.isRequired,
        computeGallery: PropTypes.object.isRequired,
        updateGallery: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        gallery: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            gallery: null,
            formValue: null
        };

        // Bind methods to 'this'
        ['_handleSave', '_handleCancel'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(this.props.routeParams.dialect_path);
        newProps.fetchGallery(this._getGalleryPath());
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentGallery, nextGallery;

        if (this._getGalleryPath() != null) {
            currentGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath());
            nextGallery = ProviderHelpers.getEntry(nextProps.computeGallery, this._getGalleryPath());
        }

        // 'Redirect' on success
        if (selectn('wasUpdated', currentGallery) != selectn('wasUpdated', nextGallery) && selectn('wasUpdated', nextGallery) === true) {
            NavigationHelpers.navigate(NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextGallery), 'gallery'), nextProps.replaceWindowPath, true);
        }
    }

    shouldComponentUpdate(newProps, newState) {

        switch (true) {

            case (newProps.routeParams.gallery != this.props.routeParams.gallery):
                return true;
                break;

            case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computeGallery, this._getGalleryPath()) != ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath())):
                return true;
                break;

            case (ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) != ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)):
                return true;
                break;
        }

        return false;
    }

    _getGalleryPath(props = null) {

        if (props == null) {
            props = this.props;
        }

        if (StringHelpers.isUUID(props.routeParams.gallery)){
            return props.routeParams.gallery;
        } else {
            return props.routeParams.dialect_path + '/Portal/' + StringHelpers.clean(props.routeParams.gallery);
        }
    }

    _handleSave(phrase, formValue) {

        let newDocument = new Document(phrase.response, {
            'repository': phrase.response._repository,
            'nuxeo': phrase.response._nuxeo
        });

        // Set new value property on document
        newDocument.set(formValue);

        // Save document
        this.props.updateGallery(newDocument, null, null);

        this.setState({formValue: formValue});
    }

    _handleCancel() {
        NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath);
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_gallery"].getValue();

        // Passed validation
        if (formValue) {
            let gallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath());

            // TODO: Find better way to construct object then accessing internal function
            // Create new document rather than modifying the original document
            let newDocument = new Document(gallery.response, {
                'repository': gallery.response._repository,
                'nuxeo': gallery.response._nuxeo
            });

            // Set new value property on document
            newDocument.set(formValue);

            // Save document
            this.props.updateGallery(newDocument);

            this.setState({formValue: formValue});
        } else {
            //let firstError = this.refs["form_word_create"].validate().firstError();
            window.scrollTo(0, 0);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let gallery = selectn('response', ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath()));
        let title = selectn('properties.dc:title', gallery);
        let uid = selectn('uid', gallery);

        if (title && selectn('pageTitleParams.galleryName', this.props.properties) != title) {
            this.props.changeTitleParams({'galleryName': title});
            this.props.overrideBreadcrumbs({find: uid, replace: 'pageTitleParams.galleryName'});
        }
    }

    render() {

        let context;

        const computeEntities = Immutable.fromJS([{
            'id': this._getGalleryPath(),
            'entity': this.props.computeGallery
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath());
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        // Additional context
        if (selectn("response", computeDialect2) && selectn("response", computeGallery)) {
            context = Object.assign(selectn("response", computeDialect2), {
                otherContext: {
                    'parentId': selectn("response.uid", computeGallery)
                }
            });
        }

        return <div>

            <h1>{intl.trans('views.pages.explore.dialect.gallery.edit_x_gallery',
                'Edit ' + selectn("response.properties.dc:title", computeGallery) + ' Gallery',
                'first',
                [selectn("response.properties.dc:title", computeGallery)])}</h1>

            <EditViewWithForm
                computeEntities={computeEntities}
                initialValues={context}
                itemId={this._getGalleryPath()}
                fields={fields}
                options={options}
                saveMethod={this._handleSave}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={this.props.replaceWindowPath}
                type="FVGallery"
                routeParams={this.props.routeParams}/>

        </div>;



        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <h1>{intl.trans('views.pages.explore.dialect.gallery.edit_x_gallery',
                'Edit ' + selectn("response.properties.dc:title", computeGallery) + ' Gallery',
                'words',
                [selectn("response.properties.dc:title", computeGallery)])}</h1>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm}>
                        <t.form.Form
                            ref="form_gallery"
                            type={t.struct(selectn("FVGallery", fields))}
                            context={selectn("response", computeDialect2)}
                            value={this.state.formValue || selectn("response.properties", computeGallery)}
                            options={selectn("FVGallery", options)}/>
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