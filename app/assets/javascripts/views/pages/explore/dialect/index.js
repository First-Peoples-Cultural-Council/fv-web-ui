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
import Immutable from 'immutable';

import classNames from 'classnames';
import provide from 'react-redux-provide';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import Header from 'views/pages/explore/dialect/header';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

import Toggle from 'material-ui/lib/toggle';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';

import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Preview from 'views/components/Editor/Preview';

import GridView from 'views/pages/explore/dialect/learn/base/grid-view';

const defaultStyle = {width: '100%', overflowY: 'auto', marginBottom: 24};

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';

import Link from 'views/components/Document/Link';
import TextHeader from 'views/components/Document/Typography/text-header';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import Kids from './kids';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;

/**
 * Dialect portal page showing all the various components of this dialect.
 */
@provide
export default class ExploreDialect extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        updateDialect2: PropTypes.func.isRequired,
        fetchPortal: PropTypes.func.isRequired,
        computePortal: PropTypes.object.isRequired,
        updatePortal: PropTypes.func.isRequired,
        computeLogin: PropTypes.object.isRequired,
        publishPortal: PropTypes.func.isRequired,
        unpublishPortal: PropTypes.func.isRequired,
        publishDialect: PropTypes.func.isRequired,
        publishDialectOnly: PropTypes.func.isRequired,
        unpublishDialect: PropTypes.func.isRequired,
        enableDialect: PropTypes.func.isRequired,
        disableDialect: PropTypes.func.isRequired,
        computeDialectUnpublish: PropTypes.object.isRequired,
        computePublish: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        // Bind methods to 'this'
        ['_onNavigateRequest', '_handleDialectSearchSubmit', '_onSwitchAreaRequest', '_enableToggleAction', '_publishToggleAction', '_publishChangesAction', '_handleGalleryDropDownChange', '_handleSelectionChange'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
        newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal', intl.trans('views.pages.explore.dialect.fetching_community_portal', 'Fetching community portal.', 'first'),
            null,
            intl.trans('views.pages.explore.dialect.problem_fetching_portal', 'Problem fetching community portal it may be unpublished or offline.', 'first'));
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        //console.log(JSON.stringify(nextProps, null, '\t'));

        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }

        else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
            this.fetchData(nextProps);
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    _onSwitchAreaRequest(e, index, value) {
        this._onNavigateRequest(this.props.windowPath.replace((value == 'sections') ? 'Workspaces' : 'sections', value));
    }

    /**
     * Toggle dialect (enabled/disabled)
     */
    _enableToggleAction(toggled) {
        if (toggled) {
            this.props.enableDialect(this.props.routeParams.dialect_path, null, null, intl.trans('views.pages.explore.dialect.dialect_enabled', 'Dialect enabled!', 'first', [], null, '!'));
        } else {
            this.props.disableDialect(this.props.routeParams.dialect_path, null, null, intl.trans('views.pages.explore.dialect.dialect_disabled', 'Dialect disabled!', 'first', [], null, '!'));
        }
    }

    /**
     * Toggle published dialect
     */
    _publishChangesAction() {
        this.props.publishPortal(this.props.routeParams.dialect_path + '/Portal', null, null, intl.trans('views.pages.explore.dialect.portal_published_successfully', 'Portal published successfully!', 'first', [], null, '!'));
        this.props.publishDialectOnly(this.props.routeParams.dialect_path, {target: this.props.routeParams.language_path.replace('Workspaces', 'sections')}, null, null);
    }

    /**
     * Toggle published dialect
     */
    _publishToggleAction(toggled) {
        if (toggled) {
            this.props.publishDialect(this.props.routeParams.dialect_path, null, null, intl.trans('views.pages.explore.dialect.dialect_published_successfully', 'Dialect published successfully!', 'first', [], null, '!'));
        } else {
            this.props.unpublishDialect(this.props.routeParams.dialect_path, null, null, intl.trans('views.pages.explore.dialect.dialect_unpublished_successfully', 'Dialect unpublished successfully', 'first', [], null, '!'));
        }
    }

    _handleDialectSearchSubmit() {
        let queryParam = this.refs.dialectSearchField.getValue();
        // Clear out the input field
        //this.refs.dialectSearchField.setValue("");
        this.props.replaceWindowPath(this.props.windowPath + '/search/' + queryParam);
    }

    _handleGalleryDropDownChange(event, key, payload) {
        //console.log(payload);
        if (payload !== "dropDownLabel") {
            this.props.pushWindowPath(payload);
        }
    }

    _handleSelectionChange(itemId, item) {
        let itemPath = selectn('properties.path', item).replace('Dictionary', 'learn/words');
        NavigationHelpers.navigate('/' + this.props.routeParams.theme + itemPath, this.props.pushWindowPath, true);
    }

    render() {

        const {computeLogin, updatePortal, updateDialect2} = this.props;

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }, {
            'id': this.props.routeParams.dialect_path + '/Portal',
            'entity': this.props.computePortal
        }]);

        let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
        let computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');

        const isSection = this.props.routeParams.area === 'sections';
        const isKidsTheme = this.props.routeParams.theme === 'kids';

        // Render kids view
        if (isKidsTheme && computePortal) {
            return <PromiseWrapper computeEntities={computeEntities}>
                <Kids {...this.props} portal={computePortal}/>
            </PromiseWrapper>;
        }

        let featuredWords = selectn('response.contextParameters.portal.fv-portal:featured_words', computePortal) || [];

        /**
         * Suppress Editing for Language Recorders with Approvers
         */
        let roles = selectn('response.contextParameters.dialect.roles', computeDialect2);

        if (roles && roles.indexOf('Manage') === -1) {
            computeDialect2 = Object.assign(
                computeDialect2, {
                    response: Object.assign(computeDialect2.response, {
                        contextParameters: Object.assign(computeDialect2.response.contextParameters, {permissions: ['Read']})
                    })
                });
        }

        let portalRoles = selectn('response.contextParameters.portal.roles', computePortal);
        let portalPermissions = selectn('response.contextParameters.portal.permissions', computePortal);

        // if we have roles and no permissions
        if (portalRoles && !portalPermissions) {
            // we have the manage role, but no permissions
            if (portalRoles.indexOf('Manage') >= 0) {
                // update the permissions
                computePortal = Object.assign(
                    computePortal, {
                        response: Object.assign(computePortal.response, {
                            contextParameters: Object.assign(computePortal.response.contextParameters, {permissions: ['Read', 'Write', 'Everything']})
                        })
                    });
            }
        }
        
        return <PromiseWrapper computeEntities={computeEntities}>

            {(() => {
                if (this.props.routeParams.area == 'Workspaces') {

                    if (selectn('response', computeDialect2)) {
                        return <PageToolbar
                            label={intl.trans('portal', 'Portal', 'first')}
                            handleNavigateRequest={this._onNavigateRequest}
                            computeEntity={computeDialect2}
                            showPublish={false}
                            actions={['edit', 'publish-toggle', 'enable-toggle', 'publish', 'more-options']}
                            publishToggleAction={this._publishToggleAction}
                            publishChangesAction={this._publishChangesAction}
                            enableToggleAction={this._enableToggleAction}
                            {...this.props} />;
                    }
                }
            })()}

            <Header
                portal={{compute: computePortal, update: updatePortal}}
                dialect={{compute: computeDialect2, update: updateDialect2}}
                login={computeLogin}
                routeParams={this.props.routeParams}>

                <Toolbar className="dialect-navigation">

                    <ToolbarGroup firstChild={true}>
                        <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn')}
                                    label={intl.trans('learn_our_lang', 'Learn Our Language', 'words')}/>
                        <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')}
                                    label={intl.trans('views.pages.explore.dialect.play_game', 'Play a Game', 'words')}/>
                        <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery')}
                                    label={intl.trans('views.pages.explore.dialect.photo_gallery', 'Photo Gallery', 'words')}/>
                        <FlatButton
                            onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath.replace('explore', 'kids'))}
                            label={intl.trans('views.pages.explore.dialect.kids_portal', 'Kids Portal', 'words')}/>
                    </ToolbarGroup>

                </Toolbar>

            </Header>

            <div className={classNames('row', 'dialect-body-container')} style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-12', 'col-md-7')}>
                    <div>
                        <TextHeader title={intl.trans('views.pages.explore.dialect.about_us', 'ABOUT US', 'upper')}
                                    tag="h2"
                                    properties={this.props.properties}/>
                        <AuthorizationFilter
                            filter={{permission: 'Write', entity: selectn('response', computeDialect2)}}
                            renderPartial={true}>
                            <EditableComponentHelper className="fv-portal-about" isSection={isSection}
                                                     computeEntity={computePortal} updateEntity={updatePortal}
                                                     property="fv-portal:about"
                                                     entity={selectn('response', computePortal)}/>
                        </AuthorizationFilter>
                    </div>

                    <div>
                        {(() => {
                            if (selectn('response.properties.fv-portal:news', computePortal) || !isSection) {
                                return <AuthorizationFilter
                                    filter={{permission: 'Write', entity: selectn('response', computeDialect2)}}
                                    renderPartial={true}>
                                    <div>
                                        <h3>{intl.trans('news', 'News', 'first')}</h3>
                                        <EditableComponentHelper isSection={isSection} computeEntity={computePortal}
                                                                 updateEntity={updatePortal} property="fv-portal:news"
                                                                 entity={selectn('response', computePortal)}/>
                                    </div>
                                </AuthorizationFilter>;
                            }
                        })()}

                    </div>

                </div>

                <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>

                    {(featuredWords.length > 0) ?
                        <TextHeader tag="h2" title={intl.trans('first_words', 'FIRST WORDS', 'upper')}
                                    properties={this.props.properties}/> : ''}

                    <GridView
                        action={this._handleSelectionChange}
                        cols={3}
                        cellHeight={194}
                        type="FVWord"
                        className="grid-view-first-words"
                        metadata={selectn('response', computeDialect2)}
                        items={featuredWords.map(function (word) {
                            return {
                                contextParameters: {
                                    word: {
                                        related_pictures: [selectn('fv:related_pictures[0]', word)],
                                        related_audio: [selectn('fv:related_audio[0]', word)]
                                    }
                                }, properties: word
                            };
                        })}/>


                    <div>
                        {(() => {
                            if (selectn('response.contextParameters.portal.fv-portal:related_links.length', computePortal) > 0 || !isSection) {
                                return <AuthorizationFilter
                                    filter={{permission: 'Write', entity: selectn('response', computePortal)}}
                                    renderPartial={true}>
                                    <div>
                                        <TextHeader tag="h2"
                                                    title={intl.trans('related_links', 'RELATED LINKS', 'upper')}
                                                    properties={this.props.properties}/>
                                        <EditableComponentHelper
                                            isSection={isSection}
                                            computeEntity={computePortal}
                                            updateEntity={updatePortal}
                                            context={computeDialect2}
                                            showPreview={true}
                                            previewType="FVLink"
                                            property="fv-portal:related_links"
                                            sectionProperty="contextParameters.portal.fv-portal:related_links"
                                            entity={selectn('response', computePortal)}/>
                                    </div>
                                </AuthorizationFilter>;
                            }
                        })()}
                    </div>

                </div>

            </div>
        </PromiseWrapper>;
    }
};