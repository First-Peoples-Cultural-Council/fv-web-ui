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

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchWord, updateWord } from 'providers/redux/reducers/fvWord'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
// Models
import { Document } from 'nuxeo'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectWordEdit extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    word: object,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeWord: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchWord: func.isRequired,
    pushWindowPath: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateWord: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentWord
    let nextWord

    if (this._getWordPath() !== null) {
      currentWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath())
      nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this._getWordPath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', currentWord) != selectn('wasUpdated', nextWord) &&
      selectn('wasUpdated', nextWord) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextWord), 'words'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousWord = this.props.computeWord
    const nextWord = newProps.computeWord

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    switch (true) {
      case newProps.routeParams.word != this.props.routeParams.word:
        return true

      case newProps.routeParams.dialect_path !== this.props.routeParams.dialect_path:
        return true

      case typeof nextWord.equals === 'function' && nextWord.equals(previousWord) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const word = selectn('response', ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath()))
    const title = selectn('properties.dc:title', word)
    const uid = selectn('uid', word)

    if (title && selectn('pageTitleParams.word', this.props.properties) !== title) {
      this.props.changeTitleParams({ word: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.word' })
    }
  }

  render() {
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
      <div>
        <h1>
          {intl.trans(
            'edit_x_word',
            'Edit ' + selectn('response.properties.dc:title', computeWord) + ' word',
            'first',
            [selectn('response.properties.dc:title', computeWord)]
          )}
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
    )
  }

  fetchData = (newProps) => {
    newProps.fetchDialect2(this.props.routeParams.dialect_path)
    newProps.fetchWord(this._getWordPath())
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
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvWord, navigation, windowPath } = state

  const { computeWord } = fvWord
  const { computeDialect2 } = fvDialect
  const { properties } = navigation
  const { splitWindowPath } = windowPath

  return {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectWordEdit)
