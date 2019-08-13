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
import { createBook } from 'providers/redux/reducers/fvBook'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * Create song/story book
 */

const { array, func, object, string } = PropTypes
export class PageDialectStoriesAndSongsCreate extends Component {
  static propTypes = {
    typeFilter: string,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeBook: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createBook: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
      dialectPath: null,
      bookPath: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let currentBook
    let nextBook

    if (this.state.bookPath !== null) {
      currentBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath)
      nextBook = ProviderHelpers.getEntry(nextProps.computeBook, this.state.bookPath)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (selectn('success', currentBook) != selectn('success', nextBook) && selectn('success', nextBook) === true) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(
          nextProps.routeParams.theme,
          selectn('response', nextBook),
          this.props.typeFilter === 'story' ? 'stories' : 'songs'
        ),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath !== this.props.windowPath:
        return true

      case newProps.computeDialect2 != this.props.computeDialect2:
        return true

      case newProps.computeBook != this.props.computeBook:
        return true
      default:
        return false
    }
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    // TODO: this.refs DEPRECATED
    const formValue = this.refs.form_book_create.getValue()

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

  render() {
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
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {intl.trans(
            'views.pages.explore.dialect.learn.songs_stories.add_new_x_book_to_x',
            'Add New ' + this.props.typeFilter + ' Book to ' + selectn('response.title', _computeDialect2),
            'first',
            [this.props.typeFilter, selectn('response.title', _computeDialect2)]
          )}
        </h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref="form_book_create" // TODO: DEPRECATED
                type={t.struct(selectn('FVBook', fields))}
                context={selectn('response', _computeDialect2)}
                value={this.state.formValue || { 'fvbook:type': this.props.typeFilter }}
                options={FVBookOptions}
              />
              <div data-testid="PageDialectStoriesAndSongsCreate__btnGroup" className="form-group">
                <button type="submit" className="RaisedButton RaisedButton--primary">
                  {intl.trans('save', 'Save', 'first')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, windowPath } = state

  const { computeBook } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeBook,
    computeDialect2,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createBook,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectStoriesAndSongsCreate)
