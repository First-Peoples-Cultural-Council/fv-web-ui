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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import classNames from 'classnames';

import selectn from 'selectn';
import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const innerUlStyle = {
    'fontSize': '0.9em',
    'margin': 0,
    'padding': '0 15px'
};

/**
 * Data List View
 * TODO: Convert to composition vs. inheritance https://facebook.github.io/react/docs/composition-vs-inheritance.html
 */
export default class DataListView extends Component {

    constructor(props, context) {
        super(props, context);
    }

    // Fetch data on initial render
    componentDidMount() {
        this._resetColumns(this.props);
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {

        if (nextProps.controlViaURL) {
            if (nextProps.routeParams.page !== this.props.routeParams.page || nextProps.routeParams.pageSize !== this.props.routeParams.pageSize) {
                this._fetchListViewData(nextProps, nextProps.DEFAULT_PAGE, nextProps.DEFAULT_PAGE_SIZE, nextProps.DEFAULT_SORT_TYPE, nextProps.DEFAULT_SORT_COL);
                this._resetPagination(nextProps);
            }
        } else {
            if (nextProps.windowPath !== this.props.windowPath) {
                this.fetchData(nextProps);
            }
        }

        if (nextProps.routeParams.area !== this.props.routeParams.area) {
            this._resetColumns(nextProps);
            this._resetPagination(nextProps);
        }

        if (this.props.filter.has('currentAppliedFilter') && !this.props.filter.get('currentAppliedFilter').equals(nextProps.filter.get('currentAppliedFilter'))) {
            this._fetchListViewData(nextProps, nextProps.DEFAULT_PAGE, nextProps.DEFAULT_PAGE_SIZE, nextProps.DEFAULT_SORT_TYPE, nextProps.DEFAULT_SORT_COL);
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path);
    }

    _handleRefetch(dataGridProps, page, pageSize) {

        this.setState({
            pageInfo: {
                page: page,
                pageSize: pageSize
            }
        });

        let sortInfo = null;
        let currentSortCols = null;

        if (this.state.hasOwnProperty('sortInfo') && this.state.sortInfo.hasOwnProperty('currentSortType')) {
            sortInfo = this.state.sortInfo.currentSortType;
            currentSortCols = this.state.sortInfo.currentSortCols;
        }

        if (!this.props.controlViaURL) {
            this._fetchListViewData(this.props, page, pageSize, sortInfo, currentSortCols);    
        } else {

            let urlPageSize = selectn('pageSize', this.props.routeParams);

            // If page and pageSize exist, replace; otherwise - add them
            if (selectn('page', this.props.routeParams) && urlPageSize){
                NavigationHelpers.navigateForwardReplaceMultiple(this.props.splitWindowPath, [pageSize.toString(), page.toString()], this.props.pushWindowPath);
            } else {
                NavigationHelpers.navigateForward(this.props.splitWindowPath, [pageSize.toString(), page.toString()], this.props.pushWindowPath);
            }

            // If pageSize has changed, reset page
            if (urlPageSize && pageSize != urlPageSize && this.props.onPaginationReset) {
                this.props.onPaginationReset(pageSize);
            }
        }
    }

    _handleSortChange(sortInfo) {

        let colRequestSkipped = false;
        let sortCol = [];
        let sortType = [];

        sortInfo.map(function (sortColumn, i) {

            let name = selectn('[' + i + '].name', sortInfo);

            if (this.props.DISABLED_SORT_COLS.indexOf(name) === -1) {

                let definedCol = this.state.columns.find(function (item) {
                    return item.name === name;
                });

                sortCol.push((selectn('sortName', definedCol)) ? selectn('sortName', definedCol) : name);
                sortType.push((selectn('[' + i + '].dir', sortInfo) == -1) ? 'desc' : 'asc');
            } else {
                if (i === sortInfo.length - 1)
                    colRequestSkipped = true;
            }
        }.bind(this));

        if (sortCol.length == 0) {
            sortCol = [this.props.DEFAULT_SORT_COL];
            sortType = [this.props.DEFAULT_SORT_TYPE];
        }

        let joinedSortType = sortType.join();
        let joinedSortCols = sortCol.join();

        // Skip updating if last sort addition is disabled
        if (colRequestSkipped)
            return;

        this._fetchListViewData(this.props, this.props.DEFAULT_PAGE, this.props.DEFAULT_PAGE_SIZE, joinedSortType, joinedSortCols);

        let newSortInfo = {
            uiSortOrder: sortInfo,
            currentSortCols: joinedSortCols,
            currentSortType: joinedSortType
        };

        // Update page properties to use when navigating away
        this.props.onPagePropertiesChange({sortInfo: newSortInfo});

        this.setState({
            sortInfo: newSortInfo
        });
    }

    _handleColumnOrderChange(index, dropIndex) {
        var col = this.state.columns[index]
        this.state.columns.splice(index, 1)
        this.state.columns.splice(dropIndex, 0, col)
        this.setState({})
    }

    _resetColumns(props) {

        if (this.state.fixedCols || this.state.hideStateColumn) {
            return;
        }

        // Toggle 'state' column for section/workspaces view
        if (this.state.hasOwnProperty('columns')) {
            if (props.routeParams.area == 'sections') {
                let stateCol = this.state.columns.findIndex(function (item) {
                    return item.name === 'state';
                });

                this.state.columns.splice(stateCol, 1);
            } else {
                this.state.columns.push({name: 'state', title: intl.trans('state', 'State', 'first')});
            }
        }
    }

    _resetPagination(props) {
        this.setState({
            pageInfo: {
                page: props.DEFAULT_PAGE,
                pageSize: props.DEFAULT_PAGE_SIZE
            }
        })
    }
}