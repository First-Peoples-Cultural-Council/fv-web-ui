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
import { fetchLanguages } from 'providers/redux/reducers/fvLanguage'
import { fetchLanguageFamily } from 'providers/redux/reducers/fvLanguageFamily'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import PortalList from 'views/components/Browsing/portal-list'
import FVLabel from 'views/components/FVLabel/index'

import withFilter from 'views/hoc/grid-list/with-filter'

const FilteredPortalList = withFilter(PortalList)

/**
 * Explore Archive page shows all the families in the archive
 */

const { array, func, object, string } = PropTypes
export class ExploreFamily extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeLanguages: object.isRequired,
    computeLanguageFamily: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchLanguages: func.isRequired,
    fetchLanguageFamily: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
    }
    ;['_onNavigateRequest', 'fixedListFetcher'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchLanguageFamily(newProps.routeParams.language_family_path)
    newProps.fetchLanguages(newProps.routeParams.language_family_path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.language_family_path != this.props.routeParams.language_family_path) {
      this.fetchData(nextProps)
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath('/explore' + path)
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list,
    })
  }

  render() {
    const pathOrId = this.props.routeParams.language_family_path

    const computeEntities = Immutable.fromJS([
      {
        id: pathOrId,
        entity: this.props.computeLanguages,
      },
      {
        id: pathOrId,
        entity: this.props.computeLanguageFamily,
      },
    ])

    const computeLanguages = ProviderHelpers.getEntry(this.props.computeLanguages, pathOrId)
    const computeLanguageFamily = ProviderHelpers.getEntry(this.props.computeLanguageFamily, pathOrId)

    const portalListProps = {
      action: this._onNavigateRequest,
      filterOptionsKey: 'Default',
      fixedList: true,
      area: this.props.routeParams.area,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      metadata: selectn('response', computeLanguages),
      items: selectn('response.entries', computeLanguages) || [],
    }

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        <div className="row">
          <div className="col-xs-12">
            <h1>
              {selectn('response.properties.dc:title', computeLanguageFamily)} &raquo;{' '}
              <FVLabel
                transKey="languages"
                defaultStr="Languages"
                transform="words"
              />
            </h1>
            <FilteredPortalList {...portalListProps} />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvLanguage, fvLanguageFamily, navigation, windowPath } = state

  const { properties } = navigation
  const { computeLanguages } = fvLanguage
  const { computeLanguageFamily } = fvLanguageFamily
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeLanguages,
    computeLanguageFamily,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchLanguages,
  fetchLanguageFamily,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreFamily)
