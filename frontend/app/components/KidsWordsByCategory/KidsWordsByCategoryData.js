/* Copyright 2016 First People's Cultural Council

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
import { useEffect, useState } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import useDocument from 'dataSources/useDocument'
import useWord from 'dataSources/useWord'
import usePortal from 'dataSources/usePortal'
import useSearch from 'dataSources/useSearch'
import useRoute from 'dataSources/useRoute'

import useWindowPath from 'dataSources/useWindowPath'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, {
  getNewPaginationUrl,
  getSearchObject,
  appendPathArrayAfterLandmark,
} from 'common/NavigationHelpers'

/**
 * @summary KidsWordsByCategoryData
 * @description Used on: /kids/.../learn/words/categories/[CAT_ID], so no need to check shared/custom categories. Note: no corresponding KidsWordsByCategoryPresentation component
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children children({computeEntities, items, hasItems, onPaginationUpdate, page, pageSize, resultsCount})
 */
function KidsWordsByCategoryData({ children }) {
  const [uid, setUid] = useState()
  const { routeParams } = useRoute()
  const { computePortal, fetchPortal } = usePortal()
  const { computeDocument, fetchDocument } = useDocument()
  const { computeWords, fetchWords } = useWord()
  const { splitWindowPath, pushWindowPath } = useWindowPath()
  const { searchParams } = useSearch()
  const documentPath = `${routeParams.dialect_path}/Dictionary`
  // on load
  useEffect(() => {
    ProviderHelpers.fetchIfMissing({
      key: `${routeParams.dialect_path}/Portal`,
      action: fetchPortal,
      reducer: computePortal,
    })
    ProviderHelpers.fetchIfMissing({ key: documentPath, action: fetchDocument, reducer: computeDocument })
  }, [])

  const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, documentPath)
  // Save the uid if we have it
  const _uid = selectn('response.uid', extractComputeDocument)
  if (uid !== _uid) {
    setUid(_uid)
  }

  // Get data when computeDocument finishes or when page/pageSize changes
  const fetchDocumentAction = selectn('action', extractComputeDocument)
  useEffect(() => {
    if (fetchDocumentAction === 'FV_DOCUMENT_FETCH_SUCCESS') {
      let currentAppliedFilter = ''
      if (routeParams.category) {
        // Private
        if (routeParams.area === 'Workspaces') {
          currentAppliedFilter = ` AND fv-word:categories/* IN ("${routeParams.category}")`
        }
        // Public
        if (routeParams.area === 'sections') {
          currentAppliedFilter = ` AND fvproxy:proxied_categories/* IN ("${routeParams.category}")`
        }
      }
      // currentAppliedFilter = `${currentAppliedFilter}`
      currentAppliedFilter = `${currentAppliedFilter} AND fv:available_in_childrens_archive=1`
      const searchObj = getSearchObject()
      // 1st: redux values, 2nd: url search query, 3rd: defaults
      const sortOrder = searchParams.sortOrder || searchObj.sortOrder || 'fv:custom_order'
      const sortBy = searchParams.sortBy || searchObj.sortBy || 'asc'

      let nql = `${currentAppliedFilter}&enrichment=category_children&currentPageIndex=${
        routeParams.page - 1
      }&pageSize=${routeParams.pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`

      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
      fetchWords(uid, nql)
    }
  }, [fetchDocumentAction, routeParams.page, routeParams.pageSize])

  // Extract words, prepare data
  const computedWords = ProviderHelpers.getEntry(computeWords, uid)
  const _items = selectn('response.entries', computedWords)
  const items = _items
    ? _items.map((item) => {
        const _audio = selectn(['contextParameters', 'word', 'related_audio', 0, 'path'], item)
        return {
          title: item.title,
          href: `/${appendPathArrayAfterLandmark({
            pathArray: ['words', item.uid],
            splitWindowPath,
            landmarkArray: ['learn'],
          })}`,
          audio: _audio ? `${NavigationHelpers.getBaseURL()}${_audio}` : undefined,
          image: selectn(['contextParameters', 'word', 'related_pictures', 0, 'views', 1, 'url'], item),
        }
      })
    : undefined

  // Send out to children
  return children({
    computeEntities: Immutable.fromJS([
      {
        id: uid,
        entity: computeWords,
        log: 'computeWords',
      },
    ]),
    items,
    hasItems: items && items.length !== 0,
    onPaginationUpdate: ({ page, pageSize }) => {
      NavigationHelpers.navigate(getNewPaginationUrl({ splitWindowPath, page, pageSize }), pushWindowPath, false)
    },
    page: Number(routeParams.page),
    pageSize: Number(routeParams.pageSize),
    resultsCount: selectn('response.resultsCount', computedWords),
  })
}

// PROPTYPES
// -------------------------------------------
const { func } = PropTypes
KidsWordsByCategoryData.propTypes = {
  children: func.isRequired,
}

export default KidsWordsByCategoryData
