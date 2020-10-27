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
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchPhrase, updatePhrase } from 'reducers/fvPhrase'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { getSearchObject } from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'

import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'

// Models
import { Document } from 'nuxeo'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import withForm from 'components/withForm'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'
import '!style-loader!css-loader!./PhrasesEdit.css'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object, string } = PropTypes
export class PhrasesEdit extends Component {
  static propTypes = {
    phrase: object,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePhrase: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPhrase: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updatePhrase: func.isRequired,
  }
  state = {
    formValue: null,
    componentState: STATE_LOADING,
    is403: false,
  }

  // Fetch data on initial render
  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "PhrasesEditCopy" */ './copy').then((_module) => {
      return _module.default
    })
    const { redirect } = getSearchObject()
    this.fetchData({ copy, redirect: redirect ? decodeURIComponent(redirect) : undefined })
  }

  componentDidUpdate(prevProps) {
    const phrase = selectn('response', ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath()))
    const title = selectn('properties.dc:title', phrase)
    const uid = selectn('uid', phrase)

    if (title && selectn('pageTitleParams.phrase', this.props.properties) != title) {
      this.props.changeTitleParams({ phrase: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.phrase' })
    }

    // NOTE: Code below was originally from `componentWillReceiveProps()` with some edits to match componentDidUpdate args:
    let previousPhrase
    let currentPhrase

    if (this._getPhrasePath() !== null) {
      previousPhrase = ProviderHelpers.getEntry(prevProps.computePhrase, this._getPhrasePath())
      currentPhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', previousPhrase) != selectn('wasUpdated', currentPhrase) &&
      selectn('wasUpdated', currentPhrase) === true
    ) {
      if (this.state.redirect) {
        NavigationHelpers.navigate(this.state.redirect, this.props.pushWindowPath, false)
      } else {
        NavigationHelpers.navigate(
          NavigationHelpers.generateUIDPath(
            this.props.routeParams.siteTheme,
            selectn('response', currentPhrase),
            'phrases'
          ),
          this.props.replaceWindowPath,
          true
        )
      }
    }
  }
  shouldComponentUpdate(newProps, newState) {
    switch (true) {
      case this.state.componentState != newState.componentState:
        return true
      case newProps.windowPath != this.props.windowPath:
        return true

      case is(newProps.computeDialect2, this.props.computeDialect2) === false:
        return true

      case is(newProps.computePhrase, this.props.computePhrase) === false:
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
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
        errorMessage: _computeDialect2.message,
        ...addToState,
      })
      return
    }

    await this.props.fetchPhrase(this._getPhrasePath())
    const _computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    if (_computePhrase.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: _computeDialect2.message,
        ...addToState,
      })
      return
    }

    // All good
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

  _getPhrasePath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.phrase)) {
      return _props.routeParams.phrase
    }
    return _props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(_props.routeParams.phrase)
  }

  _handleSave = (phrase, formValue) => {
    const newDocument = new Document(phrase.response, {
      repository: phrase.response._repository,
      nuxeo: phrase.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updatePhrase(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel = () => {
    if (this.state.redirect) {
      NavigationHelpers.navigate(this.state.redirect, this.props.pushWindowPath, false)
    } else {
      NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
    }
  }
  _stateGetDefault = () => {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getPhrasePath(),
        entity: this.props.computePhrase,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computePhrase)) {
      const providedFilter =
        selectn('response.properties.fv-phrase:definitions[0].translation', computePhrase) ||
        selectn('response.properties.fv:literal_translation[0].translation', computePhrase)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computePhrase),
          providedFilter: providedFilter,
        },
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
        <div>
          <h1>
            <FVLabel
              transKey="views.pages.explore.dialect.phrases.edit_x_phrase"
              defaultStr={'Edit ' + selectn('response.properties.dc:title', computePhrase) + ' phrase'}
              transform="first"
              params={[selectn('response.properties.dc:title', computePhrase)]}
            />
          </h1>

          <EditViewWithForm
            computeEntities={computeEntities}
            initialValues={context}
            itemId={this._getPhrasePath()}
            fields={fields}
            options={options}
            saveMethod={this._handleSave}
            cancelMethod={this._handleCancel}
            currentPath={this.props.splitWindowPath}
            navigationMethod={this.props.replaceWindowPath}
            type="FVPhrase"
            routeParams={this.props.routeParams}
          />
        </div>
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
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath } = state

  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { _windowPath, splitWindowPath } = windowPath
  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeDialect2,
    computePhrase,
    computeLogin,
    routeParams: route.routeParams,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchDialect2,
  fetchPhrase,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  updatePhrase,
}

export default connect(mapStateToProps, mapDispatchToProps)(PhrasesEdit)
