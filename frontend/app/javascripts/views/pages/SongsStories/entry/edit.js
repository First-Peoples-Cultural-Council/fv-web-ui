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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchBookEntry, updateBookEntry } from 'reducers/fvBook'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'

// Models
import { Document } from 'nuxeo'

// Views

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import FVLabel from 'components/FVLabel'

const { array, func, object } = PropTypes
export class PageDialectBookEdit extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    entry: object,
    bookEntry: object,
    dialectEntry: object,
    handlePageSaved: func,
    book: object,
    // REDUX: reducers/state
    computeBookEntry: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchBookEntry: func.isRequired,
    fetchDialect2: func.isRequired,
    updateBookEntry: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.formBookEntry = React.createRef()

    this.state = {
      book: null,
      bookEntryPath:
        selectn('path', props.entry) ||
        props.routeParams.dialect_path +
          '/Stories & Songs/' +
          props.routeParams.parentBookName +
          '/' +
          props.routeParams.bookName,
      formValue: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (newProps.dialectEntry == null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }

    newProps.fetchBookEntry(this.state.bookEntryPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formBookEntry.current.getValue()

    // Passed validation
    if (formValue) {
      const bookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath)

      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      const newDocument = new Document(bookEntry.response, {
        repository: bookEntry.response._repository,
        nuxeo: bookEntry.response._nuxeo,
      })

      // Set new value property on document
      newDocument.set(formValue)

      // Save document
      this.props.updateBookEntry(newDocument)

      // Call other methods (e.g. close dialog)
      if (typeof this.props.handlePageSaved === 'function') {
        this.props.handlePageSaved()
      }

      this.setState({ formValue: formValue })
    } else {
      window.scrollTo(0, 0)
    }
  }

  _getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  render() {
    const computeBookEntry = ProviderHelpers.getEntry(this.props.computeBookEntry, this.state.bookEntryPath) || {
      response: this.props.entry,
    }
    const computeDialect2 =
      ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path) ||
      this.props.dialectEntry

    return (
      <div>
        <h1>
          <FVLabel transKey="edit_page" defaultStr="Edit Page" transform="words" />
        </h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref={this.formBookEntry}
                type={t.struct(selectn('FVBookEntry', fields))}
                context={selectn('response', computeDialect2)}
                value={this.state.formValue || selectn('response.properties', computeBookEntry)}
                options={selectn('FVBookEntry', options)}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  <FVLabel transKey="save" defaultStr="Save" transform="first" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, windowPath } = state
  const { computeBookEntry } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeBookEntry,
    computeDialect2,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchBookEntry,
  fetchDialect2,
  updateBookEntry,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectBookEdit)
