import { useEffect } from 'react'
import useCategories from 'dataSources/useCategories'
import useRoute from 'dataSources/useRoute'
import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import Immutable from 'immutable'
/**
 * @summary useCategoriesCustomOrShared
 * @description Custom hook that returns categories. Dialect specific if exists, shared if they don't
 * @version 1.0.1
 *
 * @component
 *
 * @param {boolean} fetchLatest When true, will always send a request to get category data instead of relying on fetchIfMissing (which could be stale after an edit)
 *
 * @returns {object} object
 * @returns {array} object.categories
 * @returns {array} object.computeEntities Immutable list, used with PromiseWrapper
 */
function useCategoriesCustomOrShared(fetchLatest = false) {
  const { computeCategories, fetchCategories, computeSharedCategories, fetchSharedCategories } = useCategories()
  const { routeParams } = useRoute()
  const catPath = `/api/v1/path/${routeParams.dialect_path}/Categories/@children`
  const sharedCatPath = `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
  const categories = ProviderHelpers.getEntry(computeCategories, catPath)
  const sharedCategories = ProviderHelpers.getEntry(computeSharedCategories, sharedCatPath)
  const categoriesInProgress = selectn('action', categories) === 'FV_CATEGORIES_QUERY_START'
  const sharedCategoriesInProgress = selectn('action', sharedCategories) === 'FV_CATEGORIES_SHARED_QUERY_START'
  const categoriesSuccess = selectn('action', categories) === 'FV_CATEGORIES_QUERY_SUCCESS'
  const sharedCategoriesSuccess = selectn('action', sharedCategories) === 'FV_CATEGORIES_SHARED_QUERY_SUCCESS'
  const categoriesEntries = selectn('response.entries', categories)
  const sharedCategoriesEntries = selectn('response.entries', sharedCategories)
  useEffect(() => {
    // Fetch dialect specific categories
    if (!categoriesInProgress) {
      if (fetchLatest === true) {
        fetchCategories(catPath)
      } else {
        ProviderHelpers.fetchIfMissing(catPath, fetchCategories, computeCategories)
      }
    }
    if (!sharedCategoriesInProgress) {
      ProviderHelpers.fetchIfMissing(sharedCatPath, fetchSharedCategories, computeSharedCategories)
    }
  }, [])

  let _categories = []
  if (categoriesInProgress === false) {
    if (categoriesSuccess) {
      if (categoriesEntries.length > 0) {
        _categories = categoriesEntries
      }
      if (categoriesEntries.length === 0 && sharedCategoriesSuccess) {
        _categories = sharedCategoriesEntries
      }
    }
  }
  return {
    categories: _categories,
    computeEntities: Immutable.fromJS([
      {
        id: catPath,
        entity: computeCategories,
      },
      {
        id: sharedCatPath,
        entity: computeSharedCategories,
      },
    ]),
  }
}

export default useCategoriesCustomOrShared
