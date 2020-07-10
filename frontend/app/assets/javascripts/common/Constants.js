/*
import {
  //...
} from 'common/Constants'
*/
export const STATE_LOADING = 0 // component is loading (eg: getting data) or busy (eg: submitting data)
export const STATE_DEFAULT = 1 // initial, loaded state, eg: displaying a form
export const STATE_ERROR = 2 // component is not happy, ie: form validation (not .js errors)
export const STATE_SUCCESS = 3 // component is happy, ie: form submitted
export const STATE_SUCCESS_DELETE = 5 // desctructive action has succeeded
export const STATE_ERROR_BOUNDARY = 4 // component has triggered a .js error or is completely messed up

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 100
export const DEFAULT_LANGUAGE = 'english'
export const DEFAULT_SORT_COL = 'dc:title'
export const DEFAULT_SORT_TYPE = 'asc'

export const WORKSPACES = 'Workspaces'
export const SECTIONS = 'sections'

export const CONTENT_FULL_WIDTH = 1

export const UNKNOWN = 0
export const WORD = 1
export const PHRASE = 2
export const SONG = 3
export const STORY = 4
