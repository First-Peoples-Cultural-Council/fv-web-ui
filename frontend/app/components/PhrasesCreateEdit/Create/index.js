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
import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createPhrase } from 'reducers/fvPhrase'
import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'
import '!style-loader!css-loader!./PhrasesCreate.css'

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
    is403: false,
  }

  formPhraseCreate = React.createRef()

  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "PhrasesCreateCopy" */ './copy').then((_module) => {
      return _module.default
    })
    // const ErrorBoundary = await import(/* webpackChunkName: "ErrorBoundary" */ 'components/ErrorBoundary').then(
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
        NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, selectn('response', nextPhrase), 'phrases'),
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

  fetchData = async (addToState = {}) => {
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)

    // Call fetchDialect2 if not already called:
    // 1) At `.../learn/words/create` fetchDialect2 has been called by the parent component `PageDialectWordsCreate`
    // 2) At `.../learn/phrases/create` PhrasesCreate is on a stand alone page and fetchDialect2 has not been called
    // NOTE: For an unknown reason if fetchDialect2 is called w/#1 it triggers issue FW-373
    if (ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path) === null) {
      await this.props.fetchDialect2(this.props.routeParams.dialect_path)
      const computingDialect2 = ProviderHelpers.getEntry(
        this.props.computeDialect2,
        this.props.routeParams.dialect_path
      )
      if (computingDialect2.isError) {
        this.setState({
          componentState: STATE_DEFAULT,
          // Note: Intentional == comparison
          is403: computingDialect2.message == '403',
          errorMessage: computingDialect2.message,
          ...addToState,
        })
        return
      }
    }

    this.setState({
      componentState: STATE_DEFAULT,
      ...addToState,
    })
  }

  _getContent = () => {
    let content = null
    if (this.state.componentState === STATE_DEFAULT) {
      content = this._stateGetDefault()
    } else {
      content = this._stateGetLoading()
    }
    return content
  }
  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formPhraseCreate.current.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (key && Object.prototype.hasOwnProperty.call(formValue, key)) {
        if (formValue[key] && formValue[key] !== '') {
          // Filter out null values in an array
          if (formValue[key] instanceof Array) {
            const formValueKey = formValue[key].filter((item) => item !== null)
            properties[key] = formValueKey
          } else {
            //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
            properties[key] = formValue[key]
          }
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
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper computeEntities={computeEntities}>
          <h1 className="PhrasesCreate__heading">
            <FVLabel
              transKey=""
              defaultStr={'Add New Phrase to ' + selectn('response.title', computeDialect2)}
              params={[selectn('response.title', computeDialect2)]}
            />
          </h1>

          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form data-testid="PhrasesCreate__form" onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref={this.formPhraseCreate}
                  type={t.struct(selectn('FVPhrase', fields))}
                  context={selectn('response', computeDialect2)}
                  value={this.state.formValue}
                  options={FVPhraseOptions}
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    <FVLabel transKey="save" defaultStr="Save" transform="first" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PromiseWrapper>
      </AuthenticationFilter.Container>
    )
  }
  _stateGetLoading = () => {
    return <StateLoading />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, windowPath } = state

  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(PhrasesCreate)
