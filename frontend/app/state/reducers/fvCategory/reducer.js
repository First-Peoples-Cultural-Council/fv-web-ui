import { computeFetch, computeQuery } from 'reducers/rest'

import { combineReducers } from 'redux'

import { FV_CATEGORY_CREATE_START, FV_CATEGORY_CREATE_SUCCESS, FV_CATEGORY_CREATE_ERROR } from './actionTypes'

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

// GET
const _computeCategoryFactory = computeFetch('category')
const computeCategory = _computeCategoryFactory.computeCategory

const _computeCategoriesFactory = computeQuery('categories')
const computeCategories = _computeCategoriesFactory.computeCategories

const _computeSharedCategoriesFactory = computeQuery('categories_shared')
const computeSharedCategories = _computeSharedCategoriesFactory.computeCategoriesShared

// CREATE
const computeCreateCategory = (
  state = {
    ...initialState,
    pathOrId: null,
  },
  action
) => {
  switch (action.type) {
    case FV_CATEGORY_CREATE_START:
      return { ...state, isFetching: true, success: false, pathOrId: action.pathOrId }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORY_CREATE_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId }

    // Send modified document to UI without access REST end-point
    case FV_CATEGORY_CREATE_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId }

    default:
      return { ...state, isFetching: false }
  }
}

export const fvCategoryReducer = combineReducers({
  computeSharedCategories,
  computeCategory,
  computeCategories,
  computeCreateCategory,
})
