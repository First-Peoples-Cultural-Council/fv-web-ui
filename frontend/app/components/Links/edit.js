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
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchLink, updateLink } from 'reducers/fvLink'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

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
import FVLabel from 'components/FVLabel'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object, string } = PropTypes
export class Edit extends Component {
  static propTypes = {
    dialect: object,
    routeParams: object.isRequired,
    link: object,
    value: string,
    onDocumentCreated: func,
    cancelMethod: func,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLink: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchDialect2: func.isRequired,
    fetchLink: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateLink: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      link: null,
      linkPath: !props.value ? props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.link : props.value,
      formValue: null,
    }

    // Bind methods to 'this'
    ;['_handleSave', '_handleCancel'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (!newProps.dialect) {
      newProps.fetchDialect2(this.props.routeParams.dialect_path)
    }

    newProps.fetchLink(this.state.linkPath)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentLink
    let nextLink

    if (this.state.linkPath !== null) {
      currentLink = ProviderHelpers.getEntry(this.props.computeLink, this.state.linkPath)
      nextLink = ProviderHelpers.getEntry(nextProps.computeLink, this.state.linkPath)
    }

    // Complete on success
    if (
      selectn('wasUpdated', currentLink) != selectn('wasUpdated', nextLink) &&
      selectn('wasUpdated', nextLink) === true
    ) {
      if (nextProps.onDocumentCreated) {
        nextProps.onDocumentCreated(selectn('response', nextLink))
      }
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousLink = this.props.computeLink
    const nextLink = newProps.computeLink

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    switch (true) {
      case newProps.routeParams.link != this.props.routeParams.link:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextLink.equals === 'function' && nextLink.equals(previousLink) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  _handleSave(link, formValue) {
    const newDocument = new Document(link.response, {
      repository: link.response._repository,
      nuxeo: link.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateLink(newDocument, null, null)

    if (this.props.onDocumentCreated) {
      this.props.onDocumentCreated(newDocument)
    }

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
        id: this.state.linkPath,
        entity: this.props.computeLink,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeLink = ProviderHelpers.getEntry(this.props.computeLink, this.state.linkPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeLink)) {
      const providedFilter =
        selectn('response.properties.fv-link:definitions[0].translation', computeLink) ||
        selectn('response.properties.fv:literal_translation[0].translation', computeLink)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computeLink),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <div>
        <h1>
          <FVLabel
            transKey="views.pages.explore.dialect.links.edit_x_link"
            defaultStr={'Edit ' + selectn('response.properties.dc:title', computeLink) + ' Link'}
            transform="first"
            params={[selectn('response.properties.dc:title', computeLink)]}
          />
        </h1>

        <EditViewWithForm
          computeEntities={computeEntities}
          initialValues={context}
          itemId={this.state.linkPath}
          fields={fields}
          options={options}
          saveMethod={this._handleSave}
          cancelMethod={this._handleCancel}
          currentPath={this.props.splitWindowPath}
          navigationMethod={() => {}}
          type="FVLink"
          routeParams={this.props.routeParams}
        />
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLink, windowPath } = state

  const { computeLink } = fvLink
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeDialect2,
    computeLink,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
  fetchLink,
  pushWindowPath,
  replaceWindowPath,
  updateLink,
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
