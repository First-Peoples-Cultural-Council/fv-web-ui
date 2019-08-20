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
import classNames from 'classnames'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createPhrase } from 'providers/redux/reducers/fvPhrase'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import '!style-loader!css-loader!./PhrasesCreate.css'

const intl = IntlService.instance
/**
 * Create phrase entry
 */

const { bool, array, func, object, string } = PropTypes
export class PhrasesCreate extends Component {
  static propTypes = {
    embedded: bool,
    onDocumentCreated: func,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeDialect2: object.isRequired,
    computePhrase: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createPhrase: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  static defaultProps = {
    embedded: false,
  }
  state = {
    formValue: null,
    dialectPath: null,
    phrasePath: null,
    componentState: STATE_LOADING,
    ErrorBoundary: null,
    copy: {},
  }

  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "PhrasesCreateInternationalization" */ './internationalization').then(
      (_module) => {
        return _module.default
      }
    )
    // const ErrorBoundary = await import(/* webpackChunkName: "ErrorBoundary" */ 'views/components/ErrorBoundary').then(
    //   (_module) => {
    //     return _module.default
    //   }
    // )
    this.fetchData({ copy })
  }

  componentDidUpdate(prevProps) {
    let currentPhrase
    let nextPhrase

    if (this.state.phrasePath !== null) {
      currentPhrase = ProviderHelpers.getEntry(prevProps.computePhrase, this.state.phrasePath)
      nextPhrase = ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath)
    }

    if (prevProps.onDocumentCreated && this.state.phrasePath && selectn('success', nextPhrase)) {
      prevProps.onDocumentCreated(ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath).response)
    }

    if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData(this.props)
    }

    // 'Redirect' on success
    if (
      !prevProps.embedded &&
      selectn('success', currentPhrase) != selectn('success', nextPhrase) &&
      selectn('success', nextPhrase) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.theme, selectn('response', nextPhrase), 'phrases'),
        this.props.replaceWindowPath,
        true
      )
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

  fetchData = async(addToState = {}) => {
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)

    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    if (_computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: _computeDialect2.message,
        ...addToState,
      })
      return
    }

    this.setState({
      componentState: STATE_DEFAULT,
      ...addToState,
    })
  }

  _getContent = () => {
    let content = null
    switch (this.state.componentState) {
      case STATE_DEFAULT: {
        content = this._stateGetDefault()
        break
      }
      default:
        content = this._stateGetLoading()
    }
    return content
  }
  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()

    // TODO: this.refs DEPRECATED
    const formValue = this.refs.form_phrase_create.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Passed validation
    if (formValue) {
      const now = Date.now()
      this.props.createPhrase(
        this.props.routeParams.dialect_path + '/Dictionary',
        {
          type: 'FVPhrase',
          name: now.toString(),
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        phrasePath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      if (!this.props.embedded) window.scrollTo(0, 0)
    }
  }
  _stateGetDefault = () => {
    const FVPhraseOptions = Object.assign({}, selectn('FVPhrase', options))

    // const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    if (
      selectn('fields.fv:definitions.item.fields.language.attrs', FVPhraseOptions) &&
      selectn('response.properties.fvdialect:dominant_language', computeDialect2)
    ) {
      FVPhraseOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
        'response.properties.fvdialect:dominant_language',
        computeDialect2
      )
    }

    const computeEntities = Immutable.fromJS([
      // {
      //   id: this.state.phrasePath,
      //   entity: this.props.computePhrase,
      // },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])
    return (
      <AuthenticationFilter
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper computeEntities={computeEntities}>
          <h1 className="PhrasesCreate__heading">
            {intl.trans('', 'Add New Phrase to ' + selectn('response.title', computeDialect2), null, [
              selectn('response.title', computeDialect2),
            ])}
          </h1>

          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref="form_phrase_create" // TODO: DEPRECATED
                  type={t.struct(selectn('FVPhrase', fields))}
                  context={selectn('response', computeDialect2)}
                  value={this.state.formValue}
                  options={FVPhraseOptions}
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    {intl.trans('save', 'Save', 'first')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PromiseWrapper>
      </AuthenticationFilter>
    )
  }
  _stateGetLoading = () => {
    return <StateLoading />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath } = state

  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeLogin,
    computeDialect2,
    computePhrase,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createPhrase,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhrasesCreate)
