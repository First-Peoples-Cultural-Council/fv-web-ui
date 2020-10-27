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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchPortal, updatePortal } from 'reducers/fvPortal'
import { replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'

import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'

// Models
import { Document } from 'nuxeo'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import withForm from 'components/withForm'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import '!style-loader!css-loader!./ExploreDialectEdit.css'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class ExploreDialectEdit extends Component {
  static propTypes = {
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeDialect2: object.isRequired,
    computePortal: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    replaceWindowPath: func.isRequired,
    updatePortal: func.isRequired,
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

  _handleSave = (portal, formValue) => {
    // TODO: Find better way to construct object then accessing internal function
    const portalDoc = new Document(portal.response, {
      repository: portal.response._repository,
      nuxeo: portal.response._nuxeo,
    })

    // Set new value property on document
    portalDoc.set(formValue)

    // Save document
    this.props.updatePortal(portalDoc, null, null)
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

    let initialValues = {}

    // Set initial values
    if (selectn('response', computeDialect2) && selectn('response', computePortal)) {
      initialValues = Object.assign(selectn('response', computeDialect2), {
        initialValues: selectn('response.properties', computePortal),
      })
    }
    return (
      <AuthenticationFilter
        is403={this.state.is403}
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper
          computeEntities={Immutable.fromJS([
            {
              id: this.props.routeParams.dialect_path,
              entity: this.props.fetchDialect2,
            },
            {
              id: `${this.props.routeParams.dialect_path}/Portal`,
              entity: this.props.fetchPortal,
            },
          ])}
        >
          <div className="ExploreDialectEdit">
            <h1 className="ExploreDialectEdit__heading">
              <FVLabel
                transKey="views.pages.explore.dialect.edit_x_community_portal"
                defaultStr={'Edit ' + selectn('response.title', computeDialect2) + ' Community Portal'}
                params={[selectn('response.title', computeDialect2)]}
              />
            </h1>

            <EditViewWithForm
              computeEntities={computeEntities}
              initialValues={initialValues}
              itemId={portalPath}
              fields={fields}
              options={options}
              saveMethod={this._handleSave}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.replaceWindowPath}
              type="FVPortal"
              routeParams={this.props.routeParams}
            />
          </div>
        </PromiseWrapper>
      </AuthenticationFilter>
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
  const { fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { route } = navigation
  const { splitWindowPath } = windowPath
  const { computeLogin } = nuxeo

  return {
    computeDialect2,
    computePortal,
    computeLogin,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchPortal,
  replaceWindowPath,
  updatePortal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreDialectEdit)
