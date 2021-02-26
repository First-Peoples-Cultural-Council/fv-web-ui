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
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import Immutable from 'immutable'

import useCategories from 'dataSources/useCategories'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * @summary PhraseBooksGridData
 * @component
 * @version 1.0.1
 *
 * @param {object} props
 * @param {function} props.children props.children({categories, computeEntities, onClickTile})
 *
 * @see {@link PhraseBooksGridPresentation} for info on the children callback object
 */
function PhraseBooksGridData({ children }) {
  const { computeCategories, fetchCategories } = useCategories()
  const { routeParams } = useRoute()
  const { pushWindowPath } = useWindowPath()
  // Note: Phrasebooks don't have shared 'categories' so no need to do a switch between custom & shared
  const phraseBooksPath = `/api/v1/path/${routeParams.dialect_path}/Phrase Books/@children`

  useEffect(() => {
    fetchCategories(phraseBooksPath)
  }, [])

  const computedCategories = ProviderHelpers.getEntry(computeCategories, phraseBooksPath)
  const categories = (selectn('response.entries', computedCategories) || []).map((category) => {
    return {
      title: category.title,
      href: `/kids${routeParams.dialect_path}/learn/phrases/book/${category.uid}/9/1`,
    }
  })

  // Render
  // ----------------------------------------
  return children({
    routeParams,
    categories,
    computeEntities: Immutable.fromJS([
      {
        id: phraseBooksPath,
        entity: computeCategories,
      },
    ]),
    onClickTile: (url) => {
      NavigationHelpers.navigate(url, pushWindowPath, true)
    },
  })
}

// Proptypes
const { func } = PropTypes
PhraseBooksGridData.propTypes = {
  children: func.isRequired,
}
PhraseBooksGridData.defaultProps = {
  children: () => {},
}

export default PhraseBooksGridData
