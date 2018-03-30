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
import StringHelpers from 'common/StringHelpers';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';

import RaisedButton from 'material-ui/lib/raised-button';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import GeneralList from 'views/components/Browsing/general-list';

import withFilter from 'views/hoc/grid-list/with-filter';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const DEFAULT_LANGUAGE = 'english';

const FilteredList = withFilter(GeneralList);

/**
 * Learn songs
 */
@provide
export default class PageDialectGalleries extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        fetchPortal: PropTypes.func.isRequired,
        computePortal: PropTypes.object.isRequired,
        fetchGalleries: PropTypes.func.isRequired,
        computeGalleries: PropTypes.object.isRequired,
        computeLogin: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        typeFilter: PropTypes.string,
        typePlural: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            filteredList: null
        };

        // Bind methods to 'this'
        ['_onNavigateRequest', '_onItemNavigateRequest', 'fixedListFetcher'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
        newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');

        newProps.fetchGalleries(newProps.routeParams.dialect_path + '/Portal');
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.windowPath !== this.props.windowPath) {
            this.fetchData(nextProps);
        }
    }

    fixedListFetcher(list) {
        this.setState({
            filteredList: list
        });
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    _onItemNavigateRequest(path) {
        this.props.pushWindowPath(path.replace('/Portal', '/gallery'));
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path + '/Portal',
            'entity': this.props.computePortal
        }, {
            'id': this.props.routeParams.dialect_path + '/Portal',
            'entity': this.props.computeGalleries
        }])

        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
        const computeGalleries = ProviderHelpers.getEntry(this.props.computeGalleries, this.props.routeParams.dialect_path + '/Portal');

        const isKidsTheme = this.props.routeParams.theme === 'kids';

        let listProps = {
            defaultLanguage: DEFAULT_LANGUAGE,
            fixedList: true,
            fixedListFetcher: this.fixedListFetcher,
            filteredItems: this.state.filteredList,
            contextParamsKey: 'gallery',
            area: this.props.routeParams.area,
            metadata: selectn('response', computeGalleries),
            items: selectn('response.entries', computeGalleries) || [],
            action: this._onItemNavigateRequest
        };

        let listView = <FilteredList {...listProps} />;

        if (isKidsTheme) {
            listView = <GeneralList {...listProps} cols={3} theme={this.props.routeParams.theme}/>
        }

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <div className={classNames('row', 'row-create-wrapper', {'hidden': isKidsTheme})}>
                <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
                    <AuthorizationFilter hideFromSections={true} routeParams={this.props.routeParams} filter={{
                        role: ['Record', 'Approve', 'Everything'],
                        entity: selectn('response', computeDialect2),
                        login: this.props.computeLogin
                    }}>
                        <RaisedButton label={intl.trans('create_gallery', "Create Gallery", 'words')}
                                      onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')}
                                      primary={true}/>
                    </AuthorizationFilter>
                </div>

                <div className="col-xs-12">
                    <h1>{intl.trans('views.pages.explore.dialect.gallery.x_galleries',
                        selectn('response.title', computeDialect2) + ' Galleries', 'words',
                        [selectn('response.title', computeDialect2)])}</h1>
                </div>

            </div>

            <div className="row">
                <div className="col-xs-12">

                    <div className="row" style={{marginBottom: '20px'}}>
                        <div className={classNames('col-xs-12', {
                            'col-xs-8': isKidsTheme,
                            'col-xs-offset-2': isKidsTheme
                        })}>
                            {listView}
                        </div>
                    </div>

                </div>
            </div>
        </PromiseWrapper>;
    }
}
