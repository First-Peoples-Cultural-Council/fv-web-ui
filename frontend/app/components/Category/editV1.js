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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategory, updateCategory } from 'reducers/fvCategory'
import { fetchDialect2 } from 'reducers/fvDialect'
import { replaceWindowPath, pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'components/PromiseWrapper'

// Models
import { Document } from 'nuxeo'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import withForm from 'components/withForm'
import IntlService from 'common/services/IntlService'

const intl = IntlService.instance
const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object, string } = PropTypes
export class Edit extends Component {
  static propTypes = {
    cancelMethod: func,
    dialect: object,
    onDocumentCreated: func,
    phraseBook: object,
    routeParams: object.isRequired,
    value: string,
    // REDUX: reducers/state
    computeCategory: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategory: func.isRequired,
    fetchDialect2: func.isRequired,
    replaceWindowPath: func.isRequired,
    pushWindowPath: func.isRequired,
    updateCategory: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      category: null,
      categoryPath: !props.value
        ? props.routeParams.dialect_path + '/Categories/' + props.routeParams.category
        : props.value,
      formValue: null,
    }

    // Bind methods to 'this'
    ;['_handleSave', '_handleCancel'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (!newProps.dialect) {
      newProps.fetchDialect2(this.props.routeParams.dialect_path)
    }

    newProps.fetchCategory(this.state.categoryPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentCategory
    let nextCategory

    if (this.state.categoryPath !== null) {
      currentCategory = ProviderHelpers.getEntry(this.props.computeCategory, this.state.categoryPath)
      nextCategory = ProviderHelpers.getEntry(nextProps.computeCategory, this.state.categoryPath)
    }

    // Complete on success
    if (
      selectn('wasUpdated', currentCategory) != selectn('wasUpdated', nextCategory) &&
      selectn('wasUpdated', nextCategory) === true
    ) {
      if (nextProps.onDocumentCreated) {
        nextProps.onDocumentCreated(selectn('response', nextCategory))
      }
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousCategory = this.props.computeCategory
    const nextCategory = newProps.computeCategory

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    switch (true) {
      case newProps.routeParams.category != this.props.routeParams.category:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextCategory.equals === 'function' && nextCategory.equals(previousCategory) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  _handleSave(category, formValue) {
    const newDocument = new Document(category.response, {
      repository: category.response._repository,
      nuxeo: category.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateCategory(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel() {
    if (this.props.cancelMethod) {
      this.props.cancelMethod()
    } else {
      NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
    }
  }

  render() {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.categoryPath,
        entity: this.props.computeCategory,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeCategory = ProviderHelpers.getEntry(this.props.computeCategory, this.state.categoryPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeCategory)) {
      const providedFilter =
        selectn('response.properties.fv-category:definitions[0].translation', computeCategory) ||
        selectn('response.properties.fv:literal_translation[0].translation', computeCategory)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computeCategory),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <div>
        <h1>
          {selectn('response.properties.dc:title', computeCategory)}:{' '}
          {intl.trans('views.pages.explore.dialect.phrases.edit_category', 'Edit Category', 'words')}
        </h1>

        <EditViewWithForm
          computeEntities={computeEntities}
          initialValues={context}
          itemId={this.state.categoryPath}
          fields={fields}
          options={options}
          saveMethod={this._handleSave}
          cancelMethod={this._handleCancel}
          currentPath={this.props.splitWindowPath}
          navigationMethod={() => {}}
          type="FVCategory"
          // routeParams={this.props.routeParams}
        />
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, windowPath } = state

  const { computeCategory } = fvCategory
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeCategory,
    computeDialect2,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategory,
  fetchDialect2,
  replaceWindowPath,
  pushWindowPath,
  updateCategory,
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
