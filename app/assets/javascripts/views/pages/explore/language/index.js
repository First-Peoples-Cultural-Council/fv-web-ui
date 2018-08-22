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

import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import ProviderHelpers from 'common/ProviderHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import PortalList from 'views/components/Browsing/portal-list'

import withFilter from 'views/hoc/grid-list/with-filter';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const FilteredPortalList = withFilter(PortalList);

/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class Explore extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        fetchDialects: PropTypes.func.isRequired,
        computeDialects: PropTypes.object.isRequired,
        fetchLanguage: PropTypes.func.isRequired,
        computeLanguage: PropTypes.object.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    /*static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            filteredList: null
        };

        ['_onNavigateRequest', 'fixedListFetcher'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchLanguage(newProps.routeParams.language_path);
        newProps.fetchDialects(newProps.routeParams.language_path);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.routeParams.language_path != this.props.routeParams.language_path) {
            this.fetchData(nextProps);
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath('/explore' + path);
    }

    fixedListFetcher(list) {
        this.setState({
            filteredList: list
        });
    }

    render() {

        const pathOrId = this.props.routeParams.language_path;

        const computeEntities = Immutable.fromJS([{
            'id': pathOrId,
            'entity': this.props.computeDialects
        }, {
            'id': pathOrId,
            'entity': this.props.computeLanguage
        }])

        const computeDialects = ProviderHelpers.getEntry(this.props.computeDialects, pathOrId);
        const computeLanguage = ProviderHelpers.getEntry(this.props.computeLanguage, pathOrId);

        let portalListProps = {
            action: this._onNavigateRequest,
            filterOptionsKey: 'Default',
            fixedList: true,
            area: this.props.routeParams.area,
            fixedListFetcher: this.fixedListFetcher,
            filteredItems: this.state.filteredList,
            metadata: selectn('response', computeDialects),
            items: selectn('response.entries', computeDialects) || []
        };

        return <PromiseWrapper computeEntities={computeEntities}>
            <div className="row">

                <div className="col-xs-12">
                    <h1>{selectn('response.properties.dc:title', computeLanguage)} &raquo; {intl.trans('dialects', 'Dialects', 'words')}</h1>
                    <FilteredPortalList {...portalListProps} />
                </div>
            </div>
        </PromiseWrapper>;
    }
}