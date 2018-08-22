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
import DataGrid from 'react-datagrid';

import GridView from 'views/pages/explore/dialect/learn/base/grid-view';

import ClearFix from 'material-ui/lib/clearfix';
import Paper from 'material-ui/lib/paper';

import withPagination from 'views/hoc/grid-list/with-pagination';

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

// Stylesheet
import '!style-loader!css-loader!react-datagrid/dist/index.min.css';

const GridViewWithPagination = withPagination(GridView, 8);

function debounce(a, b, c) {
    var d, e;
    return function () {
        function h() {
            d = null, c || (e = a.apply(f, g))
        }

        var f = this, g = arguments;
        return clearTimeout(d), d = setTimeout(h, b), c && !d && (e = a.apply(f, g)), e
    }
}

export default class DocumentListView extends Component {

    static defaultProps = {
        pagination: true,
        usePrevResponse: false
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedId: null
        };

        // Bind methods to 'this'
        ['_handleSelectionChange', '_onPageChange', '_onPageSizeChange', '_gridListFetcher'].forEach((method => this[method] = this[method].bind(this)));
    }

    _handleSelectionChange(newSelectedId, data) {
        this.setState({
            selectedId: newSelectedId
        });

        this.props.onSelectionChange(data);
    }

    _onPageChange = debounce((page) => {
        // Skip if page hasn't actually changed.
        if (page == this.props.page) {
            return;
        }

        this.setState({
            page: page
        });

        this.props.refetcher(this.props, page, this.props.pageSize);
    }, 750);

    _onPageSizeChange(pageSize, props) {
        // Skip if page size hasn't actually changed
        if (pageSize === this.props.pageSize) {
            return;
        }

        let newPage = this.props.page;

        if (pageSize > this.props.pageSize) {
            newPage = Math.min(this.props.page, Math.ceil(this.props.data.response.totalSize / pageSize));
        }

        // Refresh data
        this.props.refetcher(this.props, newPage, pageSize);
    }

    _gridListFetcher(fetcherParams) {
        this.props.refetcher(this.props, fetcherParams.currentPageIndex, fetcherParams.pageSize);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != this.props.data) {
            this.setState({
                page: 1
            });
        }
    }

    render() {
        // Styles
        var DataGridStyles = {
            minHeight: "70vh",
            zIndex: 0
        };

        if (this.props.gridListView) {
            let gridViewProps = {
                style: {overflowY: 'auto', maxHeight: '50vh'},
                cols: this.props.gridCols,
                cellHeight: 160,
                fetcher: this._gridListFetcher,
                type: this.props.type,
                pagination: this.props.pagination,
                fetcherParams: {currentPageIndex: this.props.page, pageSize: (this.props.pageSize)},
                metadata: selectn('response', this.props.data),
                gridListTile: this.props.gridListTile,
                items: selectn('response.entries', this.props.data)
            };

            gridViewProps = Object.assign({}, gridViewProps, this.props.gridViewProps);

            if (this.props.pagination) {
                return <GridViewWithPagination {...gridViewProps} />;
            } else {
                return <GridView {...gridViewProps} />;
            }
        }

        return <Paper><ClearFix>
            <DataGrid
                idProperty="uid"
                dataSource={selectn('response.entries', this.props.data)}
                dataSourceCount={selectn('response.totalSize', this.props.data)}
                columns={this.props.columns}
                rowHeight={55}
                style={DataGridStyles}
                selected={this.state.selectedId}
                onSelectionChange={this._handleSelectionChange}
                //onColumnOrderChange={this.props.onColumnOrderChange}
                onSortChange={this.props.onSortChange}
                withColumnMenu={false}
                pagination={this.props.pagination}
                paginationToolbarProps={{
                    showRefreshIcon: false,
                    pageSizes: [10, 20, 50],
                }}
                sortInfo={this.props.sortInfo}
                page={this.props.page}
                pageSize={this.props.pageSize}
                onPageChange={this._onPageChange}
                onPageSizeChange={this._onPageSizeChange}
                emptyText={intl.trans('no_records', 'No records', 'words')}
                showCellBorders={true}/>
        </ClearFix></Paper>;
    }
}