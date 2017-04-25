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
import Immutable, { List, Set, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';
import WordListView from 'views/pages/explore/dialect/learn/words/list-view';

import CircularProgress from 'material-ui/lib/circular-progress';
import RaisedButton from 'material-ui/lib/raised-button';

import FacetFilterList from 'views/components/Browsing/facet-filter-list';

/**
* Learn words
*/
@provide
export default class PageDialectLearnWords extends PageDialectLearnBase {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    computeLogin: PropTypes.object.isRequired, 
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeCategories: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    let initialCategories = (props.routeParams.category) ? new Set([props.routeParams.category]) : new Set();

    this.state = {
      filterInfo: new Map({
        currentCategoryFilterIds: initialCategories,
        currentAppliedFilter: new Map({
          categories: (props.routeParams.category) ? ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys('fv-word:categories', props.routeParams.area) + '/* IN ("' + props.routeParams.category + '")' : ''
        })
      })
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleFacetSelected'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path);
  }

  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary');

    newProps.fetchCategories('/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children');
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computePortal
    },{
      'id': '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children',
      'entity': this.props.computeCategories
    }])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');
    const computeCategories = ProviderHelpers.getEntry(this.props.computeCategories, '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children');

    let computeCategoriesSize = selectn('response.entries.length', computeCategories) || 0;

    const isKidsTheme = this.props.routeParams.theme === 'kids';

    const wordListView = <WordListView filter={this.state.filterInfo} routeParams={this.props.routeParams} />;

    // Render kids view
    if (isKidsTheme) {

      let kidsFilter = new Map({
        currentAppliedFilter: new Map({
          //kids: ' AND fv:available_in_childrens_archive=1'
        })
      })

      return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="row">
              <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>
                {React.cloneElement(wordListView, { gridListView: true, DEFAULT_PAGE_SIZE: 8, filter: kidsFilter })}
              </div>
            </div>
      </PromiseWrapper>;
    }

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
              <div className={classNames('row', 'row-create-wrapper')}>
                <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
                  <AuthorizationFilter hideFromSections={true} routeParams={this.props.routeParams} filter={{role: ['Record', 'Approve', 'Everything'], entity: selectn('response', computeDocument), login: this.props.computeLogin}}>
                    <RaisedButton label="Create New Word" onTouchTap={this._onNavigateRequest.bind(this, 'create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className={classNames('col-xs-12', 'col-md-3', (computeCategoriesSize == 0) ? 'hidden': null)}>
                  <FacetFilterList
                    title='Categories'
                    appliedFilterIds={this.state.filterInfo.get('currentCategoryFilterIds')}
                    facetField={ProviderHelpers.switchWorkspaceSectionKeys('fv-word:categories', this.props.routeParams.area)}
                    onFacetSelected={this._handleFacetSelected}
                    facets={selectn('response.entries', computeCategories) || []} />
                </div>
                <div className={classNames('col-xs-12', (computeCategoriesSize == 0) ? 'col-md-12': 'col-md-9')}>
                  <h1>{selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)} Words</h1>
                  {wordListView}
                </div>
              </div>
        </PromiseWrapper>;
  }
}