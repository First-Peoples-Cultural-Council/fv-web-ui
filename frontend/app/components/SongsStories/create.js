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
import { createBook } from 'reducers/fvBook'
import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
/**
 * Create song/story book
 */

const { array, func, object, string } = PropTypes
export class PageDialectStoriesAndSongsCreate extends Component {
  static propTypes = {
    typeFilter: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeBook: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createBook: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    formValue: null,
    dialectPath: null,
    bookPath: null,
    componentState: STATE_LOADING,
    is403: false,
  }

  formBookCreate = React.createRef()

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let previousBook
    let currentBook

    if (this.state.bookPath !== null) {
      previousBook = ProviderHelpers.getEntry(prevProps.computeBook, this.state.bookPath)
      currentBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath)
    }

    if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData()
    }

    // 'Redirect' on success
    if (
      selectn('success', previousBook) != selectn('success', currentBook) &&
      selectn('success', currentBook) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(
          this.props.routeParams.siteTheme,
          selectn('response', currentBook),
          prevProps.typeFilter === 'story' ? 'stories' : 'songs'
        ),
        this.props.replaceWindowPath,
        true
      )
    }
  }

  // NOTE: Annoyingly, this fixes FW-316
  // Note: Suspect <button>s within <t.form.Form> trigger a rerender when clicked
  shouldComponentUpdate(newProps, newState) {
    switch (true) {
      case this.state.componentState != newState.componentState:
        return true
      case newProps.windowPath != this.props.windowPath:
        return true

      case is(newProps.computeDialect2, this.props.computeDialect2) === false:
        return true

      case is(newProps.computeBook, this.props.computeBook) === false:
        return true
      default:
        return false
    }
  }
  render() {
    const content = this._getContent()
    return content
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

  fetchData = async (addToState = {}) => {
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
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
    this.setState({
      componentState: STATE_DEFAULT,
      errorMessage: undefined,
      ...addToState,
    })
  }

  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formBookCreate.current.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          // Filter out null values in an array
          if (formValue[key] instanceof Array) {
            const formValueKey = formValue[key].filter((item) => item !== null)
            properties[key] = formValueKey
          } else {
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
      this.props.createBook(
        this.props.routeParams.dialect_path + '/Stories & Songs',
        {
          type: 'FVBook',
          name: now.toString(),
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        bookPath: this.props.routeParams.dialect_path + '/Stories & Songs/' + now.toString() + '.' + now,
      })
    } else {
      window.scrollTo(0, 0)
    }
  }
  _stateGetDefault = () => {
    const FVBookOptions = Object.assign({}, selectn('FVBook', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.bookPath,
        entity: this.props.computeBook,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const _computeBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath)
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    if (selectn('response.properties.fvdialect:dominant_language', _computeDialect2)) {
      if (selectn('fields.fvbook:title_literal_translation.item.fields.language.attrs', FVBookOptions)) {
        FVBookOptions.fields['fvbook:title_literal_translation'].item.fields.language.attrs.defaultValue = selectn(
          'response.properties.fvdialect:dominant_language',
          _computeDialect2
        )
      }

      if (selectn('fields.fvbook:introduction_literal_translation.item.fields.language.attrs', FVBookOptions)) {
        FVBookOptions.fields[
          'fvbook:introduction_literal_translation'
        ].item.fields.language.attrs.defaultValue = selectn(
          'response.properties.fvdialect:dominant_language',
          _computeDialect2
        )
      }
    }

    return (
      <AuthenticationFilter
        is403={this.state.is403}
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <h1>
            <FVLabel
              transKey="views.pages.explore.dialect.learn.songs_stories.add_new_x_book_to_x"
              defaultStr={
                'Add New ' + this.props.typeFilter + ' Book to ' + selectn('response.title', _computeDialect2)
              }
              transform="first"
              params={[this.props.typeFilter, selectn('response.title', _computeDialect2)]}
            />
          </h1>

          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form className="PageDialectStoriesAndSongsCreate__form" onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref={this.formBookCreate}
                  type={t.struct(selectn('FVBook', fields))}
                  context={selectn('response', _computeDialect2)}
                  value={this.state.formValue || { 'fvbook:type': this.props.typeFilter }}
                  options={FVBookOptions}
                />
                <div data-testid="PageDialectStoriesAndSongsCreate__btnGroup" className="form-group">
                  <button type="submit" className="RaisedButton RaisedButton--primary">
                    <FVLabel transKey="save" defaultStr="Save" transform="first" />
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
    return <StateLoading copy={this.state.copy} />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, navigation, nuxeo, windowPath } = state

  const { computeBook } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation
  const { computeLogin } = nuxeo

  return {
    computeBook,
    computeDialect2,
    computeLogin,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createBook,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectStoriesAndSongsCreate)
