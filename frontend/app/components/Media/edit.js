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
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchResource } from 'reducers/fvResources'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import PromiseWrapper from 'components/PromiseWrapper'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import withForm from 'components/withForm'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectMediaEdit extends Component {
  static propTypes = {
    resource: object,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeResource: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchResource: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
    }

    // Bind methods to 'this'
    ;['_handleCancel'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchDialect2(this.props.routeParams.dialect_path)
    newProps.fetchResource(this._getResourcePath())
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentResource
    let nextResource

    if (this._getResourcePath() !== null) {
      currentResource = ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath())
      nextResource = ProviderHelpers.getEntry(nextProps.computeResource, this._getResourcePath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', currentResource) != selectn('wasUpdated', nextResource) &&
      selectn('wasUpdated', nextResource) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.siteTheme, selectn('response', nextResource), 'media'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.routeParams.media != this.props.routeParams.media:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case ProviderHelpers.getEntry(newProps.computeResource, this._getResourcePath()) !=
        ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath()):
        return true

      case ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) !=
        ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path):
        return true
      default:
        return false
    }
  }

  _handleCancel() {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }

  _getResourcePath(props = null) {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.media)) {
      return _props.routeParams.media
    }
    return _props.routeParams.dialect_path + '/Resources/' + StringHelpers.clean(_props.routeParams.media)
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const media = selectn('response', ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath()))
    const title = selectn('properties.dc:title', media)
    const uid = selectn('uid', media)

    if (title && selectn('pageTitleParams.media', this.props.properties) != title) {
      this.props.changeTitleParams({ media: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.media' })
    }
  }

  render() {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getResourcePath(),
        entity: this.props.computeResource,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeResource = ProviderHelpers.getEntry(this.props.computeResource, this._getResourcePath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    const type = selectn('response.type', computeResource)

    // Additional context (in order to store file content for display)
    if (selectn('response', computeDialect2) && selectn('response', computeResource)) {
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          file: selectn('response.properties.file:content', computeResource),
        },
      })
    }

    return (
      <div>
        <h1>Edit {selectn('response.properties.dc:title', computeResource)} resource</h1>

        {(() => {
          if (type) {
            // Remove file upload for editing...
            const modifiedFields = Immutable.fromJS(fields).deleteIn([type, 'file']).toJS()

            return (
              <EditViewWithForm
                computeEntities={computeEntities}
                computeDialect={computeDialect2}
                initialValues={context}
                itemId={this._getResourcePath()}
                fields={modifiedFields}
                options={options}
                cancelMethod={this._handleCancel}
                currentPath={this.props.splitWindowPath}
                navigationMethod={this.props.replaceWindowPath}
                type={type}
                routeParams={this.props.routeParams}
              />
            )
          }
        })()}
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvResources, navigation, windowPath } = state

  const { computeResource } = fvResources
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { properties } = navigation
  return {
    computeDialect2,
    computeResource,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchDialect2,
  fetchResource,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectMediaEdit)
