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

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import Paper from 'material-ui/lib/paper';

import RaisedButton from 'material-ui/lib/raised-button';

import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import Preview from 'views/components/Editor/Preview';
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel';

import BookEntry from 'views/pages/explore/dialect/learn/songs-stories/entry/view';
import BookEntryList from 'views/pages/explore/dialect/learn/songs-stories/entry/list-view';

import withActions from 'views/hoc/view/with-actions';
import withPagination from 'views/hoc/grid-list/with-pagination';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const DetailsViewWithActions = withActions(PromiseWrapper, true);

const DefaultFetcherParams = {currentPageIndex: 1, pageSize: 1};

const PaginatedBookEntryList = withPagination(BookEntryList, DefaultFetcherParams.pageSize, 100);

const DEFAULT_LANGUAGE = 'english';

/**
 * View Book
 */
@provide
export default class View extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        changeTitleParams: PropTypes.func.isRequired,
        overrideBreadcrumbs: PropTypes.func.isRequired,
        computeLogin: PropTypes.object.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        fetchBook: PropTypes.func.isRequired,
        computeBook: PropTypes.object.isRequired,
        fetchBookEntries: PropTypes.func.isRequired,
        computeBookEntries: PropTypes.object.isRequired,
        deleteBookEntry: PropTypes.func.isRequired,
        routeParams: PropTypes.object.isRequired,
        //typePlural: PropTypes.string,

        deleteBook: PropTypes.func.isRequired,
        publishBook: PropTypes.func.isRequired,
        askToPublishBook: PropTypes.func.isRequired,
        unpublishBook: PropTypes.func.isRequired,
        askToUnpublishBook: PropTypes.func.isRequired,
        enableBook: PropTypes.func.isRequired,
        askToEnableBook: PropTypes.func.isRequired,
        disableBook: PropTypes.func.isRequired,
        askToDisableBook: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            fetcherParams: DefaultFetcherParams,
            bookOpen: false
        };

        // Bind methods to 'this'
        ['_onNavigateRequest', 'fetchData', '_fetchListViewData'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(props = this.props) {
        props.fetchBook(this._getBookPath(props));
        this._fetchListViewData(this.state.fetcherParams, props);
        props.fetchDialect2(props.routeParams.dialect_path);
    }

    _fetchListViewData(fetcherParams, props = this.props) {
        this.setState({
            fetcherParams: fetcherParams
        });

        props.fetchBookEntries(this._getBookPath(props),
            '&currentPageIndex=' + (fetcherParams.currentPageIndex - 1) +
            '&pageSize=' + fetcherParams.pageSize +
            '&sortOrder=asc,asc' +
            '&sortBy=fvbookentry:sort_map,dc:created');
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let book = selectn('response', ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath()));
        let title = selectn('properties.dc:title', book);
        let uid = selectn('uid', book);

        if (title && selectn('pageTitleParams.bookName', this.props.properties) != title) {
            this.props.changeTitleParams({'bookName': title});
            this.props.overrideBreadcrumbs({find: uid, replace: 'pageTitleParams.bookName'});
        }
    }

    _getBookPath(props = null) {

        if (props == null) {
            props = this.props;
        }

        if (StringHelpers.isUUID(props.routeParams.bookName)){
            return props.routeParams.bookName;
        } else {
            return props.routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(props.routeParams.bookName);
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this._getBookPath(),
            'entity': this.props.computeBook
        }, {
            'id': this._getBookPath(),
            'entity': this.props.computeBookEntries
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath());
        const computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookPath());
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        let page;
        const isKidsTheme = this.props.routeParams.theme === 'kids';

        if (!this.state.bookOpen) {
            page = <BookEntry cover={true} defaultLanguage={DEFAULT_LANGUAGE}
                              pageCount={selectn('response.resultsCount', computeBookEntries)}
                              entry={selectn('response', computeBook)} openBookAction={() => {
                this.setState({bookOpen: true})
            }}/>
        } else {
            page = <PaginatedBookEntryList
                style={{overflowY: 'auto', maxHeight: '50vh'}}
                cols={5}
                cellHeight={150}
                disablePageSize={true}
                defaultLanguage={DEFAULT_LANGUAGE}
                fetcher={this._fetchListViewData}
                fetcherParams={this.state.fetcherParams}
                metadata={selectn('response', computeBookEntries) || {}}
                items={selectn('response.entries', computeBookEntries) || []}
                appendControls={[(this.state.bookOpen) ? <RaisedButton
                    label={intl.trans('views.pages.explore.dialect.learn.songs_stories.close_book', 'Close Book', 'first')}
                    key="close" onTouchTap={() => {
                    this.setState({bookOpen: false})
                }}/> : '']}/>
        }

        if (isKidsTheme) {
            return page;
        }

        return <DetailsViewWithActions labels={{single: "Book"}}
                                       itemPath={this._getBookPath()}
                                       actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish', 'add-child']}
                                       publishAction={this.props.publishBook}
                                       unpublishAction={this.props.unpublishBook}
                                       askToPublishAction={this.props.askToPublishBook}
                                       askToUnpublishAction={this.props.askToUnpublishBook}
                                       enableAction={this.props.enableBook}
                                       askToEnableAction={this.props.askToEnableBook}
                                       disableAction={this.props.disableBook}
                                       askToDisableAction={this.props.askToDisableBook}
                                       deleteAction={this.props.deleteBook}
                                       onNavigateRequest={this._onNavigateRequest}
                                       computeItem={computeBook}
                                       permissionEntry={computeDialect2}
                                       computeEntities={computeEntities}
                                       {...this.props}>

            {page}

        </DetailsViewWithActions>;
    }
}
