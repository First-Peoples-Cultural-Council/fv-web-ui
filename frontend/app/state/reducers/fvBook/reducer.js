import {
  DISMISS_ERROR,
  FV_BOOK_ENTRIES_FETCH_START,
  FV_BOOK_ENTRIES_FETCH_SUCCESS,
  FV_BOOK_ENTRIES_FETCH_ERROR,
  FV_BOOKS_SHARED_FETCH_START,
  FV_BOOKS_SHARED_FETCH_SUCCESS,
  FV_BOOKS_SHARED_FETCH_ERROR,
  FV_BOOK_FETCH_ALL_START,
  FV_BOOK_FETCH_ALL_SUCCESS,
  FV_BOOK_FETCH_ALL_ERROR,
  FV_STORIES_USER_MODIFIED_QUERY_START,
  FV_STORIES_USER_MODIFIED_QUERY_SUCCESS,
  FV_STORIES_USER_MODIFIED_QUERY_ERROR,
  FV_STORIES_USER_CREATED_QUERY_START,
  FV_STORIES_USER_CREATED_QUERY_SUCCESS,
  FV_STORIES_USER_CREATED_QUERY_ERROR,
  FV_SONGS_USER_MODIFIED_QUERY_START,
  FV_SONGS_USER_MODIFIED_QUERY_SUCCESS,
  FV_SONGS_USER_MODIFIED_QUERY_ERROR,
  FV_SONGS_USER_CREATED_QUERY_START,
  FV_SONGS_USER_CREATED_QUERY_SUCCESS,
  FV_SONGS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

import { computeFetch, computeDelete, computeQuery } from 'reducers/rest'
import { combineReducers } from 'redux'

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

const computeBookFetchFactory = computeFetch('book')
const computeBookDeleteFactory = computeDelete('delete_book')
const computeBookEntryFetchFactory = computeFetch('book_entry')
const computeBookEntriesQueryFactory = computeQuery('book_entries')
const computeBooksQueryFactory = computeQuery('books')
const computeRecentlyModifiedStoriesQuery = computeQuery('modified_stories')
const computeRecentlyCreatedStoriesQuery = computeQuery('created_stories')
const computeRecentlyModifiedSongsQuery = computeQuery('modified_songs')
const computeRecentlyCreatedSongsQuery = computeQuery('created_songs')

const computeBook = computeBookFetchFactory.computeBook
const computeDeleteBook = computeBookDeleteFactory.computeDeleteBook
const computeBookEntry = computeBookEntryFetchFactory.computeBookEntry
const computeBookEntries = computeBookEntriesQueryFactory.computeBookEntries
const computeBooks = computeBooksQueryFactory.computeBooks

const computeSharedBooks = (state = initialState, action) => {
  switch (action.type) {
    case FV_BOOKS_SHARED_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_BOOKS_SHARED_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_BOOKS_SHARED_FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeBookEntriesInPath = (state = initialState, action) => {
  switch (action.type) {
    case FV_BOOK_ENTRIES_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_BOOK_ENTRIES_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_BOOK_ENTRIES_FETCH_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error }

    default:
      return { ...state, isFetching: false }
  }
}

const computeBooksAll = (state = initialState, action) => {
  switch (action.type) {
    case FV_BOOK_FETCH_ALL_START:
      return { ...state, isFetching: true, success: false }

    case FV_BOOK_FETCH_ALL_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    case FV_BOOK_FETCH_ALL_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeModifiedStories = computeRecentlyModifiedStoriesQuery.computeModifiedStories
const computeCreatedStories = computeRecentlyCreatedStoriesQuery.computeCreatedStories
const computeModifiedSongs = computeRecentlyModifiedSongsQuery.computeModifiedSongs
const computeCreatedSongs = computeRecentlyCreatedSongsQuery.computeCreatedSongs

const computeUserModifiedStories = (state = initialState, action) => {
  switch (action.type) {
    case FV_STORIES_USER_MODIFIED_QUERY_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_STORIES_USER_MODIFIED_QUERY_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_STORIES_USER_MODIFIED_QUERY_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeUserCreatedStories = (state = initialState, action) => {
  switch (action.type) {
    case FV_STORIES_USER_CREATED_QUERY_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_STORIES_USER_CREATED_QUERY_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_STORIES_USER_CREATED_QUERY_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeUserModifiedSongs = (state = initialState, action) => {
  switch (action.type) {
    case FV_SONGS_USER_MODIFIED_QUERY_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_SONGS_USER_MODIFIED_QUERY_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_SONGS_USER_MODIFIED_QUERY_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeUserCreatedSongs = (state = initialState, action) => {
  switch (action.type) {
    case FV_SONGS_USER_CREATED_QUERY_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_SONGS_USER_CREATED_QUERY_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_SONGS_USER_CREATED_QUERY_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

export const fvBookReducer = combineReducers({
  computeBookFetchFactory,
  computeBookDeleteFactory,
  computeBookEntryFetchFactory,
  computeBookEntriesQueryFactory,
  computeBooksQueryFactory,
  computeRecentlyModifiedStoriesQuery,
  computeRecentlyCreatedStoriesQuery,
  computeRecentlyModifiedSongsQuery,
  computeRecentlyCreatedSongsQuery,
  computeBook,
  computeDeleteBook,
  computeBookEntry,
  computeBookEntries,
  computeBooks,
  computeSharedBooks,
  computeBookEntriesInPath,
  computeBooksAll,
  computeModifiedStories,
  computeCreatedStories,
  computeModifiedSongs,
  computeCreatedSongs,
  computeUserModifiedStories,
  computeUserCreatedStories,
  computeUserModifiedSongs,
  computeUserCreatedSongs,
})
