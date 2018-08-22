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

import CategoryList from 'views/components/Browsing/category-list';
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
const FilteredCategoryList = withFilter(CategoryList);

/**
 * Categories page for words
 */
@provide
export default class Categories extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        fetchCategories: PropTypes.func.isRequired,
        computeCategories: PropTypes.object.isRequired,
        fetchPortal: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        routeParams: PropTypes.object.isRequired,
        action: PropTypes.func
    };

    /*static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            pathOrId: null,
            filteredList: null,
            open: false,
            categoriesPath: null
        };

        // Bind methods to 'this'
        ['_onNavigateRequest'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        const pathOrId = '/' + newProps.properties.domain + '/' + newProps.routeParams.area;
        const categoriesPath = '/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children';

        newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
        newProps.fetchCategories(categoriesPath);
        this.setState({categoriesPath})
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

    _onNavigateRequest(category) {
        if (this.props.action) {
            this.props.action(category);
        } else {
            this.props.pushWindowPath('/' + this.props.routeParams.theme + this.props.routeParams.dialect_path + '/learn/words/categories/' + category.uid);
        }
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.state.categoriesPath,
            'entity': this.props.computeCategories
        }])

        const computeCategories = ProviderHelpers.getEntry(this.props.computeCategories, this.state.categoriesPath);

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="row">

                <div className="col-xs-12">

                    <CategoryList action={this._onNavigateRequest}
                                  items={selectn('response.entries', computeCategories)} cols={6}/>

                </div>
            </div>
        </PromiseWrapper>;
    }
}