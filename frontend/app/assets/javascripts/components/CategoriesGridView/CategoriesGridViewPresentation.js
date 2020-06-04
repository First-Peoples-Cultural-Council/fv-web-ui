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
function CategoriesGridViewPresentation(props) {
  let toRender = null
  if (props.categories.length === 0) {
    toRender = <div>no categories</div>
  } else {
    toRender = props.categories.map((category, index) => {
      return (
        <div key={index}>
          <h2>{category.text}</h2>
        </div>
      )
    })
  }
  // Render
  // ----------------------------------------
  return (
    <div>
      <h1>CategoriesGridViewPresentation</h1>
      {toRender}
    </div>
  )
}

// Proptypes
const { array } = PropTypes
CategoriesGridViewPresentation.propTypes = {
  categories: array.isRequired,
}
CategoriesGridViewPresentation.defaultProps = {
  categories: [],
}

export default CategoriesGridViewPresentation
