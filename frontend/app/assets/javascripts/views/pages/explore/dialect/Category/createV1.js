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
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createCategory } from 'providers/redux/reducers/fvCategory'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import StatusBar from 'views/components/StatusBar'
import FVLabel from 'views/components/FVLabel/index'

import ProviderHelpers from 'common/ProviderHelpers'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
/**
 * Create category
 */

const { array, bool, func, object, string } = PropTypes
export class PageDialectCategoryCreate extends Component {
  static propTypes = {
    embedded: bool,
    onDocumentCreated: func,
    // REDUX: reducers/state
    computeCategory: object.isRequired,
    computeDialect: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createCategory: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    embedded: false,
  }

  constructor(props, context) {
    super(props, context)

    this.formCategoryCreate = React.createRef()

    this.state = {
      formValue: null,
      dialectPath: null,
      categoryPath: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    const dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath)
    this.setState({ dialectPath: dialectPath })

    if (!this.props.computeDialect.success) {
      newProps.fetchDialect('/' + dialectPath)
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.onDocumentCreated &&
      this.state.categoryPath &&
      selectn('success', ProviderHelpers.getEntry(nextProps.computeCategory, this.state.categoryPath))
    ) {
      this.props.onDocumentCreated(
        ProviderHelpers.getEntry(nextProps.computeCategory, this.state.categoryPath).response
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath !== this.props.windowPath:
        return true

      case newProps.computeDialect.response != this.props.computeDialect.response:
        return true

      case newProps.computeCategory != this.props.computeCategory:
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

    // NOTE: getValue() is a tcomb-form
    const formValue = this.formCategoryCreate.current.getValue()

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
      // Check if a parent category was specified in the form
      let parentPathOrId = ''
      if (formValue['fvcategory:parent_category']) {
        parentPathOrId = formValue['fvcategory:parent_category']
      } else {
        parentPathOrId = '/' + this.state.dialectPath + '/Categories'
      }

      const now = Date.now()
      this.props.createCategory(
        parentPathOrId,
        {
          type: 'FVCategory',
          name: formValue['dc:title'],
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        categoryPath: parentPathOrId + '/' + formValue['dc:title'] + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      if (!this.props.embedded) window.scrollTo(0, 0)
    }
  }

  render() {
    const { computeDialect, computeCategory } = this.props

    const dialect = computeDialect.response
    const category = ProviderHelpers.getEntry(computeCategory, this.state.categoryPath)

    if (computeDialect.isFetching || !computeDialect.success) {
      return <CircularProgress variant="indeterminate" />
    }

    return (
      <div>
        <h1>
          <FVLabel
            transKey="views.pages.explore.dialect.category.add_new_category_to_x"
            defaultStr={'Add New Category to ' + dialect.get('dc:title')}
            params={[dialect.get('dc:title')]}
          />
        </h1>

        {category && category.message && category.action.includes('CREATE') ? (
          <StatusBar message={category.message} />
        ) : (
          ''
        )}

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref={this.formCategoryCreate}
                type={t.struct(selectn('FVCategory', fields))}
                context={dialect}
                value={this.state.formValue}
                options={selectn('FVCategory', options)}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
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
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, windowPath } = state

  const { computeCategory } = fvCategory
  const { computeDialect } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCategory,
    computeDialect,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createCategory,
  fetchDialect,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectCategoryCreate)
