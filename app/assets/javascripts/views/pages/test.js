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
import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';
//import QueryString from 'query-string';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';

import ProviderHelpers from 'common/ProviderHelpers';

import {RaisedButton} from 'material-ui';

import MediaList from 'views/components/Browsing/media-list';
import withPagination from 'views/hoc/grid-list/with-pagination';
import withFilter from 'views/hoc/grid-list/with-filter';

//import elasticsearch from 'elasticsearch';

const DefaultFetcherParams = { filters: {'properties.dc:title': '', 'dialect': '78086057-9c34-48f7-995f-9dc3b313231b' } };



const FilteredPaginatedMediaList = withFilter(withPagination(MediaList, 10), 'SharedPictures', DefaultFetcherParams);

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class Test extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    fetchSharedPictures: PropTypes.func.isRequired,
    computeSharedPictures: PropTypes.object.isRequired,
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired
  };

  /*static contextTypes = {
      muiTheme: PropTypes.object.isRequired
  };*/

  constructor(props, context){
    super(props, context);

    /*let computeEntities = new List();

    let computePortal = new Map([['id', '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect'], ['entity', this.props.computePortal]]);
*/

    this.state = {
      filteredList: null,
      fetcherParams: Object.assign({
        currentPageIndex: 0,
        pageSize: 10
      }, DefaultFetcherParams),
      pathOrId: "/FV/Workspaces/Data/Athabascan/Beaver/Tsaaʔ%20Dane%20-%20Beaver%20People/Dictionary/119430"
    }

    this.fetchData = this.fetchData.bind(this);
    this.fixedListFetcher = this.fixedListFetcher.bind(this);


    /*var client = new elasticsearch.Client({
      host: 'https://preprod.firstvoices.com/nuxeo/site/es',
      httpAuth: 'null:null',
      log: 'trace'
    });

    var test123 = client.search({
      index: 'nuxeo',
      'X-NXenrichers.document': 'breadcrumb', // enrichers -- not working here
      'enrichers.document': 'breadcrumb', // enrichers -- not working here
      'fetch.document' : 'dc:creator', // marshallers - not working here
      headers: {
        'X-NXenrichers.document': 'breadcrumb', // enrichers -- not working here
        'enrichers.document': 'breadcrumb', // enrichers -- not working here
        'fetch.document' : 'dc:creator' // marshallers - not working here
      },
      body: {
          "from" : 0,
          "size" : 100,
          //"_source": ["dc:title"],
          "query": {
            "filtered": {
              "filter": {
                  "bool": {
                      "must": 
                          [
                              {
                                "term": {
                                  "ecm:primaryType": "FVPortal"
                                }
                              },
                              {
                                "term": {
                                  "ecm:isVersion": 0
                                }
                              },
                              {
                                "prefix": {
                                  "ecm:path": "/FV/Workspaces/"
                                }
                              }
                          ]
                      ,
                      "must_not": [
                        {"term": {
                          "ecm:currentLifeCycleState": "deleted"
                        }}
                      ]
                    }
              }
            }
          }
      }
    }).then(function (resp) {
        var hits = resp.hits.hits;
    }, function (err) {
        console.trace(err.message);
    });*/
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list
    });
  }

  fetchData() {
    this.props.fetchWord(this.state.pathOrId);


  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData();
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    //if (nextProps.windowPath !== this.props.windowPath || nextProps.routeParams.area != this.props.routeParams.area) {
    //  this.fetchData(nextProps);
    //}
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.computePortal.size);
    if (nextProps.computePortal.size === 0) {
      return false;
    }

    return true;
  }*/

  _onNavigateRequest() {

  }

  render() {

    //let computeEntities = new List();
    //let computePortal = new Map([['id', '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect'], ['entity', this.props.computePortal]]);

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pathOrId,
      'entity': this.props.computeWord
    }])


    /*let portalOperation = ProviderHelpers.getEntry(computePortal, '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect');
    console.log(portalOperation);
    

    if (!portalOperation || portalOperation.isFetching) {
      return <div><CircularProgress mode="indeterminate" size={5} /> {selectn('message', portalOperation)}</div>;
    }

    if (portalOperation.isError) {
      return <div>{portalOperation.message}</div>
    }

    let portalResponse = selectn('response', portalOperation);*/

    return <div className="row">
            <pre>
              <PromiseWrapper computeEntities={computeEntities}>
                {JSON.stringify(this.props.computeWord, null, '\t')}
              </PromiseWrapper>
            </pre>
          </div>;
  }
}