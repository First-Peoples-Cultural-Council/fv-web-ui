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
import {useEffect, useState} from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
// import PropTypes from 'prop-types'

import useDocument from 'DataSource/useDocument'
import useListView from 'DataSource/useListView'
import usePhrases from 'DataSource/usePhrases'
import usePortal from 'DataSource/usePortal'
import useSearch from 'DataSource/useSearch'
import useProperties from 'DataSource/useProperties'
import useRoute from 'DataSource/useRoute'
import useSearchDialect from 'DataSource/useSearchDialect'
import useWindowPath from 'DataSource/useWindowPath'
// =========================================================
import Immutable, { is, Set, Map } from 'immutable'
import selectn from 'selectn'


// FPCC
// -------------------------------------------
import IntlService from 'views/services/intl'
import { getSearchObject } from 'common/NavigationHelpers'

import {
  updateFilter,
  updateUrlAfterResetSearch,
  updateUrlIfPageOrPageSizeIsDifferent,
  useIdOrPathFallback,
  getURLPageProps,
} from 'views/pages/explore/dialect/learn/base'

const intl = IntlService.instance

// KidsPhrasesByCategoryData
// ====================================================
/**
 * @summary KidsPhrasesByCategoryData
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {function} props.children Render prop technique. Assumes children will be a function, eg: children({ ... })
 *
 * @returns {object} output = { temp }
 * @returns {function} output.temp
 */
function KidsPhrasesByCategoryData({children}) {
  const [filterInfo, setFilterInfo] = useState()
  const [uid, setUid] = useState()
  const { routeParams } = useRoute()
  const { computePortal, fetchPortal } = usePortal()
  const { computeDocument, fetchDocument } = useDocument()
  const { computePhrases, fetchPhrases} = usePhrases()
  const { properties } = useProperties()
  const { setListViewMode, listView } = useListView()
  const { splitWindowPath, pushWindowPath} = useWindowPath()
  const { computeSearchDialect, searchDialectReset } = useSearchDialect()
  const { searchParams } = useSearch()

  // on load
  useEffect(() => {
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Portal`, fetchPortal, computePortal)
    ProviderHelpers.fetchIfMissing(`${routeParams.dialect_path}/Dictionary`, fetchDocument, computeDocument)

    let _filterInfo = initialFilterInfo()
    // If no filters are applied via URL, use props
    if (_filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn(
        [[`${routeParams.area}_${routeParams.dialect_name}_learn_phrases`], 'filterInfo'],
        properties.pageProperties
      )
      if (pagePropertiesFilterInfo) {
        _filterInfo = pagePropertiesFilterInfo
      }
    }
    setFilterInfo(_filterInfo)

    return ()=>{
      // on unmount
      searchDialectReset()
    }
  }, [])

  // Get data when initial fetchIfMissing finishes or when page/pageSize changes
  const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
  const curFetchDocumentAction = selectn('action', extractComputeDocument)
  useEffect(() => {
    if (curFetchDocumentAction === 'FV_DOCUMENT_FETCH_SUCCESS') {
      const _uid = selectn('response.uid', extractComputeDocument)
      setUid(_uid)
      fetchListViewData({ pageIndex: routeParams.page, pageSize: routeParams.pageSize, dialectUid: _uid })
    }
  }, [curFetchDocumentAction, routeParams.page, routeParams.pageSize])


  const DEFAULT_SORT_COL = 'fv:custom_order' // NOTE: Used when paging
  const DEFAULT_SORT_TYPE = 'asc'


  const onChangeFilter = () => {
    const { searchByMode, searchNxqlQuery } = computeSearchDialect

    const newFilter = updateFilter({
      filterInfo,
      searchByMode,
      searchNxqlQuery,
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(filterInfo, newFilter) === false) {
      setFilterInfo(newFilter)

      updateUrlIfPageOrPageSizeIsDifferent({
        preserveSearch: true,
        pushWindowPath,
        routeParams,
        splitWindowPath,
      })
    }
  }

  const fetchListViewData = ({ pageIndex = 1, pageSize = 10, dialectUid } = {}) => {
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
    const sortOrder = searchParams.sortOrder || searchObj.sortOrder || DEFAULT_SORT_TYPE
    const sortBy = searchParams.sortBy || searchObj.sortBy || DEFAULT_SORT_COL

    let nql = `${currentAppliedFilter}&currentPageIndex=${pageIndex -
        1}&pageSize=${pageSize}&sortOrder=${sortOrder}&sortBy=${sortBy}`

    // WORKAROUND: DY @ 17-04-2019 - Mark this query as a "starts with" query. See DirectoryOperations.js for note
    nql = `${nql}${ProviderHelpers.isStartsWithQuery(currentAppliedFilter)}`
    fetchPhrases(dialectUid, nql)
  }

  const initialFilterInfo = () => {
    const routeParamsCategory = routeParams.phraseBook
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-phrase:phrase_books',
      routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        phraseBook: currentAppliedFilterCategories,
      }),
    })
  }

  //   resetSearch = () => {
  //     let newFilter = this.state.filterInfo // TODO
  //     newFilter = newFilter.set('currentAppliedFilter', new Map())
  //     newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())
  //     newFilter = newFilter.set('currentCategoryFilterIds', new Set())

  //     this.setState( // TODO
  //       {
  //         filterInfo: newFilter,
  //       },
  //       () => {
  //         updateUrlAfterResetSearch({
  //           routeParams: routeParams,
  //           splitWindowPath: this.props.splitWindowPath, // TODO
  //           pushWindowPath,
  //           urlAppend: `/${routeParams.pageSize}/1`,
  //         })
  //       }
  //     )
  //   }

  // const {
  //   computeEntities,
  //   filterInfo,
  // } = this.state

  // const { computeDocument, computePortal, routeParams } = this.props

  // const computedPortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
  // const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computedPortal) ||
  //   ''} ${intl.trans('phrases', 'Phrases', 'first')}`

  // const { searchByMode, searchNxqlSort } = this.props.computeSearchDialect
  // const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort
  // const { DEFAULT_PAGE } = getURLPageProps({ routeParams })

  // const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
  // const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)

  // const phraseListView = dialectUid ? (
  //   <PhraseListView
  //     DEFAULT_PAGE_SIZE={8}
  //     disablePageSize
  //     filter={filterInfo.setIn(['currentAppliedFilter', 'kids'], ' AND fv:available_in_childrens_archive=1')}
  //     gridListView
  //     gridCols={2}
  //     controlViaURL
  //     DEFAULT_PAGE={DEFAULT_PAGE}
  //     DEFAULT_SORT_COL={DEFAULT_SORT_COL}
  //     DEFAULT_SORT_TYPE={DEFAULT_SORT_TYPE}
  //     disableClickItem={false}
  //     flashcard={this.state.flashcardMode}
  //     flashcardTitle={pageTitle}
  //     // TODO
  //     onPagePropertiesChange={this._handlePagePropertiesChange} // NOTE: This function is in PageDialectLearnBase
  //     parentID={selectn('response.uid', computeDocument)}
  //     dialectID={dialectUid}
  //     routeParams={this.props.routeParams}
  //     // Search:
  //     handleSearch={onChangeFilter}
  //     resetSearch={this.resetSearch}
  //     hasSearch
  //     searchUi={[
  //       {
  //         defaultChecked: true,
  //         idName: 'searchByTitle',
  //         labelText: 'Phrase',
  //       },
  //       {
  //         defaultChecked: true,
  //         idName: 'searchByDefinitions',
  //         labelText: 'Definitions',
  //       },
  //       {
  //         idName: 'searchByCulturalNotes',
  //         labelText: 'Cultural notes',
  //       },
  //     ]}
  //     searchByMode={searchByMode}
  //     // TODO
  //     rowClickHandler={this.props.rowClickHandler}
  //     // TODO
  //     hasSorting={this.props.hasSorting}
  //     dictionaryListClickHandlerViewMode={setListViewMode}
  //     dictionaryListViewMode={listView.mode}
  //   />
  // ) : null

  const computedPhrases = ProviderHelpers.getEntry(computePhrases, uid)
  const items = selectn('response.entries', computedPhrases)
  return children({
    computeEntities: Immutable.fromJS([
      {
        id: routeParams.dialect_path,
        entity: computePortal,
      },
      {
        id: `${routeParams.dialect_path}/Dictionary`,
        entity: computeDocument,
      },
    ]),
    filterInfo,
    items,
    resultsCount: (items || [] ).length,
  })
}

// PROPTYPES
// -------------------------------------------
// const { any, bool } = PropTypes
// KidsPhrasesByCategoryData.propTypes = {

// }
// KidsPhrasesByCategoryData.defaultProps = {
// }

export default KidsPhrasesByCategoryData
