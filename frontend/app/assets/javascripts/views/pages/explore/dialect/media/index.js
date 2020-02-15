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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchResources } from 'providers/redux/reducers/fvResources'
import { navigateTo } from 'providers/redux/reducers/navigation'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { routeHasChanged } from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import MediaList from 'views/components/Browsing/media-list'
import withPagination from 'views/hoc/grid-list/with-pagination'
import withFilter from 'views/hoc/grid-list/with-filter'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

const DefaultFetcherParams = { currentPageIndex: 1, pageSize: 20, filters: { 'properties.dc:title': '', dialect: '' } }

/**
 * Browse media related to this dialect
 */

const { array, func, object, string } = PropTypes
export class DialectMedia extends Component {
  static propTypes = {
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    computeResources: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchPortal: func.isRequired,
    fetchResources: func.isRequired,
    navigateTo: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      fetcherParams: DefaultFetcherParams,
      formValues: {},
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.props.fetchPortal(`${this.props.routeParams.dialect_path}/Portal`)
    this.fetchData(this.state.fetcherParams)
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.props.fetchPortal(`${this.props.routeParams.dialect_path}/Portal`)
      this.fetchData(DefaultFetcherParams, this.props)
    }
  }
  render() {
    const FilteredPaginatedMediaList = withFilter(
      withPagination(MediaList, DefaultFetcherParams.pageSize),
      DefaultFetcherParams
    )
    const computeEntities = Immutable.fromJS([
      {
        id: `${this.props.routeParams.dialect_path}/Portal`,
        entity: this.props.computePortal,
      },
      {
        id: `${this.props.routeParams.dialect_path}/Resources`,
        entity: this.props.computeResources,
      },
    ])

    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      `${this.props.routeParams.dialect_path}/Portal`
    )
    const computeResources = ProviderHelpers.getEntry(
      this.props.computeResources,
      `${this.props.routeParams.dialect_path}/Resources`
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
              // media-list
              isFetching={selectn('isFetching', computeResources)}
              action={this._onNavigateRequest}
              cellHeight={150}
              cols={5}
              items={
                selectn('response.entries', computeResources) || selectn('response_prev.entries', computeResources)
              }
              siteTheme={this.props.routeParams.siteTheme}
              formValues={this.state.formValues}
              // For `with-filter`
              area={this.props.routeParams.area}
              filterOptionsKey="Resources"
              // For `with-filter` & `with-pagination`
              fetcher={this.fetchData}
              fetcherParams={this.state.fetcherParams}
              metadata={selectn('response', computeResources) || selectn('response_prev', computeResources)}
              // Note: initialValues becomes locals.context in .../views/components/Editor/fields/valued-checkbox.js
              // via withFilter: <t.form.Form context={this.props.initialValues}
              initialValues={{
                'dc:contributors': selectn('response.properties.username', this.props.computeLogin),
              }}
            />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  _convertFetcherParamsToFormValues = (filters) => {
    const toReturn = {}
    for (const key in filters) {
      toReturn[key] = filters[key].appliedFilter
    }
    return toReturn
  }
  _onNavigateRequest = (media) => {
    // V1
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme || 'explore', media, 'media')
    )
    // V2 - still reloads after page transition for some reason
    // const hrefPath = NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme || 'explore', media, 'media')
    // NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
  }

  fetchData = (fetcherParams) => {
    this.setState({
      fetcherParams: fetcherParams,
      formValues: this._convertFetcherParamsToFormValues(fetcherParams.filters),
    })
    // NOTE: fetchResources(pathOrId, queryAppend, messageStart, messageSuccess, messageError)
    this.props.fetchResources(
      `${this.props.routeParams.dialect_path}/Resources`,
      ProviderHelpers.filtersToNXQL(fetcherParams.filters) +
        '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, fvResources, navigation, nuxeo, windowPath } = state

  const { route } = navigation
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { computeResources } = fvResources
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeLogin,
    computePortal,
    computeResources,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
  navigateTo,
  pushWindowPath,
  fetchPortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectMedia)
