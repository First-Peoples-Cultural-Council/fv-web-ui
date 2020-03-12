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

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchGalleries } from 'providers/redux/reducers/fvGallery'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import FVButton from 'views/components/FVButton'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import GeneralList from 'views/components/Browsing/general-list'
import withFilter from 'views/hoc/grid-list/with-filter'
import FVLabel from 'views/components/FVLabel/index'

const DEFAULT_LANGUAGE = 'english'

const FilteredList = withFilter(GeneralList)

/**
 * Learn songs
 */

const { array, func, object, string } = PropTypes
export class PageDialectGalleries extends Component {
  static propTypes = {
    typeFilter: string,
    typePlural: string,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeGalleries: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchGalleries: func.isRequired,
    fetchPortal: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  state = {
    filteredList: null,
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  async componentDidUpdate(prevProps) {
    if (this.props.windowPath !== prevProps.windowPath) {
      await this.fetchData(this.props)
    }
  }

  render() {
    const path = `${this.props.routeParams.dialect_path}/Portal`
    const computeEntities = Immutable.fromJS([
      {
        id: path,
        entity: this.props.computePortal,
      },
      {
        id: path,
        entity: this.props.computeGalleries,
      },
    ])

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const computeGalleries = ProviderHelpers.getEntry(this.props.computeGalleries, path)

    const isKidsTheme = this.props.routeParams.siteTheme === 'kids'

    const listProps = {
      defaultLanguage: DEFAULT_LANGUAGE,
      fixedList: true,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      contextParamsKey: 'gallery',
      area: this.props.routeParams.area,
      metadata: selectn('response', computeGalleries),
      items: selectn('response.entries', computeGalleries) || [],
      action: this._onItemNavigateRequest,
    }

    let listView = <FilteredList {...listProps} />

    if (isKidsTheme) {
      listView = <GeneralList {...listProps} cols={3} siteTheme={this.props.routeParams.siteTheme} />
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper', { hidden: isKidsTheme })}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              hideFromSections
              routeParams={this.props.routeParams}
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computeDialect2),
                login: this.props.computeLogin,
              }}
            >
              <FVButton
                variant="contained"
                className="PrintHide"
                onClick={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')}
                color="primary"
              >
                {'Create Gallery'}
              </FVButton>
            </AuthorizationFilter>
          </div>

          <div className="col-xs-12">
            <h1>
              <FVLabel
                transKey="views.pages.explore.dialect.gallery.x_galleries"
                defaultStr={selectn('response.title', computeDialect2) + ' Galleries'}
                transform="first"
                params={[selectn('response.title', computeDialect2)]}
              />
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className="row" style={{ marginBottom: '20px' }}>
              <div
                className={classNames('col-xs-12', {
                  'col-xs-8': isKidsTheme,
                  'col-xs-offset-2': isKidsTheme,
                })}
              >
                {listView}
              </div>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  fetchData = (newProps) => {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)

    const path = `${newProps.routeParams.dialect_path}/Portal`
    newProps.fetchPortal(path)
    newProps.fetchGalleries(path)
  }

  fixedListFetcher = (list) => {
    this.setState({
      filteredList: list,
    })
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }

  _onItemNavigateRequest = (item) => {
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme || 'explore', item, 'gallery')
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPortal, fvGallery, navigation, nuxeo, windowPath } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { computeGalleries } = fvGallery
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeGalleries,
    computeLogin,
    computePortal,
    properties,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchGalleries,
  fetchPortal,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectGalleries)
