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
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useRoute from 'DataSource/useRoute'
import useWindowPath from 'DataSource/useWindowPath'
import useCategoriesCustomOrShared from 'common/useCategoriesCustomOrShared'
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * @summary WordsCategoriesGridData
 * @component
 * @version 1.0.1
 *
 * @param {object} props
 * @param {function} props.children props.children({ categories, computeEntities, onClickTile })
 *
 * @see {@link WordsCategoriesGridPresentation} for info on the children callback object
 */
function WordsCategoriesGridData({ children }) {
  const { routeParams } = useRoute()
  const { pushWindowPath } = useWindowPath()
  const { categories: _categories, computeEntities } = useCategoriesCustomOrShared()

  const categories = (_categories || []).map((category) => {
    return {
      title: category.title,
      href: `/kids${routeParams.dialect_path}/learn/words/categories/${category.uid}`,
      image: selectn(['properties', 'file:content', 'data'], category),
    }
  })

  // Render
  // ----------------------------------------
  return children({
    categories,
    computeEntities,
    onClickTile: (url) => {
      NavigationHelpers.navigate(url, pushWindowPath, true)
    },
  })
}

// Proptypes
const { func } = PropTypes
WordsCategoriesGridData.propTypes = {
  children: func.isRequired,
}
WordsCategoriesGridData.defaultProps = {
  children: () => {},
}

export default WordsCategoriesGridData
