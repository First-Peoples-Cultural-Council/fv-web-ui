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
import ImageGallery from 'react-image-gallery';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import RaisedButton from 'material-ui/lib/raised-button';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
import UIHelpers from 'common/UIHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import withActions from 'views/hoc/view/with-actions';

const DetailsViewWithActions = withActions(PromiseWrapper, true);

//Stylesheet
import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
@provide
export default class Gallery extends React.PureComponent {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        windowPath: PropTypes.string.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        changeTitleParams: PropTypes.func.isRequired,
        overrideBreadcrumbs: PropTypes.func.isRequired,
        computeLogin: PropTypes.object.isRequired,
        fetchGallery: PropTypes.func.isRequired,
        computeGallery: PropTypes.object.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        deleteGallery: PropTypes.func.isRequired,
        publishGallery: PropTypes.func.isRequired,
        askToPublishGallery: PropTypes.func.isRequired,
        unpublishGallery: PropTypes.func.isRequired,
        askToUnpublishGallery: PropTypes.func.isRequired,
        enableGallery: PropTypes.func.isRequired,
        askToEnableGallery: PropTypes.func.isRequired,
        disableGallery: PropTypes.func.isRequired,
        askToDisableGallery: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        ['_onNavigateRequest'].forEach((method => this[method] = this[method].bind(this)));
    }

    _getGalleryPath(props = null) {

        if (props == null) {
            props = this.props;
        }

        if (StringHelpers.isUUID(props.routeParams.galleryName)){
            return props.routeParams.galleryName;
        } else {
            return props.routeParams.dialect_path + '/Portal/' + StringHelpers.clean(props.routeParams.galleryName);
        }
    }

    fetchData(newProps) {
        newProps.fetchGallery(this._getGalleryPath());
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
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

        const images = [];

        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
        const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath());

        (selectn('response.contextParameters.gallery.related_pictures', computeGallery) || []).map(function (picture) {
            let image = {original: UIHelpers.getThumbnail(picture, 'Medium'), description: picture['dc:description']};
            images.push(image);
        });

        const computeEntities = Immutable.fromJS([{
            'id': this._getGalleryPath(),
            'entity': this.props.computeGallery
        }])

        return <DetailsViewWithActions
            labels={{single: "Gallery"}}
            itemPath={this._getGalleryPath()}
            actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
            publishAction={this.props.publishGallery}
            unpublishAction={this.props.unpublishGallery}
            askToPublishAction={this.props.askToPublishGallery}
            askToUnpublishAction={this.props.askToUnpublishGallery}
            enableAction={this.props.enableGallery}
            askToEnableAction={this.props.askToEnableGallery}
            disableAction={this.props.disableGallery}
            askToDisableAction={this.props.askToDisableGallery}
            deleteAction={this.props.deleteGallery}
            onNavigateRequest={this._onNavigateRequest}
            computeItem={computeGallery}
            permissionEntry={computeDialect2}
            renderOnError={true}
            computeEntities={computeEntities}
            {...this.props}>

            <div className="row">

                <div className="col-xs-12" style={{textAlign: 'center'}}>
                    <h1>{selectn('response.title', computeGallery)}</h1>
                    <p>{selectn('response.properties.dc:description', computeGallery)}</p>
                    <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-4')}>
                        <div>
                            <ImageGallery
                                ref={i => this._imageGallery = i}
                                items={images}
                                slideInterval={2000}
                                showFullscreenButton={true}
                                showThumbnails={false}
                                showBullets={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </DetailsViewWithActions>;
    }
}