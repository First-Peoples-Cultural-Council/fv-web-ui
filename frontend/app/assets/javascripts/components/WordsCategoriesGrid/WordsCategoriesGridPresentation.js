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

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import '!style-loader!css-loader!./WordsCategoriesGrid.css'

import AudioMinimal from 'components/AudioMinimal'

/**
 * @summary WordsCategoriesGridPresentation
 * @component
 * @version 1.0.1
 *
 * @param {object} props
 * @param {array} [props.categories] [{audio, href, image, subtitle, title}, ...] Default: []
 * @param {function} [props.onClickTile] event handler when tile is clicked. Default: () => {}
 * @param {number} [props.cols] Default: 6
 * @param {number} [props.cellHeight] Default: 160
 *
 * @returns {node} jsx markup
 */
function WordsCategoriesGridPresentation({ categories, cellHeight, cols, onClickTile }) {
  return (
    <GridList cols={cols} cellHeight={cellHeight} id="WordsCategoriesGrid">
      {categories.map((category, index) => {
        const { audio, href, image, subtitle, title } = category
        const _subtitle = subtitle ? (
          <div
            dangerouslySetInnerHTML={{
              __html: subtitle,
            }}
          />
        ) : null
        return (
          <GridListTile
            onClick={() => {
              onClickTile(href)
            }}
            key={`category${index}`}
          >
            <img src={image ? image : 'assets/images/cover-thumbnail.png'} alt={title} />
            <GridListTileBar
              title={title}
              subtitle={_subtitle}
              className="WordsCategoriesGridTileBar"
              actionPosition="right"
              actionIcon={audio ? <AudioMinimal.Container src={audio} /> : null}
            />
          </GridListTile>
        )
      })}
    </GridList>
  )
}

// Proptypes
const { array, func, number } = PropTypes
WordsCategoriesGridPresentation.propTypes = {
  categories: array.isRequired,
  cols: number,
  cellHeight: number,
  onClickTile: func,
}
WordsCategoriesGridPresentation.defaultProps = {
  categories: [],
  cols: 6,
  cellHeight: 160,
  onClickTile: () => {},
}

export default WordsCategoriesGridPresentation
