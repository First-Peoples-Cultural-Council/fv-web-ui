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
import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import classNames from 'classnames'
import PhotoGallery from 'react-photo-gallery'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  askToDisableGallery,
  askToEnableGallery,
  askToPublishGallery,
  askToUnpublishGallery,
  disableGallery,
  deleteGallery,
  enableGallery,
  fetchGallery,
  publishGallery,
  unpublishGallery,
} from 'reducers/fvGallery'
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import withActions from 'components/withActions'

const DetailsViewWithActions = withActions(PromiseWrapper, true)

//Stylesheet
import 'react-image-gallery/styles/css/image-gallery.css'

const { array, func, object, string } = PropTypes

export class Gallery extends React.Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeGallery: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    askToDisableGallery: func.isRequired,
    askToEnableGallery: func.isRequired,
    askToPublishGallery: func.isRequired,
    askToUnpublishGallery: func.isRequired,
    changeTitleParams: func.isRequired,
    disableGallery: func.isRequired,
    deleteGallery: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchGallery: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    publishGallery: func.isRequired,
    pushWindowPath: func.isRequired,
    unpublishGallery: func.isRequired,
    enableGallery: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getGalleryPath(props = null) {
    const _props = props == null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.galleryName)) {
      return _props.routeParams.galleryName
    }
    return _props.routeParams.dialect_path + '/Portal/' + StringHelpers.clean(_props.routeParams.galleryName)
  }

  fetchData(newProps) {
    newProps.fetchGallery(this._getGalleryPath())
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const gallery = selectn('response', ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath()))
    const title = selectn('properties.dc:title', gallery)
    const uid = selectn('uid', gallery)

    if (title && selectn('pageTitleParams.galleryName', this.props.properties) != title) {
      this.props.changeTitleParams({ galleryName: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.galleryName' })
    }
  }

  render() {
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this._getGalleryPath())
    const toMap = selectn('response.contextParameters.gallery.related_pictures', computeGallery) || []
    const images = toMap.map((picture) => {
      return {
        src: UIHelpers.getThumbnail(picture, 'Medium'),
        description: picture['dc:description'],
        width: picture.views[2].width,
        height: picture.views[2].height,
      }
    })

    const computeEntities = Immutable.fromJS([
      {
        id: this._getGalleryPath(),
        entity: this.props.computeGallery,
      },
    ])

    return (
      <DetailsViewWithActions
        labels={{ single: 'Gallery' }}
        itemPath={this._getGalleryPath()}
        actions={['workflow', 'edit', 'visibility', 'publish']}
        publishAction={this.props.publishGallery}
        unpublishAction={this.props.unpublishGallery}
        askToPublishAction={this.props.askToPublishGallery}
        askToUnpublishAction={this.props.askToUnpublishGallery}
        enableAction={this.props.enableGallery}
        askToEnableAction={this.props.askToEnableGallery}
        disableAction={this.props.disableGallery}
        askToDisableAction={this.props.askToDisableGallery}
        deleteAction={this.props.deleteGallery}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computeGallery}
        permissionEntry={computeDialect2}
        renderOnError
        computeEntities={computeEntities}
        {...this.props}
      >
        <div className="row">
          <div className="col-xs-12" style={{ textAlign: 'center' }}>
            <h1>{selectn('response.title', computeGallery)}</h1>
            <p>{selectn('response.properties.dc:description', computeGallery)}</p>
            <div className={classNames('col-xs-12')}>
              <div>
                <PhotoGallery photos={images} />
              </div>
            </div>
          </div>
        </div>
      </DetailsViewWithActions>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvGallery, navigation, nuxeo, windowPath } = state

  const { computeGallery } = fvGallery
  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeGallery,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  askToDisableGallery,
  askToEnableGallery,
  askToPublishGallery,
  askToUnpublishGallery,
  changeTitleParams,
  disableGallery,
  deleteGallery,
  enableGallery,
  fetchDialect2,
  fetchGallery,
  overrideBreadcrumbs,
  publishGallery,
  pushWindowPath,
  unpublishGallery,
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery)
