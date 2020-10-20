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

import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'

// REDUX: actions/dispatch/func
import { fetchResources } from 'providers/redux/reducers/fvResources'

import UIHelpers from 'common/UIHelpers'
import ProviderHelpers from 'common/ProviderHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import PhotoGallery from 'react-photo-gallery'

/**
 * Custom render image
 * See https://codesandbox.io/s/o7o241q09?from-embed=&file=/index.js:355-660
 */
const imgStyle = {
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
}
const selectedImgStyle = {
  transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
}
const cont = {
  backgroundColor: '#eee',
  overflow: 'hidden',
  position: 'relative',
}

const spanDescStyle = {
  zIndex: '999',
  position: 'relative',
  bottom: '35px',
  fontSize: '0.8em',
  width: '100%',
  padding: '5px',
}

const spanLabelStyle = {
  backgroundColor: 'white',
  margin: '2px 5px 2px 2px',
  borderRadius: '1px',
  padding: '0 4px',
}

const CustomImage = ({ photo, margin, direction, top, left }) => {
  //calculate x,y scale
  const sx = (100 - (30 / photo.width) * 100) / 100
  const sy = (100 - (30 / photo.height) * 100) / 100
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`

  if (direction === 'column') {
    cont.position = 'absolute'
    cont.left = left
    cont.top = top
  }

  return (
    <div style={{ margin, height: photo.height, width: photo.width, ...cont }} className="not-selected">
      <img alt={photo.title} style={{ ...imgStyle }} src={photo.src} width={photo.width} height={photo.height} />
      <div style={{ ...spanDescStyle }}>
        {photo.tags.map((tag) => (
          <span key={tag.label} style={{ ...spanLabelStyle }}>
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}

CustomImage.propTypes = {
  photo: PropTypes.string,
  margin: PropTypes.string,
  direction: PropTypes.string,
  top: PropTypes.string,
  left: PropTypes.string,
}

/**
 * Mentor Apprentice Photo Project
 * Uses https://neptunian.github.io/react-photo-gallery/
 */
const MAPPhotoProjectPath = '/FV/sections/SharedData/Shared Resources/MAP Photo Project/'

const { func, object } = PropTypes

export class MAPPhotoProject extends Component {
  static propTypes = {
    // REDUX: reducers/state
    fetchResources: func.isRequired,
    computeResources: object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {}

    this.fetchData = this.fetchData.bind(this)
  }

  fetchData() {
    this.props.fetchResources(
      MAPPhotoProjectPath,
      " AND ecm:primaryType LIKE 'FVPicture'" +
        ' AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0' +
        '&currentPageIndex=0&pageSize=300',
      'Loading photos...'
    )
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData()
  }

  render() {
    const computeResources = ProviderHelpers.getEntry(this.props.computeResources, MAPPhotoProjectPath)
    const photos = selectn('response.entries', computeResources) || []
    const images = photos.map((picture) => {
      return {
        src: UIHelpers.getThumbnail(picture, 'Medium'),
        width: selectn('properties.picture:views[2].width', picture),
        height: selectn('properties.picture:views[2].height', picture),
        description: selectn('properties.dc:description', picture),
        tags: picture.properties['nxtag:tags'] || [],
      }
    })

    const computeEntities = Immutable.fromJS([
      {
        id: MAPPhotoProjectPath,
        entity: this.props.computeResources,
      },
    ])

    const imageRenderer = ({ left, top, key, photo }) => (
      <CustomImage key={key} margin={'2px'} photo={photo} left={left} top={top} />
    )

    return (
      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-xs-12">
          <PromiseWrapper computeEntities={computeEntities}>
            <PhotoGallery photos={images} renderImage={imageRenderer} />
          </PromiseWrapper>
        </div>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvResources } = state
  const { computeResources } = fvResources
  return {
    computeResources,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
}

export default connect(mapStateToProps, mapDispatchToProps)(MAPPhotoProject)
