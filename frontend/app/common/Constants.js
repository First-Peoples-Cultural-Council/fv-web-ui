export const STATE_LOADING = 0 // component is loading (eg: getting data) or busy (eg: submitting data)
export const STATE_DEFAULT = 1 // initial, loaded state, eg: displaying a form
export const STATE_ERROR = 2 // component is not happy, ie: form validation (not .js errors)
export const STATE_SUCCESS = 3 // component is happy, ie: form submitted
export const STATE_SUCCESS_DELETE = 5 // destructive action has succeeded
export const STATE_ERROR_BOUNDARY = 4 // component has triggered a .js error or is completely messed up

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 100
export const DEFAULT_LANGUAGE = 'english'
export const DEFAULT_SORT_COL = 'dc:title'
export const DEFAULT_SORT_TYPE = 'asc'

export const WORKSPACES = 'Workspaces'
export const SECTIONS = 'sections'

export const UNKNOWN = 0
export const WORD = 1
export const PHRASE = 2
export const SONG = 3
export const STORY = 4
export const BOOK = 5

export const EVEN = 0
export const ODD = 1

export const URL_QUERY_PLACEHOLDER = 'first'

export const TABLE_FULL_WIDTH = 1
export const TABLEPAGINATION_DIV = 'TABLEPAGINATION_DIV'
export const WIDGET_WORKSPACE = 'WIDGET_WORKSPACE'

// --- Search ---
export const SEARCH_PART_OF_SPEECH_ANY = 'Any'
export const SEARCH_FILTERED_BY = 5
export const SEARCH_FILTERED_BY_CHARACTER = `${SEARCH_FILTERED_BY}.1`
export const SEARCH_FILTERED_BY_CATEGORY = `${SEARCH_FILTERED_BY}.2`
export const SEARCH_FILTERED_BY_PHRASE_BOOK = `${SEARCH_FILTERED_BY}.3`
// searchByMode CONSTANTS
export const SEARCH_BY_DEFAULT = 0 // TODO: REFACTOR TO DROP THIS
export const SEARCH_BY_CUSTOM = 3 // TODO: DROP THIS AFTER `app/components/__SearchDialect/SearchDialect.js` IS OBSOLETE

// USED WHEN SEARCHING ON DIFFERENT PAGES, EG: PHRASES VS WORDS
// GENERATES DIFFERENT UI TEXT
export const SEARCH_DATA_TYPE_PHRASE = 5
export const SEARCH_DATA_TYPE_WORD = 6

export const SEARCH_TYPE_APPROXIMATE_SEARCH = 'approx'
export const SEARCH_TYPE_EXACT_SEARCH = 'exact'
export const SEARCH_TYPE_CONTAINS_SEARCH = 'contains'
export const SEARCH_TYPE_STARTS_WITH_SEARCH = 'starts_with'
export const SEARCH_TYPE_ENDS_WITH_SEARCH = 'ends_with'
export const SEARCH_TYPE_WILDCARD_SEARCH = 'wildcard'
export const SEARCH_TYPE_DEFAULT_SEARCH = 'match'
export const SEARCH_TYPE_DEFAULT = SEARCH_TYPE_DEFAULT_SEARCH

export const SEARCHDIALECT_CHECKBOX = 'SEARCHDIALECT_CHECKBOX'
export const SEARCHDIALECT_SELECT = 'SEARCHDIALECT_SELECT'
