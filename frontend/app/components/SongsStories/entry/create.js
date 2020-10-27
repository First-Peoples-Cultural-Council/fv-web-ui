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
import Immutable from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createBookEntry, fetchBook } from 'reducers/fvBook'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'components/PromiseWrapper'
import AuthenticationFilter from 'components/AuthenticationFilter'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'

import Paper from '@material-ui/core/Paper'
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

/**
 * Create book entry
 */

const { array, func, object, string } = PropTypes
export class PageDialectStoriesAndSongsBookEntryCreate extends Component {
  static propTypes = {
    routeParams: object,
    typePlural: string.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computeBook: object.isRequired,
    computeBookEntry: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createBookEntry: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchBook: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.formBookEntryCreate = React.createRef()

    this.state = {
      formValue: null,
      dialectPath: null,
      parentBookPath: null,
      bookEntryPath: null,
      is403: false,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest', '_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData = async (newProps) => {
    const parentBookPath = newProps.routeParams.parentBookName

    await newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchBook(parentBookPath)
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    if (_computeDialect2.isError) {
      this.setState({
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
        errorMessage: _computeDialect2.message,
      })
      return
    }
    this.setState({
      dialectPath: newProps.routeParams.dialect_path,
      parentBookPath: parentBookPath,
    })
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentBookEntry
    let nextBookEntry
    let parentBook

    if (this.state.bookEntryPath !== null) {
      currentBookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath)
      nextBookEntry = ProviderHelpers.getEntry(nextProps.computeBookEntry, this.state.bookEntryPath)
      parentBook = ProviderHelpers.getEntry(nextProps.computeBook, this.state.parentBookPath)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (
      selectn('success', currentBookEntry) != selectn('success', nextBookEntry) &&
      selectn('success', nextBookEntry) === true &&
      selectn('response', parentBook) !== undefined
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(
          nextProps.routeParams.siteTheme,
          selectn('response', parentBook),
          nextProps.typePlural.toLowerCase()
        ),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath != this.props.windowPath:
        return true

      case newProps.computeDialect2 != this.props.computeDialect2:
        return true

      case newProps.computeBook != this.props.computeBook:
        return true

      case newProps.computeBookEntry != this.props.computeBookEntry:
        return true
      default:
        return false
    }
  }

  _onNavigateRequest(/*path*/) {
    //this.props.pushWindowPath('/' + path);
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formBookEntryCreate.current.getValue()

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
      this.props.createBookEntry(
        this.state.parentBookPath,
        {
          type: 'FVBookEntry',
          name: formValue['dc:title'],
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        bookEntryPath: this.state.parentBookPath + '/' + formValue['dc:title'] + '.' + now,
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const FVBookEntryOptions = Object.assign({}, selectn('FVBookEntry', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.bookEntryPath,
        entity: this.props.computeBookEntry,
      },
      {
        id: this.state.parentBookPath,
        entity: this.props.computeBook,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.parentBookPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    if (selectn('response.properties.fvdialect:dominant_language', this.props.computeDialect2)) {
      if (selectn('fields.fv:literal_translation.item.fields.language.attrs', FVBookEntryOptions)) {
        FVBookEntryOptions.fields['fv:literal_translation'].item.fields.language.attrs.defaultValue = selectn(
          'response.properties.fvdialect:dominant_language',
          this.props.computeDialect2
        )
      }

      if (selectn('fields.fvbookentry:dominant_language_text.item.fields.language.attrs', FVBookEntryOptions)) {
        FVBookEntryOptions.fields[
          'fvbookentry:dominant_language_text'
        ].item.fields.language.attrs.defaultValue = selectn(
          'response.properties.fvdialect:dominant_language',
          this.props.computeDialect2
        )
      }
    }
    return (
      <AuthenticationFilter
        is403={this.state.is403}
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={
          <StateErrorBoundary /*copy={this.state.copy} errorMessage={this.state.errorMessage}*/ />
        }
      >
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <h1>
            <FVLabel
              transKey="views.pages.explore.dialect.learn.songs_stories.add_new_entry_to_x_book"
              defaultStr={'Add New Entry to ' + selectn('response.properties.dc:title', computeBook) + ' Book'}
              transform="words"
              params={[selectn('response.properties.dc:title', computeBook)]}
            />
          </h1>

          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref={this.formBookEntryCreate}
                  type={t.struct(selectn('FVBookEntry', fields))}
                  context={selectn('response', computeDialect2)}
                  value={this.state.formValue}
                  options={FVBookEntryOptions}
                />
                <div className="form-group" data-testid="PageDialectStoriesAndSongsBookEntryCreate__btnGroup">
                  <button type="submit" className="RaisedButton RaisedButton--primary">
                    <FVLabel transKey="save" defaultStr="Save" transform="first" />
                  </button>
                </div>
              </form>
            </div>

            <div className={classNames('col-xs-4', 'col-md-2')}>
              <Paper style={{ padding: '15px', margin: '20px 0' }}>
                <div className="subheader">
                  <FVLabel transKey="metadata" defaultStr="Metadata" transform="first" />
                </div>
              </Paper>
            </div>
          </div>
        </PromiseWrapper>
      </AuthenticationFilter>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, nuxeo, windowPath } = state

  const { computeBook, computeBookEntry } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { computeLogin } = nuxeo

  return {
    computeBook,
    computeBookEntry,
    computeDialect2,
    computeLogin,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createBookEntry,
  fetchDialect2,
  fetchBook,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectStoriesAndSongsBookEntryCreate)
