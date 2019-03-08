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

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import Preview from 'views/components/Editor/Preview';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation';

import ImageGallery from 'react-image-gallery';

import {Link} from 'provide-page';

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import Dialog from 'material-ui/lib/dialog';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import CircularProgress from 'material-ui/lib/circular-progress';

import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css';
import IntlService from "views/services/intl";

const intl = IntlService.instance;
/**
 * View word entry
 */
@provide
export default class View extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        fetchDocument: PropTypes.func.isRequired,
        computeDocument: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            deleteDialogOpen: false
        };

        // Bind methods to 'this'
        ['_onNavigateRequest'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDocument(newProps.id);
    }

    _onNavigateRequest(path) {
        NavigationHelpers.navigate('/' + path, this.props.pushWindowPath, true);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        /*if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
          this.fetchData(nextProps);
        }
        else if (nextProps.routeParams.word !== this.props.routeParams.word) {
          this.fetchData(nextProps);
        }
        else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
          this.fetchData(nextProps);
        }*/
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.props.id,
            'entity': this.props.computeDocument
        }])

        const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.id);

        return <PromiseWrapper computeEntities={computeEntities}>

            {(() => {
                if (selectn('response', computeDocument)) {

                    let actionButton = '';

                    switch (selectn('response.type', computeDocument)) {
                        case 'FVWord':
                            actionButton = <a href={NavigationHelpers.generateUIDPath('explore', selectn('response', computeDocument), 'words')}>{intl.trans('view_word', 'View Word', 'words')}</a>
                            break;

                        case 'FVPhrase':
                            actionButton = <a href={NavigationHelpers.generateUIDPath('explore', selectn('response', computeDocument), 'phrases')}>{intl.trans('view_phrase', 'View Phrase', 'phrases')}</a>
                            break;
                    }

                    return <div>
                        <strong>{intl.trans('title', 'Title', 'first')}</strong>: {selectn('response.title', computeDocument)}<br/>
                        <strong>{intl.trans('type', 'Type', 'first')}</strong>: {selectn('response.type', computeDocument).replace('FV', '')}<br/>
                        {actionButton}
                    </div>;
                }
            })()}

        </PromiseWrapper>;
    }
}