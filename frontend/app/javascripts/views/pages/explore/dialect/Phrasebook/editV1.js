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
import { fetchCategory, updateCategory } from 'providers/redux/reducers/fvCategory'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { replaceWindowPath, pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// Models
import { Document } from 'nuxeo'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'
import FVLabel from 'views/components/FVLabel/index'

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
      phraseBook: null,
      phraseBookPath: !props.value
        ? props.routeParams.dialect_path + '/Phrase Books/' + props.routeParams.phraseBook
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

    newProps.fetchCategory(this.state.phraseBookPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentPhraseBook
    let nextPhraseBook

    if (this.state.phraseBookPath !== null) {
      currentPhraseBook = ProviderHelpers.getEntry(this.props.computeCategory, this.state.phraseBookPath)
      nextPhraseBook = ProviderHelpers.getEntry(nextProps.computeCategory, this.state.phraseBookPath)
    }

    // Complete on success
    if (
      selectn('wasUpdated', currentPhraseBook) != selectn('wasUpdated', nextPhraseBook) &&
      selectn('wasUpdated', nextPhraseBook) === true
    ) {
      if (nextProps.onDocumentCreated) {
        nextProps.onDocumentCreated(selectn('response', nextPhraseBook))
      }
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousPhraseBook = this.props.computeCategory
    const nextPhraseBook = newProps.computeCategory

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    switch (true) {
      case newProps.routeParams.phraseBook != this.props.routeParams.phraseBook:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextPhraseBook.equals === 'function' && nextPhraseBook.equals(previousPhraseBook) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  _handleSave(phraseBook, formValue) {
    const newDocument = new Document(phraseBook.response, {
      repository: phraseBook.response._repository,
      nuxeo: phraseBook.response._nuxeo,
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
        id: this.state.phraseBookPath,
        entity: this.props.computeCategory,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeCategory = ProviderHelpers.getEntry(this.props.computeCategory, this.state.phraseBookPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeCategory)) {
      const providedFilter =
        selectn('response.properties.fv-phraseBook:definitions[0].translation', computeCategory) ||
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
          <FVLabel
            transKey="views.pages.explore.dialect.phrases.edit_phrase_book"
            defaultStr="Edit PhraseBook"
            transform="words"
          />
        </h1>

        <EditViewWithForm
          computeEntities={computeEntities}
          initialValues={context}
          itemId={this.state.phraseBookPath}
          fields={fields}
          options={options}
          saveMethod={this._handleSave}
          cancelMethod={this._handleCancel}
          currentPath={this.props.splitWindowPath}
          navigationMethod={() => {}}
          type="FVPhraseBook"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit)
