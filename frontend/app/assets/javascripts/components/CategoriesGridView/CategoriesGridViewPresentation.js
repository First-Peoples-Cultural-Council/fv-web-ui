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
import { Cover } from 'components/svg/cover'
import '!style-loader!css-loader!./CategoriesGridView.css'

/**
 * @summary CategoriesGridViewPresentation
 * @component
 * @version 1.0.1
 *
 * @prop {object} props
 * @prop {node} props.children
 * @prop {array} props.categories
 * @prop {function} props.onClickTile event handler when tile is clicked
 * @prop {number} [props.cols] defaults to 6
 * @prop {number} [props.cellHeight] defaults to 160
 *
 * @returns {node} jsx markup
 */
function CategoriesGridViewPresentation({ categories, cols, cellHeight, onClickTile }) {
  return (
    <GridList cols={cols} cellHeight={cellHeight} id="CategoriesGridViewPresentation">
      {categories.map((category, index) => {
        return (
          <GridListTile
            onClick={() => {
              onClickTile(category.href)
            }}
            key={`category${index}`}
          >
            <Cover />
            <GridListTileBar title={category.text} className="CategoriesGridViewTileBar" />
          </GridListTile>
        )
      })}
    </GridList>
  )
}

// Proptypes
const { array, func, number } = PropTypes
CategoriesGridViewPresentation.propTypes = {
  categories: array.isRequired,
  cols: number,
  cellHeight: number,
  onClickTile: func,
}
CategoriesGridViewPresentation.defaultProps = {
  categories: [],
  cols: 6,
  cellHeight: 160,
}

export default CategoriesGridViewPresentation
