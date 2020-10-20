// Porting code from old library:
// https://github.com/loggur/provide-page/blob/6d4244e32d22ebb2b4b2a7e6ff148b9d7f134e0c/src/index.js
import { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH, UPDATE_WINDOW_PATH } from './actionTypes'
import { splitPath } from './helpers'

// Note: _noRender is used in the createMiddleware file. Not certain at the moment if needed.
// https://github.com/loggur/provide-page/blob/6d4244e32d22ebb2b4b2a7e6ff148b9d7f134e0c/src/createMiddleware.js
const _noRender = true

export const pushWindowPath = (windowPath = '') => {
  const windowPathSplit = splitPath(windowPath)

  return { type: PUSH_WINDOW_PATH, windowPath, windowPathSplit, _noRender }
}
export const updateWindowPath = (windowPath = '') => {
  const windowPathSplit = splitPath(windowPath)

  return { type: UPDATE_WINDOW_PATH, windowPath, windowPathSplit, _noRender }
}
export const replaceWindowPath = (windowPath = '') => {
  const windowPathSplit = splitPath(windowPath)

  return {
    type: REPLACE_WINDOW_PATH,
    windowPath,
    windowPathSplit,
    _noRender,
  }
}
