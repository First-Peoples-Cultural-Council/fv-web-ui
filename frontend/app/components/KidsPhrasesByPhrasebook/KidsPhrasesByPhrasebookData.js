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
import usePhrases from 'dataSources/usePhrases'
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
 * @summary KidsPhrasesByPhrasebookData
 * @description Note: no corresponding KidsPhrasesByPhrasebookPresentation component
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children props.children({computeEntities, items, hasItems, onPaginationUpdate, page, pageSize, resultsCount})
 */
function KidsPhrasesByPhrasebookData({ children }) {
  const [uid, setUid] = useState()
  const { routeParams } = useRoute()
  const { computePortal, cacheComputePortal, fetchPortal } = usePortal()
  const { computeDocument, fetchDocument } = useDocument()
  const { computePhrases, fetchPhrases } = usePhrases()
  const { splitWindowPath, pushWindowPath } = useWindowPath()
  const { searchParams } = useSearch()
  const documentPath = `${routeParams.dialect_path}/Dictionary`
  // on load
  useEffect(() => {
    ProviderHelpers.fetchIfMissing({
      key: `${routeParams.dialect_path}/Portal`,
      action: fetchPortal,
      reducer: computePortal,
      reducerCache: cacheComputePortal,
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
      const { phraseBook, area } = routeParams
      let currentAppliedFilter = ' AND fv:available_in_childrens_archive=1'
      if (phraseBook) {
        // Private
        if (area === 'Workspaces') {
          currentAppliedFilter = ` ${currentAppliedFilter} AND fv-phrase:phrase_books/* IN ("${phraseBook}")`
        }
        // Public
        if (area === 'sections') {
          currentAppliedFilter = ` ${currentAppliedFilter} AND fvproxy:proxied_categories/* IN ("${phraseBook}")`
        }
      }

      const searchObj = getSearchObject()
      // 1st: redux values, 2nd: url search query, 3rd: defaults
      const sortOrder = searchParams.sortOrder || searchObj.sortOrder || 'fv:custom_order'
      const sortBy = searchParams.sortBy || searchObj.sortBy || 'asc'

      let nql = `${currentAppliedFilter}&currentPageIndex=0&pageSize=200&sortOrder=${sortOrder}&sortBy=${sortBy}`

      // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
      nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
      fetchPhrases(uid, nql)
    }
  }, [fetchDocumentAction, routeParams.page, routeParams.pageSize])

  // Extract phrases, prepare data
  const computedPhrases = ProviderHelpers.getEntry(computePhrases, uid)
  const _items = selectn('response.entries', computedPhrases)
  const items = _items
    ? _items.map((item) => {
        const _audio = selectn(['contextParameters', 'phrase', 'related_audio', 0, 'path'], item)
        return {
          title: item.title,
          href: `/${appendPathArrayAfterLandmark({
            pathArray: ['phrases', item.uid],
            splitWindowPath,
            landmarkArray: ['learn'],
          })}`,
          audio: _audio ? `${NavigationHelpers.getBaseURL()}${_audio}` : undefined,
          image: selectn(['contextParameters', 'phrase', 'related_pictures', 0, 'views', 1, 'url'], item),
        }
      })
    : undefined

  // Send out to children
  return children({
    computeEntities: Immutable.fromJS([
      {
        id: uid,
        entity: computePhrases,
        log: 'computePhrases',
      },
    ]),
    items,
    hasItems: items && items.length !== 0,
    onPaginationUpdate: ({ page, pageSize }) => {
      NavigationHelpers.navigate(getNewPaginationUrl({ splitWindowPath, page, pageSize }), pushWindowPath, false)
    },
    page: Number(routeParams.page),
    pageSize: Number(routeParams.pageSize),
    resultsCount: selectn('response.resultsCount', computedPhrases),
  })
}

// PROPTYPES
// -------------------------------------------
const { func } = PropTypes
KidsPhrasesByPhrasebookData.propTypes = {
  children: func.isRequired,
}

export default KidsPhrasesByPhrasebookData
