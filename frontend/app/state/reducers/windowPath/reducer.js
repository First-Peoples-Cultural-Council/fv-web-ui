import { combineReducers } from 'redux'
import { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH, UPDATE_WINDOW_PATH } from './actionTypes'
import { splitPath, canUseDOM } from './helpers'

export const _windowPath = (state = window.location.pathname, action = {}) => {
  // NOTE: dropping any window.location.search params
  const newWindowPath = action.windowPath ? action.windowPath : window.location.pathname
  const newWindowPathSplit = newWindowPath.split('?')

  switch (action.type) {
    case PUSH_WINDOW_PATH:
      if (canUseDOM) {
        window.history.pushState(action, document.title, action.windowPath)
      }
      return newWindowPathSplit[0]

    case REPLACE_WINDOW_PATH:
      if (canUseDOM) {
        window.history.replaceState(action, document.title, action.windowPath)
      }
      return newWindowPathSplit[0]

    case UPDATE_WINDOW_PATH:
      return newWindowPathSplit[0]

    default:
      return state
  }
}

export const splitWindowPath = (state = splitPath(window.location.pathname), action = {}) => {
  switch (action.type) {
    case PUSH_WINDOW_PATH: // NOTE: intentional fallthrough
    case REPLACE_WINDOW_PATH: // NOTE: intentional fallthrough
    case UPDATE_WINDOW_PATH: // NOTE: intentional fallthrough
      // NOTE: dropping search param in last slot, eg: `4?sortBy=dc:description&sortOrder=asc`
      action.windowPathSplit[action.windowPathSplit.length - 1] = action.windowPathSplit[
        action.windowPathSplit.length - 1
      ].split('?')[0]
      return action.windowPathSplit

    default:
      return state
  }
}

export const windowPathReducer = combineReducers({
  splitWindowPath,
  _windowPath,
})
