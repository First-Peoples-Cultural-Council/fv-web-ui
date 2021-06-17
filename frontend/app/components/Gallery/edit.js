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
// import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { fetchGallery } from 'reducers/fvGallery'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
// import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
import FVLabel from 'components/FVLabel'

// Views
import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import withForm from 'components/withForm'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes

export class PageDialectGalleryEdit extends Component {
  static propTypes = {
    gallery: object,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeGallery: object.isRequired,
    computeDialect2: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchGallery: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    gallery: null,
    formValue: null,
    componentState: STATE_LOADING,
    is403: false,
  }

  formGallery = React.createRef()

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    let previousGallery
    let currentGallery

    if (this._getGalleryPath() !== null) {
      previousGallery = ProviderHelpers.getEntry(prevProps.computeGallery, this._getGalleryPath())
      currentGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath())
    }

    if (
      selectn('wasUpdated', previousGallery) != selectn('wasUpdated', currentGallery) &&
      selectn('wasUpdated', currentGallery) === true
    ) {
      // 'Redirect' on success
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(
          this.props.routeParams.siteTheme,
          selectn('response', currentGallery),
          'gallery'
        ),
        this.props.replaceWindowPath,
        true
      )
    } else {
      const gallery = selectn('response', ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath()))
      const title = selectn('properties.dc:title', gallery)
      const uid = selectn('uid', gallery)

      if (title && selectn('pageTitleParams.galleryName', this.props.properties) !== title) {
        this.props.changeTitleParams({ galleryName: title })
        this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.galleryName' })
      }
    }
  }

  render() {
    const content = this._getContent()
    return content
  }

  fetchData = async () => {
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)
    await this.props.fetchGallery(this._getGalleryPath())
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    if (_computeDialect2.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: _computeDialect2.message == '403',
        errorMessage: _computeDialect2.message,
      })
      return
    }

    this.setState({
      componentState: STATE_DEFAULT,
      errorMessage: undefined,
    })
  }
  _getContent = () => {
    let content = null
    if (this.state.componentState === STATE_DEFAULT) {
      content = this._stateGetDefault()
    } else {
      content = this._stateGetLoading()
    }
    return content
  }

  _getGalleryPath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.gallery)) {
      return _props.routeParams.gallery
    }
    return _props.routeParams.dialect_path + '/Portal/' + StringHelpers.clean(_props.routeParams.gallery)
  }

  _handleCancel = () => {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }

  _stateGetDefault = () => {
    let context

    const _computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath())
    const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context
    if (selectn('response', _computeDialect2) && selectn('response', _computeGallery)) {
      context = Object.assign(selectn('response', _computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', _computeGallery),
        },
      })
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this._getGalleryPath(),
        entity: this.props.computeGallery,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    return (
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper computeEntities={computeEntities}>
          <div>
            <h1>
              <FVLabel
                transKey="views.pages.explore.dialect.gallery.edit_x_gallery"
                defaultStr={'Edit ' + selectn('response.properties.dc:title', _computeGallery) + ' Gallery'}
                transform="first"
                params={[selectn('response.properties.dc:title', _computeGallery)]}
              />
            </h1>

            <EditViewWithForm
              computeEntities={computeEntities}
              computeDialect={_computeDialect2}
              context={context}
              itemId={this._getGalleryPath()}
              fields={fields}
              options={options}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.replaceWindowPath}
              type="FVGallery"
              routeParams={this.props.routeParams}
            />
          </div>
        </PromiseWrapper>
      </AuthenticationFilter.Container>
    )
  }
  _stateGetErrorBoundary = () => {
    const { copy, errorMessage } = this.state
    return <StateErrorBoundary copy={copy} errorMessage={errorMessage} />
  }
  _stateGetLoading = () => {
    return <StateLoading copy={this.state.copy} />
  }
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvDialect, fvGallery, navigation, windowPath } = state

  const { computeGallery } = fvGallery
  const { computeDialect2 } = fvDialect
  const { route, properties } = navigation
  const { splitWindowPath } = windowPath

  return {
    computeDialect2,
    computeGallery,
    routeParams: route.routeParams,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchDialect2,
  fetchGallery,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectGalleryEdit)
