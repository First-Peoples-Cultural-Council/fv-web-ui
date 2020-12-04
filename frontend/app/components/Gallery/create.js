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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createGallery } from 'reducers/fvGallery'

import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'
import Paper from '@material-ui/core/Paper'

import ProviderHelpers from 'common/ProviderHelpers'
import URLHelpers from 'common/URLHelpers'
import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import FVLabel from 'components/FVLabel'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'
import { STATE_LOADING, STATE_DEFAULT } from 'common/Constants'
/**
 * Create book entry
 */
const { array, func, object, string } = PropTypes
export class PageDialectGalleryCreate extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeGallery: object.isRequired,
    windowPath: string.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createGallery: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }
  state = {
    formValue: null,
    galleryPath: null,
    componentState: STATE_LOADING,
    is403: false,
  }

  formGalleryCreate = React.createRef()

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    let currentGallery
    let nextGallery

    if (this.state.galleryPath !== null) {
      currentGallery = ProviderHelpers.getEntry(prevProps.computeGallery, this.state.galleryPath)
      nextGallery = ProviderHelpers.getEntry(this.props.computeGallery, this.state.galleryPath)
    }

    // 'Redirect' on success
    if (
      selectn('success', currentGallery) != selectn('success', nextGallery) &&
      selectn('success', nextGallery) === true
    ) {
      this.props.replaceWindowPath(
        `${URLHelpers.getContextPath()}/${this.props.routeParams.siteTheme}${selectn(
          'response.path',
          nextGallery
        ).replace('Portal', 'gallery')}`
      )
    } else if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData()
    }
  }

  render() {
    const content = this._getContent()
    return content
  }

  fetchData = async () => {
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
    await this.props.fetchDialect2(this.props.routeParams.dialect_path)
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
  _onRequestSaveForm = (e) => {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.formGalleryCreate.current.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (key && Object.prototype.hasOwnProperty.call(formValue, key)) {
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
      this.props.createGallery(
        `${this.props.routeParams.dialect_path}/Portal`,
        {
          type: 'FVGallery',
          name: formValue['dc:title'],
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        galleryPath: this.props.routeParams.dialect_path + '/Portal/' + formValue['dc:title'] + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_Gallery_create"].validate().firstError();
      window.scrollTo(0, 0)
    }
  }
  _stateGetDefault = () => {
    const FVGalleryOptions = Object.assign({}, selectn('FVGallery', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.galleryPath,
        entity: this.props.computeGallery,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this.state.galleryPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    return (
      <AuthenticationFilter.Container
        is403={this.state.is403}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <h1>
            <FVLabel
              transKey="views.pages.explore.dialect.gallery.add_new_gallery_to_x"
              defaultStr={'Add New Gallery to ' + selectn('response.title', computeDialect2)}
              params={[selectn('response.title', computeDialect2)]}
            />
          </h1>

          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-8', 'col-md-10')}>
              <form onSubmit={this._onRequestSaveForm}>
                <t.form.Form
                  ref={this.formGalleryCreate}
                  type={t.struct(selectn('FVGallery', fields))}
                  context={selectn('response', computeDialect2)}
                  value={this.state.formValue}
                  options={FVGalleryOptions}
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
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvGallery, navigation, windowPath } = state

  const { computeGallery } = fvGallery
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath
  const { route } = navigation

  return {
    computeDialect2,
    computeGallery,
    routeParams: route.routeParams,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createGallery,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDialectGalleryCreate)
