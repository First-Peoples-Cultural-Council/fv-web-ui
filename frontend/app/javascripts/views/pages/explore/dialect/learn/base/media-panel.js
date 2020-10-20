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

import classNames from 'classnames'
import selectn from 'selectn'

import ImageGallery from 'react-image-gallery'
import Preview from 'views/components/Editor/Preview'

/**
 * Media panel for word or phrase views.
 */
export default class MediaPanel extends Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    minimal: PropTypes.bool,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { label, items, type, minimal } = this.props

    return items.length === 0 ? null : (
      <div className={classNames('row', 'media-panel', 'media-panel-' + type)}>
        <div className="col-xs-12">
          {label && <h3>{label}</h3>}
          {items.length === 1 ? (
            <Preview
              key={selectn('uid', items[0].object)}
              expandedValue={items[0].object}
              type={type}
              minimal={minimal}
            />
          ) : (
            <ImageGallery
              items={items}
              renderItem={function createPreview(item) {
                return (
                  <div className="image-gallery-image">
                    <Preview key={item.id} expandedValue={item.object} type={type} minimal={minimal} />
                  </div>
                )
              }}
              showNav={false}
            />
          )}
        </div>
      </div>
    )
  }
}
