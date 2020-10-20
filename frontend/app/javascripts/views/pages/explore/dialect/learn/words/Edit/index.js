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
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchWord, updateWord } from 'providers/redux/reducers/fvWord'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { getSearchObject } from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import FVLabel from 'views/components/FVLabel/index'
import '!style-loader!css-loader!./WordsEdit.css'

// Models
import { Document } from 'nuxeo'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class WordsEdit extends Component {
  static propTypes = {
    word: object,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeWord: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchWord: func.isRequired,
    pushWindowPath: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateWord: func.isRequired,
  }

  state = {
    formValue: null,
    componentState: STATE_LOADING,
    copy: {},
    is403: false,
  }

  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "WordsEditInternationalization" */ './internationalization').then(
      (_module) => {
        return _module.default
      }
    )
    const { redirect } = getSearchObject()
    this.fetchData({ copy, redirect: redirect ? decodeURIComponent(redirect) : undefined })
  }

  shouldComponentUpdate(newProps, newState) {
    const previousWord = this.props.computeWord
    const nextWord = newProps.computeWord

    // const previousDialect = this.props.computeDialect2
    // const nextDialect = newProps.computeDialect2
    switch (true) {
      case newProps.routeParams.word != this.props.routeParams.word:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextWord.equals === 'function' && nextWord.equals(previousWord) === false:
        return true

      // case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
      //   console.log(4)
      //   return true

      case this.state.componentState != newState.componentState:
        return true

      case newProps.windowPath != this.props.windowPath:
        return true

      // case is(newProps.computeDialect2, this.props.computeDialect2) === false:
      //   console.log(7)
      //   return true

      case is(newProps.computeWord, this.props.computeWord) === false:
        return true

      default:
        return false
    }
  }

  componentDidUpdate(prevProps) {
    const word = selectn('response', ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath()))
    const title = selectn('properties.dc:title', word)
    const uid = selectn('uid', word)

    if (title && selectn('pageTitleParams.word', this.props.properties) !== title) {
      this.props.changeTitleParams({ word: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.word' })
    }

    // NOTE: Code below was originally from `componentWillReceiveProps()` with some edits to match componentDidUpdate args:
    let prevWord
    let currentWord

    if (this._getWordPath() !== null) {
      prevWord = ProviderHelpers.getEntry(prevProps.computeWord, this._getWordPath())
      currentWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', prevWord) != selectn('wasUpdated', currentWord) &&
      selectn('wasUpdated', currentWord) === true
    ) {
      if (this.state.redirect) {
        NavigationHelpers.navigate(this.state.redirect, this.props.pushWindowPath, false)
      } else {
        NavigationHelpers.navigate(
          NavigationHelpers.generateUIDPath(
            this.props.routeParams.siteTheme,
            selectn('response', currentWord),
            'words'
          ),
          this.props.replaceWindowPath,
          true
        )
      }
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
    await this.props.fetchWord(this._getWordPath())
    const _computeWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath())

    if (_computeWord.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: _computeWord.message,
        ...addToState,
      })
      return
    }

    // All good...
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
        content = this._stateGetEdit()
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
  _getWordPath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.word)) {
      return _props.routeParams.word
    }
    return _props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(_props.routeParams.word)
  }

  _handleSave = (word, formValue) => {
    const newDocument = new Document(word.response, {
      repository: word.response._repository,
      nuxeo: word.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateWord(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel = () => {
    if (this.state.redirect) {
      NavigationHelpers.navigate(this.state.redirect, this.props.pushWindowPath, false)
    } else {
      NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
    }
  }
  _stateGetEdit = () => {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getWordPath(),
        entity: this.props.computeWord,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeWord)) {
      const providedFilter =
        selectn('response.properties.fv-word:definitions[0].translation', computeWord) ||
        selectn('response.properties.fv:literal_translation[0].translation', computeWord)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computeWord),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <AuthenticationFilter
        login={this.props.computeLogin}
        anon={false}
        is403={this.state.is403}
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
          <div className="WordsEdit WordsEdit--default">
            <h1 className="WordsEdit__heading">
              <FVLabel
                transKey="edit_x_word"
                defaultStr={'Edit ' + selectn('response.properties.dc:title', computeWord) + ' word'}
                transform="first"
                params={[selectn('response.properties.dc:title', computeWord)]}
              />
            </h1>

            <EditViewWithForm
              computeEntities={computeEntities}
              initialValues={context}
              itemId={this._getWordPath()}
              fields={fields}
              options={options}
              saveMethod={this._handleSave}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.replaceWindowPath}
              type="FVWord"
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
  const { fvDialect, fvWord, navigation, nuxeo, windowPath } = state

  const { computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { properties } = navigation
  const { splitWindowPath } = windowPath
  const { computeLogin } = nuxeo
  return {
    computeLogin,
    computeDialect2,
    computeWord,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchDialect2,
  fetchWord,
  pushWindowPath,
  overrideBreadcrumbs,
  replaceWindowPath,
  updateWord,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsEdit)
