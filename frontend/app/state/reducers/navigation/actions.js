import {
  NAVIGATE_PAGE,
  CHANGE_SITE_THEME,
  CHANGE_TITLE_PARAMS,
  OVERRIDE_BREADCRUMBS,
  PAGE_PROPERTIES,
  LOAD_GUIDE_STARTED,
  LOAD_GUIDE_SUCCESS,
  LOAD_GUIDE_ERROR,
  LOAD_NAVIGATION_STARTED,
  LOAD_NAVIGATION_SUCCESS,
  LOAD_NAVIGATION_ERROR,
  SET_ROUTE_PARAMS,
} from './actionTypes'

import DirectoryOperations from 'operations/DirectoryOperations'

export const loadGuide = (currentPage, pageMatch) => {
  return (dispatch) => {
    dispatch({ type: LOAD_GUIDE_STARTED, page: pageMatch })

    let currentPageArray = decodeURIComponent(currentPage).split('/')

    // Remove empties
    currentPageArray = currentPageArray.filter(String)

    //console.log('GUIDE MATCH = /' + currentPageArray.join('/') + '/');

    return DirectoryOperations.getDocuments(
      '/FV/Workspaces/SharedData/Guides',
      'FVGuide',
      " AND fvguide:pageMatch LIKE '/" + currentPageArray.join('/') + "/'",
      { 'enrichers.document': '' }
    )
      .then((response) => {
        dispatch({ type: LOAD_GUIDE_SUCCESS, document: response, page: pageMatch })
      })
      .catch((error) => {
        dispatch({ type: LOAD_GUIDE_ERROR, error: error, page: pageMatch })
      })
  }
}

export const loadNavigation = () => {
  return (dispatch) => {
    dispatch({ type: LOAD_NAVIGATION_STARTED })

    return DirectoryOperations.getDocuments(
      '/FV/sections/Site/Resources',
      'FVPage',
      ' AND fvpage:primary_navigation = 1',
      { headers: { properties: 'dublincore,fvpage' } }
    )
      .then((response) => {
        dispatch({ type: LOAD_NAVIGATION_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: LOAD_NAVIGATION_ERROR, error: error })
      })
  }
}

// Request to navigate to a page
export const navigateTo = (path) => {
  return { type: NAVIGATE_PAGE, path }
}

// Change siteTheme
export const changeSiteTheme = (id) => {
  return { type: CHANGE_SITE_THEME, siteTheme: id }
}

export const changeTitleParams = (titleParams) => {
  return { type: CHANGE_TITLE_PARAMS, pageTitleParams: titleParams }
}

export const overrideBreadcrumbs = (breadcrumbs) => {
  return { type: OVERRIDE_BREADCRUMBS, breadcrumbs: breadcrumbs }
}

export const updatePageProperties = (pageProperties) => {
  return { type: PAGE_PROPERTIES, pageProperties }
}

export const setRouteParams = (
  data = {
    matchedPage: undefined,
    matchedRouteParams: undefined,
    search: {},
  }
) => {
  return {
    type: SET_ROUTE_PARAMS,
    ...data,
  }
}
