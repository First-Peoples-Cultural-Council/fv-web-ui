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

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Create book entry
 */
@provide
export default class PageDialectGalleryCreate extends Component {

    static propTypes = {
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        createGallery: PropTypes.func.isRequired,
        computeGallery: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            formValue: null,
            galleryPath: null
        };

        // Bind methods to 'this'
        ['_onRequestSaveForm'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        let currentGallery, nextGallery;

        if (this.state.galleryPath != null) {
            currentGallery = ProviderHelpers.getEntry(this.props.computeGallery, this.state.galleryPath);
            nextGallery = ProviderHelpers.getEntry(nextProps.computeGallery, this.state.galleryPath);
        }

        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }

        // 'Redirect' on success
        if (selectn('success', currentGallery) != selectn('success', nextGallery) && selectn('success', nextGallery) === true) {
            nextProps.replaceWindowPath('/' + nextProps.routeParams.theme + selectn('response.path', nextGallery).replace('Portal', 'gallery'));
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

            case (newProps.computeGallery != this.props.computeGallery):
                return true;
                break;
        }

        return false;
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_gallery_create"].getValue();

        //let properties = '';
        let properties = {};

        for (let key in formValue) {
            if (formValue.hasOwnProperty(key) && key) {
                if (formValue[key] && formValue[key] != '') {
                    //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
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
            this.props.createGallery(this.props.routeParams.dialect_path + '/Portal', {
                type: 'FVGallery',
                name: formValue['dc:title'],
                properties: properties
            }, null, now);

            this.setState({
                galleryPath: this.props.routeParams.dialect_path + '/Portal/' + formValue['dc:title'] + '.' + now
            });
        } else {
            //let firstError = this.refs["form_Gallery_create"].validate().firstError();
            window.scrollTo(0, 0);
        }

    }

    render() {

        let FVGalleryOptions = Object.assign({}, selectn("FVGallery", options));

        const computeEntities = Immutable.fromJS([{
            'id': this.state.galleryPath,
            'entity': this.props.computeGallery
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this.state.galleryPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <h1>{intl.trans('views.pages.explore.dialect.gallery.add_new_gallery_to_x',
                'Add New Gallery to ' + selectn('response.title', computeDialect2), null, [selectn('response.title', computeDialect2)])}</h1>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm}>
                        <t.form.Form
                            ref="form_gallery_create"
                            type={t.struct(selectn("FVGallery", fields))}
                            context={selectn('response', computeDialect2)}
                            value={this.state.formValue}
                            options={FVGalleryOptions}/>
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