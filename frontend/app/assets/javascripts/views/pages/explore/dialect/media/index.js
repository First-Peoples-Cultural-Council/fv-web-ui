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
import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'

import classNames from 'classnames'
import provide from 'react-redux-provide'
import ConfGlobal from 'conf/local.json'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import Header from 'views/pages/explore/dialect/header'
import PageHeader from 'views/pages/explore/dialect/page-header'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import SearchBar from 'views/pages/explore/dialect/search-bar'

import Paper from 'material-ui/lib/paper'
import RaisedButton from 'material-ui/lib/raised-button'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import FlatButton from 'material-ui/lib/flat-button'
import CircularProgress from 'material-ui/lib/circular-progress'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import IconButton from 'material-ui/lib/icon-button'
import MenuItem from 'material-ui/lib/menus/menu-item'
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import EditableComponent, { EditableComponentHelper } from 'views/components/Editor/EditableComponent'

import Statistics from 'views/components/Dashboard/Statistics'
import RecentActivityList from 'views/components/Dashboard/RecentActivityList'
import Link from 'views/components/Document/Link'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import MediaList from 'views/components/Browsing/media-list'
import withPagination from 'views/hoc/grid-list/with-pagination'
import withFilter from 'views/hoc/grid-list/with-filter'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const gridListStyle = { width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10 }

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 20, filters: { 'properties.dc:title': '', dialect: '' } }

/**
 * Browse media related to this dialect
 */
@provide
export default class DialectMedia extends Component {
  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    computeResources: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      fetcherParams: DefaultFetcherParams,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', 'fetchData'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _onNavigateRequest(media) {
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(this.props.routeParams.theme || 'explore', media, 'media')
    )
  }

  fetchData(fetcherParams, props = this.props) {
    this.setState({
      fetcherParams: fetcherParams,
    })

    props.fetchResources(
      props.routeParams.dialect_path + '/Resources',
      ProviderHelpers.filtersToNXQL(fetcherParams.filters) +
        '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize
    )
  }

  // Fetch data on initial render
  componentDidMount() {
    this.props.fetchPortal(this.props.routeParams.dialect_path + '/Portal')
    this.fetchData(this.state.fetcherParams)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      nextProps.fetchPortal(nextProps.routeParams.dialect_path + '/Portal')
      this.fetchData(DefaultFetcherParams, nextProps)
    }
  }
  render() {
    const FilteredPaginatedMediaList = withFilter(
      withPagination(MediaList, DefaultFetcherParams.pageSize),
      DefaultFetcherParams
    )
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path + '/Resources',
        entity: this.props.computeResources,
      },
    ])

    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )
    const computeResources = ProviderHelpers.getEntry(
      this.props.computeResources,
      this.props.routeParams.dialect_path + '/Resources'
    )

    return (
      <PromiseWrapper hideFetch computeEntities={computeEntities}>
        <h1>
          {selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)}{' '}
          {intl.trans('media', 'Media', 'first')}
        </h1>

        <hr />

        <div className="row">
          <div className="col-xs-12">
            <FilteredPaginatedMediaList
              cols={5}
              cellHeight={150}
              initialValues={{ 'dc:contributors': selectn('response.properties.username', this.props.computeLogin) }}
              filterOptionsKey="Resources"
              action={this._onNavigateRequest}
              fetcher={this.fetchData}
              theme={this.props.routeParams.theme}
              area={this.props.routeParams.area}
              fetcherParams={this.state.fetcherParams}
              metadata={selectn('response', computeResources) || selectn('response_prev', computeResources)}
              items={
                selectn('response.entries', computeResources) || selectn('response_prev.entries', computeResources)
              }
            />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}
