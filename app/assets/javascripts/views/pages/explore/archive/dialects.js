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

import ConfGlobal from 'conf/local.json';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import ProviderHelpers from 'common/ProviderHelpers';

import PortalList from 'views/components/Browsing/portal-list'
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import Checkbox from 'material-ui/lib/checkbox';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import withPagination from 'views/hoc/grid-list/with-pagination';
import withFilter from 'views/hoc/grid-list/with-filter';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
//const FilteredPortalList = withFilter(PortalList);

/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class ExploreDialects extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        fetchPortals: PropTypes.func.isRequired,
        computePortals: PropTypes.object.isRequired,
        computeLogin: PropTypes.object.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    /*static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            filteredList: null,
            open: false
        };

        // Bind methods to 'this'
        ['_onNavigateRequest', 'fixedListFetcher', '_getParentPath'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchPortals(this._getQueryPath(newProps));
    }

    fixedListFetcher(list) {
        this.setState({
            filteredList: list
        });
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.routeParams.area != this.props.routeParams.area) {
            this.fetchData(nextProps);
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath('/' + this.props.routeParams.theme + path);
    }

    _getParentPath(props = this.props) {
        return '/' + props.properties.domain + '/' + props.routeParams.area;
    }

    _getQueryPath(props = this.props) {
        
        // Perform an API query for sections
        if (props.routeParams.area == 'sections') {
            // From s3 (static) (NOTE: when fetchPortals is fully switched remove headers from FVPortal to save OPTIONS call)
            return ConfGlobal.apiURL + 's3dialects/?area=' + props.routeParams.area;
            
            // Proxy (not cached at the moment)
            //return 'https://api.firstvoices.com/v1/api/v1/query/get_dialects?queryParams=' + props.routeParams.area;
        }
        else {
            // Direct method
            return '/api/v1/query/get_dialects?queryParams=' + props.routeParams.area;
        }
    }

    render() {

        const isKidsTheme = this.props.routeParams.theme === 'kids';

        const computeEntities = Immutable.fromJS([{
            'id': this._getQueryPath(),
            'entity': this.props.computePortals
        }])

        const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this._getQueryPath());
        let isLoggedIn = this.props.computeLogin.success && this.props.computeLogin.isConnected;

        let portalsEntries = selectn('response.entries', computePortals) || [];

        let titleFieldMapping = 'contextParameters.ancestry.dialect.dc:title';
        let logoFieldMapping = 'contextParameters.portal.fv-portal:logo';

        if (this.props.routeParams.area == 'sections') {
            titleFieldMapping = 'title';
            logoFieldMapping = 'logo';
        }

        // Sort based on dialect name (all FVPortals have dc:title 'Portal')
        let sortedPortals = portalsEntries.sort(function (a, b) {

            let a2 = selectn(titleFieldMapping, a);
            let b2 = selectn(titleFieldMapping, b);

            if (a2 < b2) return -1;
            if (a2 > b2) return 1;
            return 0;
        });

        let portalListProps = {
            action: this._onNavigateRequest,
            filterOptionsKey: (isLoggedIn) ? 'Portals' : 'Default',
            fixedList: true,
            area: this.props.routeParams.area,
            fixedListFetcher: this.fixedListFetcher,
            filteredItems: this.state.filteredList,
            fieldMapping: {
                title: titleFieldMapping,
                logo: logoFieldMapping
            },
            metadata: selectn('response', computePortals),
            items: sortedPortals
        };

        let portalList = <PortalList {...portalListProps} cols={4}/>;

        if (isKidsTheme) {
            portalList = <PortalList {...portalListProps} cols={6}/>
        }

        return <PromiseWrapper computeEntities={computeEntities}>
            <div className="row">

                <div className="col-xs-12">

                    <div className={classNames({'hidden': isKidsTheme})}>
                        <h1>{intl.translate({key: 'general.explore', default: 'Explore Languages', case: 'title'})}</h1>
                    </div>

                    {portalList}

                </div>
            </div>
        </PromiseWrapper>;
    }
}