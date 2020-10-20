import { computeDelete, computeFetch, computeQuery } from 'reducers/rest'
import { combineReducers } from 'redux'

const computeGalleryFetchFactory = computeFetch('gallery')
const computeGalleryEntriesQueryFactory = computeQuery('galleries')
const computeGalleryDeleteFactory = computeDelete('delete_gallery')

export const fvGalleryReducer = combineReducers({
  computeGallery: computeGalleryFetchFactory.computeGallery,
  computeGalleries: computeGalleryEntriesQueryFactory.computeGalleries,
  computeDeleteGallery: computeGalleryDeleteFactory.computeDeleteGallery,
})
