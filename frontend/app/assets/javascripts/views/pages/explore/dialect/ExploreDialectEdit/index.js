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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPortal, updatePortal } from 'providers/redux/reducers/fvPortal'
import { replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import StateLoading from './states/loading'
import StateErrorBoundary from './states/errorBoundary'

// Models
import { Document } from 'nuxeo'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'
import IntlService from 'views/services/intl'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import '!style-loader!css-loader!./ExploreDialectEdit.css'

const intl = IntlService.instance
const EditViewWithForm = withForm(PromiseWrapper, true)

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
    updatePortal: func.isRequired,
  }
  state = {
    componentState: STATE_LOADING,
  }
  initialStateCopy = {
    errorBoundary: {},
    loading: '',
  }
  // Fetch data on initial render
  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "ExploreDialectEditInternationalization" */ './internationalization').then(
      (_module) => {
        return _module.default
      }
    )
    this.fetchData({ copy })
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (this.props.routeParams.dialect_path !== prevProps.routeParams.dialect_path) {
      this.fetchData()
    }
  }

  shouldComponentUpdate(newProps) {
    const portalPath = `${this.props.routeParams.dialect_path}/Portal`

    switch (true) {
      case newProps.routeParams.dialect_path !== this.props.routeParams.dialect_path:
        return true

      case ProviderHelpers.getEntry(newProps.computePortal, portalPath) !=
        ProviderHelpers.getEntry(this.props.computePortal, portalPath):
        return true

      case ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) !=
        ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path):
        return true

      default:
        return false
    }
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
        componentState: STATE_ERROR_BOUNDARY,
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
        componentState: STATE_ERROR_BOUNDARY,
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
      <div className="ExploreDialectEdit">
        <h1 className="ExploreDialectEdit__heading">
          {intl.trans(
            'views.pages.explore.dialect.edit_x_community_portal',
            'Edit ' + selectn('response.title', computeDialect2) + ' Community Portal',
            null,
            [selectn('response.title', computeDialect2)]
          )}
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
  updatePortal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreDialectEdit)
