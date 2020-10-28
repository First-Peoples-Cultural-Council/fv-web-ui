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
import { fetchGallery, updateGallery } from 'reducers/fvGallery'
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

// Models
import { Document } from 'nuxeo'

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
    computeLogin: object.isRequired,
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
    updateGallery: func.isRequired,
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

      if (title && selectn('pageTitleParams.galleryName', this.props.properties) != title) {
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

  _handleSave = (phrase, formValue) => {
    const newDocument = new Document(phrase.response, {
      repository: phrase.response._repository,
      nuxeo: phrase.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateGallery(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel = () => {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }

  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()
    // TODO: this.refs DEPRECATED
    const formValue = this.formGallery.current.getValue()

    // Passed validation
    if (formValue) {
      const gallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath())

      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      const newDocument = new Document(gallery.response, {
        repository: gallery.response._repository,
        nuxeo: gallery.response._nuxeo,
      })

      // Set new value property on document
      newDocument.set(formValue)

      // Save document
      this.props.updateGallery(newDocument)

      this.setState({ formValue: formValue })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      window.scrollTo(0, 0)
    }
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
      <AuthenticationFilter
        is403={this.state.is403}
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
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
              initialValues={context}
              itemId={this._getGalleryPath()}
              fields={fields}
              options={options}
              saveMethod={this._handleSave}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.replaceWindowPath}
              type="FVGallery"
              routeParams={this.props.routeParams}
            />
          </div>
        </PromiseWrapper>
      </AuthenticationFilter>
    )
    /*
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {intl.trans(
            'views.pages.explore.dialect.gallery.edit_x_gallery',
            'Edit ' + selectn('response.properties.dc:title', _computeGallery) + ' Gallery',
            'words',
            [selectn('response.properties.dc:title', _computeGallery)]
          )}
        </h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref={this.formGallery}
                type={t.struct(selectn('FVGallery', fields))}
                context={selectn('response', _computeDialect2)}
                value={this.state.formValue || selectn('response.properties', _computeGallery)}
                options={selectn('FVGallery', options)}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {intl.trans('save', 'Save', 'first')}
                </button>
              </div>
            </form>
          </div>

          <div className={classNames('col-xs-4', 'col-md-2')}>
            <Paper style={{ padding: '15px', margin: '20px 0' }}>
              <div className="subheader">{intl.trans('metadata', 'Metadata', 'first')}</div>
            </Paper>
          </div>
        </div>
      </PromiseWrapper>
    )
    */
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
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvGallery, navigation, nuxeo, windowPath } = state

  const { computeGallery } = fvGallery
  const { computeDialect2 } = fvDialect
  const { route, properties } = navigation
  const { splitWindowPath } = windowPath
  const { computeLogin } = nuxeo

  return {
    computeDialect2,
    computeGallery,
    computeLogin,
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
  updateGallery,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectGalleryEdit)
