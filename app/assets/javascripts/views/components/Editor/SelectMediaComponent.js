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
import Immutable, {Map} from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';
import classNames from 'classnames';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import MediaList from 'views/components/Browsing/media-list';
import withPagination from 'views/hoc/grid-list/with-pagination';
import withFilter from 'views/hoc/grid-list/with-filter';
import LinearProgress from 'material-ui/lib/linear-progress';

import IconButton from 'material-ui/lib/icon-button';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import ActionInfoOutline from 'material-ui/lib/svg-icons/action/info-outline';
import IntlService from "views/services/intl";

const gridListStyle = {width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10};

const DefaultFetcherParams = {
    currentPageIndex: 1,
    pageSize: 10,
    filters: {'properties.dc:title': {appliedFilter: ''}, 'dialect': {appliedFilter: ''}}
};

const FilteredPaginatedMediaList = withFilter(withPagination(MediaList, DefaultFetcherParams.pageSize), DefaultFetcherParams);

const intl = IntlService.instance;

class SharedResourceGridTile extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showInfo: false
        }
    }

    render() {

        let tile = this.props.tile;
        let resourceParentDialect = selectn('contextParameters.ancestry.dialect', tile);
        let actionIcon = null;

        let isFVShared = selectn('path', tile) && selectn('path', tile).indexOf('SharedResources') != -1;
        let isDialectShared = selectn('uid', resourceParentDialect) != selectn('uid', this.props.dialect);

        // If resource is from different dialect, show notification so user is aware
        if (isDialectShared || isFVShared) {
            let tooltip = (isDialectShared) ? intl.trans('shared_from_x', "Shared from " + selectn('dc:title', resourceParentDialect), null, [selectn('dc:title', resourceParentDialect)])
                : intl.trans('shared_from_x_collection', 'Shared from FirstVoices Collection', null, ['FirstVoices']);
            actionIcon = <IconButton tooltip={tooltip} tooltipPosition="top-left">{(isDialectShared) ?
                <ActionInfoOutline color='white'/> : <ActionInfo color='white'/>}</IconButton>;
        }

        return <GridTile
            onTouchTap={(this.props.action) ? this.props.action.bind(this, this.props.tile) : null}
            key={selectn('uid', tile)}
            title={selectn('properties.dc:title', tile)}
            actionPosition="right"
            titlePosition={this.props.fileTypeTilePosition}
            actionIcon={actionIcon}
            subtitle={<span><strong>{Math.round(selectn('properties.common:size', tile) * 0.001)} KB</strong></span>}
        >
            {this.props.preview}
        </GridTile>;
    }
}

@provide
export default class SelectMediaComponent extends React.PureComponent {

    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        fetchSharedPictures: PropTypes.func.isRequired,
        computeSharedPictures: PropTypes.object.isRequired,
        fetchResources: PropTypes.func.isRequired,
        computeResources: PropTypes.object.isRequired,
        fetchSharedAudios: PropTypes.func.isRequired,
        computeSharedAudios: PropTypes.object.isRequired,
        fetchSharedVideos: PropTypes.func.isRequired,
        computeSharedVideos: PropTypes.object.isRequired,
        computeLogin: PropTypes.object.isRequired,
        dialect: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    };

    getDefaultValues() {
        label: intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')
    }

    _handleOpen() {
        this.setState({open: true});
    }

    _handleClose() {
        this.setState({open: false});
    }

    _handleSelectElement(value) {
        this.props.onComplete(value);
    }

    constructor(props) {
        super(props);

        // Bind methods to 'this'
        ['_handleOpen', '_handleClose', '_handleSelectElement', 'fetchData'].forEach((method => this[method] = this[method].bind(this)));

        // If initial filter value provided
        let providedTitleFilter = selectn('otherContext.providedFilter', this.props.dialect);
        let appliedParams = (providedTitleFilter) ? Object.assign({}, DefaultFetcherParams, {filters: {'properties.dc:title': {appliedFilter: providedTitleFilter}}}) : DefaultFetcherParams;

        this.state = {
            open: false,
            fetcherParams: appliedParams
        };
    }

    fetchData(fetcherParams) {

        if (selectn('path', this.props.dialect)) {
            // If searching for shared images, need to split filter into 2 groups so NXQL is formatted correctly.
            let group1 = new Map(fetcherParams.filters).filter((v, k) => k == 'shared_fv' || k == 'shared_dialects').toJS();
            let group2 = new Map(fetcherParams.filters).filterNot((v, k) => k == 'shared_fv' || k == 'shared_dialects').toJS();

            this.props.fetchResources('/FV/Workspaces/',
                ' AND ecm:primaryType ILIKE \'' + this.props.type + '\'' +
                ' AND ecm:isCheckedInVersion = 0 AND ecm:currentLifeCycleState != \'deleted\' AND ecm:currentLifeCycleState != \'Disabled\'' +
                ' AND (ecm:path STARTSWITH \'' + StringHelpers.clean(selectn('path', this.props.dialect)) + '/Resources/\'' + ProviderHelpers.filtersToNXQL(group1) + ')' + ProviderHelpers.filtersToNXQL(group2) +
                '&currentPageIndex=' + (fetcherParams.currentPageIndex - 1) +
                '&pageSize=' + fetcherParams.pageSize +
                '&sortBy=dc:created' +
                '&sortOrder=DESC'
            );

            this.setState({
                fetcherParams: fetcherParams
            });
        }
    }

    componentDidMount() {
        this.fetchData(this.state.fetcherParams);
    }

    render() {

        const actions = [
            <FlatButton
                label={intl.trans('cancel', 'Cancel', 'first')}
                secondary={true}
                onTouchTap={this._handleClose}/>
        ];

        let fileTypeLabel = intl.trans('file', 'file', 'lower');
        let fileTypeCellHeight = 210;
        let fileTypeTilePosition = 'bottom';

        switch (this.props.type) {
            case 'FVAudio':
                fileTypeLabel = intl.trans('audio_file', 'audio file', 'lower');
                fileTypeCellHeight = 100;
                fileTypeTilePosition = 'top';
                break;

            case 'FVPicture':
                fileTypeLabel = intl.trans('pictures', 'pictures', 'lower');
                break;

            case 'FVVideo':
                fileTypeLabel = intl.trans('videos', 'videos', 'lower');
                fileTypeTilePosition = 'top';
                break;
        }

        const computeResources = ProviderHelpers.getEntry(this.props.computeResources, '/FV/Workspaces/');
        const dialect = this.props.dialect;

        var SharedResourceGridTileWithDialect = React.createClass({
            render: function () {
                return React.createElement(SharedResourceGridTile, {...this.props, dialect: dialect});
            }
        });

        return (
            <div style={{display: 'inline'}}>
                <RaisedButton label={this.props.label} onTouchTap={this._handleOpen}/>
                <Dialog
                    title={intl.searchAndReplace("Select existing " + fileTypeLabel + " from " + selectn('properties.dc:title', dialect) + " dialect or shared resources") + ':'}
                    actions={actions}
                    modal={true}
                    contentStyle={{width: '80%', height: '80vh', maxWidth: '100%'}}
                    autoScrollBodyContent={true}
                    open={this.state.open}>

                    <div
                        className={classNames('alert', 'alert-info', {'hidden': !selectn('isFetching', computeResources)})}>
                        {intl.trans('loading_results_please_wait', 'Loading results, please wait.', 'first')}<br/>
                        <LinearProgress mode="indeterminate"/>
                    </div>

                    <FilteredPaginatedMediaList
                        style={{overflowY: 'auto', maxHeight: '100vh'}}
                        cols={5}
                        cellHeight={150}
                        filterOptionsKey={'ResourcesSelector'}
                        action={this._handleSelectElement}
                        fetcher={this.fetchData}
                        gridListTile={SharedResourceGridTileWithDialect}
                        fetcherParams={this.state.fetcherParams}
                        initialValues={{'dc:contributors': selectn("response.properties.username", this.props.computeLogin)}}
                        metadata={selectn('response', computeResources) || selectn('response_prev', computeResources)}
                        items={selectn('response.entries', computeResources) || selectn('response_prev.entries', computeResources) || []}/>

                </Dialog>
            </div>
        );
    }
}
