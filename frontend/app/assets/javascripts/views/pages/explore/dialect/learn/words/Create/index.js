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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createWord } from 'providers/redux/reducers/fvWord'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'
import StateLoading from './states/loading'
import StateErrorBoundary from './states/errorBoundary'
import '!style-loader!css-loader!./WordsCreate.css'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * Create word entry
 */

const { array, func, object, string } = PropTypes
export class WordsCreate extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeWord: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createWord: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    componentState: STATE_LOADING,
    formValue: null,
    wordPath: null,
  }

  // Fetch data on initial render
  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "WordsCreateInternationalization" */ './internationalization').then(
      (_module) => {
        return _module.default
      }
    )
    this.fetchData({ copy })
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    let currentWord
    let nextWord

    if (this.state.wordPath === null) {
      currentWord = ProviderHelpers.getEntry(prevProps.computeWord, this.state.wordPath)
      nextWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
    }

    if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData()
    }

    // 'Redirect' on success
    if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.theme, selectn('response', nextWord), 'words'),
        this.props.replaceWindowPath,
        true
      )
    }
  }

  // shouldComponentUpdate(newProps /*, newState*/) {
  //   switch (true) {
  //     case newProps.windowPath != this.props.windowPath:
  //       return true

  //     case newProps.computeDialect2 != this.props.computeDialect2:
  //       return true

  //     case newProps.computeWord != this.props.computeWord:
  //       return true
  //     default:
  //       return false
  //   }
  // }

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

  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()

    // TODO: this.refs DEPRECATED
    const formValue = this.refs.form_word_create.getValue()

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
      this.props.createWord(
        this.props.routeParams.dialect_path + '/Dictionary',
        {
          type: 'FVWord',
          name: now.toString(),
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        wordPath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      window.scrollTo(0, 0)
    }
  }
  _stateGetDefault = () => {
    const FVWordOptions = Object.assign({}, selectn('FVWord', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.wordPath,
        entity: this.props.computeWord,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const _computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    if (
      selectn('fields.fv:definitions.item.fields.language.attrs', FVWordOptions) &&
      selectn('response.properties.fvdialect:dominant_language', _computeDialect2)
    ) {
      FVWordOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
        'response.properties.fvdialect:dominant_language',
        _computeDialect2
      )
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="WordsCreate">
          <h1 className="WordsCreate__heading">
            {intl.trans(
              'views.pages.explore.dialect.learn.words.add_new_word_to_x',
              'Add New Word to ' + selectn('response.title', _computeDialect2),
              null,
              [selectn('response.title', _computeDialect2)]
            )}
          </h1>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref="form_word_create" // TODO: DEPRECATED
                  type={t.struct(selectn('FVWord', fields))}
                  context={selectn('response', _computeDialect2)}
                  value={this.state.formValue}
                  options={FVWordOptions}
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    {intl.trans('save', 'Save', 'first')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PromiseWrapper>
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
  const { fvDialect, fvWord, windowPath } = state

  const { computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeWord,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createWord,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordsCreate)
