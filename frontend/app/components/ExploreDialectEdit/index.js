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
import Immutable, { is } from 'immutable'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchPortal } from 'reducers/fvPortal'
import { replaceWindowPath } from 'reducers/windowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import withForm from 'components/withForm'
const EditViewWithForm = withForm(PromiseWrapper, true)

import './ExploreDialectEdit.css'

const { array, func, object } = PropTypes
export class ExploreDialectEdit extends Component {
  static propTypes = {
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeDialect2: object.isRequired,
    computePortal: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    componentState: STATE_LOADING,
    is403: false,
  }
  // Fetch data on initial render
  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "ExploreDialectEditCopy" */ './copy').then((_module) => {
      return _module.default
    })
    this.fetchData({ copy })
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (this.props.routeParams.dialect_path !== prevProps.routeParams.dialect_path) {
      this.fetchData()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { componentState: nextComponentState, errorMessage: nextErrorMessage } = nextState
    const { componentState: thisComponentState, errorMessage: thisErrorMessage } = this.state

    if (thisComponentState !== nextComponentState || thisErrorMessage !== nextErrorMessage) {
      return true
    }
    if (is(nextProps.computePortal, this.props.computePortal) === false) {
      return true
    }
    return false
  }

  render() {
    const content = this._getContent()
    return content
  }

  fetchData = async (addToState = {}) => {
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    if (_computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
        errorMessage: _computeDialect2.message,
        ...addToState,
      })
      return
    }

    await this.props.fetchPortal(this.props.routeParams.dialect_path + '/Portal')
    const _computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      `${this.props.routeParams.dialect_path}/Portal`
    )
    if (_computePortal.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: _computePortal.message,
        ...addToState,
      })
      return
    }
    this.setState({
      componentState: STATE_DEFAULT,
      errorMessage: undefined,
      ...addToState,
    })
  }

  _getContent = () => {
    let content = null
    switch (this.state.componentState) {
      case STATE_LOADING: {
        content = this._stateGetLoading()
        break
      }

      case STATE_DEFAULT: {
        content = this._stateGetDefault()
        break
      }
      case STATE_ERROR_BOUNDARY: {
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        content = this._stateGetLoading()
    }
    return content
  }

  _handleCancel = () => {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }
  _stateGetDefault = () => {
    const portalPath = `${this.props.routeParams.dialect_path}/Portal`

    const computeEntities = Immutable.fromJS([
      {
        id: portalPath,
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, portalPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    let context = {}
    let initialValues = {}

    // Set initial values
    if (selectn('response', computeDialect2) && selectn('response', computePortal)) {
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: { parentId: selectn('response.uid', computePortal) },
      })
      const dialectProperties = selectn('response.properties', computeDialect2)
      const portalProperties = selectn('response.properties', computePortal)

      initialValues = {
        'fvdialect:greeting': dialectProperties['fvdialect:greeting'] || portalProperties['fv-portal:greeting'] || null,
        'fvdialect:featured_audio':
          dialectProperties['fvdialect:featured_audio'] || portalProperties['fv-portal:featured_audio'] || null,
        'fvdialect:about_us': dialectProperties['fvdialect:about_us'] || portalProperties['fv-portal:about'] || null,
        'fvdialect:news': dialectProperties['fvdialect:news'] || portalProperties['fv-portal:news'] || null,
        'fvdialect:background_top_image':
          dialectProperties['fvdialect:background_top_image'] ||
          portalProperties['fv-portal:background_top_image'] ||
          null,
        'fvdialect:logo': dialectProperties['fvdialect:logo'] || portalProperties['fv-portal:logo'] || null,
        'fvdialect:featured_words': dialectProperties['fvdialect:featured_words']?.length
          ? dialectProperties['fvdialect:featured_words']
          : portalProperties['fv-portal:featured_words'] || [],
        'fvdialect:related_links': dialectProperties['fvdialect:related_links']?.length
          ? dialectProperties['fvdialect:related_links']
          : portalProperties['fv-portal:related_links'] || [],
        'fvdialect:about_our_language':
          dialectProperties['fvdialect:about_our_language'] || dialectProperties['dc:description'] || null,
        'fvdialect:country': dialectProperties['fvdialect:country'] || null,
        'fvdialect:dominant_language': dialectProperties['fvdialect:dominant_language'] || null,
        'fvdialect:region': dialectProperties['fvdialect:region'] || null,
        'fvdialect:keyboards': dialectProperties['fvdialect:keyboards'] || [],
        'fvdialect:language_resources': dialectProperties['fvdialect:language_resources'] || [],
        'fvdialect:contact_information': dialectProperties['fvdialect:contact_information'] || null,
      }
    }
    return (
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper computeEntities={computeEntities}>
          <div className="ExploreDialectEdit">
            <h1 className="ExploreDialectEdit__heading">
              {'Edit ' + selectn('response.title', computeDialect2) + ' Site'}
            </h1>

            <EditViewWithForm
              computeEntities={computeEntities}
              computeDialect={computeDialect2}
              context={context}
              initialValues={initialValues}
              itemId={this.props.routeParams.dialect_path}
              fields={fields}
              options={options}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.replaceWindowPath}
              type="FVDialect"
              routeParams={this.props.routeParams}
            />
          </div>
        </PromiseWrapper>
      </AuthenticationFilter.Container>
    )
  }
  _stateGetErrorBoundary = () => {
    const { copy, errorMessage } = this.state
    return <StateErrorBoundary copy={copy} errorMessage={errorMessage} />
  }
  _stateGetLoading = () => {
    return <StateLoading copy={this.state.copy} />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPortal, navigation, windowPath } = state

  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { route } = navigation
  const { splitWindowPath } = windowPath

  return {
    computeDialect2,
    computePortal,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDialectEdit)
