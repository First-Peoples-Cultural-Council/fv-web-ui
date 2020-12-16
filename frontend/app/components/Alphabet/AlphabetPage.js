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
import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2, updateDialect2 } from 'reducers/fvDialect'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'

import PromiseWrapper from 'components/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
import PageDialectLearnBase from 'components/LearnBase'
import Header from 'components/Header'
import ToolbarNavigation from 'components/LearnBase/toolbar-navigation'
import AlphabetContainer from 'components/Alphabet/AlphabetContainer'

const { bool, func, object } = PropTypes
/**
 * Learn alphabet
 */

export class PageDialectLearnAlphabet extends PageDialectLearnBase {
  static defaultProps = {
    print: false,
  }

  static propTypes = {
    routeParams: object.isRequired,
    print: bool,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computePortal: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    updateDialect2: func.isRequired,
    updatePortal: func.isRequired,
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this.props.routeParams.dialect_path + '/Portal',
        entity: this.props.computePortal,
      },
    ])
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const _computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    return (
      <PromiseWrapper computeEntities={computeEntities}>
        {this.props.print ? null : (
          <Header
            portal={{ compute: _computePortal, update: this.props.updatePortal }}
            dialect={{ compute: _computeDialect2, update: this.props.updateDialect2 }}
            routeParams={this.props.routeParams}
          >
            <ToolbarNavigation hideStatistics />
          </Header>
        )}
        <AlphabetContainer
          dialect={{ compute: _computeDialect2, update: this.props.updateDialect2 }}
          isPrint={this.props.print}
        />
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPortal } = state
  const { computePortal } = fvPortal
  const { computeDialect2 } = fvDialect

  return {
    computeDialect2,
    computePortal,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  updateDialect2,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectLearnAlphabet)
