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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createWord, createAndPublishWord } from 'reducers/fvWord'
import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { routeHasChanged } from 'common/NavigationHelpers'

import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import './WordsCreate.css'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

/**
 * Create word entry
 */

const { array, func, object, string } = PropTypes
export class PageDialectWordsCreate extends Component {
  static propTypes = {
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeDialect2: object.isRequired,
    computeWord: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createWord: func.isRequired,
    createAndPublishWord: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    componentState: STATE_LOADING,
    formValue: null,
    wordPath: null,
    is403: false,
  }

  formWordCreate = React.createRef()

  // Fetch data on initial render
  async componentDidMount() {
    const copy = await import(/* webpackChunkName: "WordsCreateCopy" */ './copy').then((_module) => {
      return _module.default
    })
    this.fetchData({ copy })
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    const previousWord = ProviderHelpers.getEntry(prevProps.computeWord, this.state.wordPath)
    const currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)

    // TODO: is fetchData necessary?
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.fetchData()
    }

    // 'Redirect' on success
    if (
      selectn('success', previousWord) != selectn('success', currentWord) &&
      selectn('success', currentWord) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(this.props.routeParams.siteTheme, selectn('response', currentWord), 'words'),
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
      case newProps.computeLogin != this.props.computeLogin:
        return true

      case is(newProps.computeDialect2, this.props.computeDialect2) === false:
        return true

      case is(newProps.computeWord, this.props.computeWord) === false:
        return true
      default:
        return false
    }
  }

  render() {
    if (this.props.computeLogin.hasFetched === false) {
      return this._stateGetLoading()
    }
    const content = this._getContent()
    return content
  }

  fetchData = async (addToState = {}) => {
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    if (_computeDialect2 && _computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
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

  _onRequestSaveForm = (e, publish = false) => {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formWordCreate.current.getValue()

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
      if (publish) {
        this.props.createAndPublishWord(
          this.props.routeParams.dialect_path + '/Dictionary',
          {
            type: 'FVWord',
            name: now.toString(),
            properties: properties,
          },
          null,
          now
        )
      } else {
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
      }
      this.setState({
        wordPath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
      })
    } else {
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

    const isPublicDialect =
      selectn('response.state', _computeDialect2) === 'Published' ||
      selectn('response.state', _computeDialect2) === 'Republish'
    const isRecorderWithApproval = ProviderHelpers.isRecorderWithApproval(this.props.computeLogin)
    const isAdmin = ProviderHelpers.isAdmin(this.props.computeLogin)
    const hasWritePriveleges = isRecorderWithApproval || isAdmin

    return (
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="WordsCreate">
            <h1 className="WordsCreate__heading">
              <FVLabel
                transKey="views.pages.explore.dialect.learn.words.add_new_word_to_x"
                defaultStr={'Add New Word to ' + selectn('response.title', _computeDialect2)}
                params={[selectn('response.title', _computeDialect2)]}
              />
            </h1>
            <div className="row" style={{ marginTop: '15px' }}>
              <div className={classNames('col-xs-8', 'col-md-10')}>
                <form
                  onSubmit={(e) => {
                    this._onRequestSaveForm(e)
                  }}
                  data-testid="PageDialectWordsCreate__form"
                >
                  <t.form.Form
                    ref={this.formWordCreate}
                    type={t.struct(selectn('FVWord', fields))}
                    context={selectn('response', _computeDialect2)}
                    value={this.state.formValue}
                    options={FVWordOptions}
                  />
                  <div className="form-group" style={{ margin: '5px', textAlign: 'left' }}>
                    <FVButton
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        this._onRequestSaveForm(e)
                      }}
                      style={{ marginRight: '5px' }}
                    >
                      {<FVLabel transKey="save" defaultStr="Save" transform="first" />}
                    </FVButton>
                    {isPublicDialect && hasWritePriveleges ? (
                      <FVButton
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          this._onRequestSaveForm(e, true)
                        }}
                      >
                        {<FVLabel transKey="save & publish" defaultStr="Save & Publish" transform="first" />}
                      </FVButton>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
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
  const { fvDialect, fvWord, navigation, nuxeo, windowPath } = state

  const { computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeLogin,
    computeDialect2,
    computeWord,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createWord,
  createAndPublishWord,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectWordsCreate)
