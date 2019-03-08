// Middleware
//import createLoggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';

import ThemeManager from 'material-ui/lib/styles/theme-manager';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import FirstVoicesKidsTheme from 'views/themes/FirstVoicesKidsTheme.js';
import FirstVoicesWorkspaceTheme from 'views/themes/FirstVoicesWorkspaceTheme.js';

import ProviderHelpers from 'common/ProviderHelpers';

import DirectoryOperations from 'operations/DirectoryOperations';

//const loggerMiddleware = createLoggerMiddleware();

// Action constants
const TOGGLE_MENU = 'TOGGLE_MENU';
const NAVIGATE_PAGE = 'NAVIGATE_PAGE';
const CHANGE_THEME = 'CHANGE_THEME';
const CHANGE_TITLE_PARAMS = 'CHANGE_TITLE_PARAMS';
const OVERRIDE_BREADCRUMBS = 'OVERRIDE_BREADCRUMBS';
const PAGE_PROPERTIES = 'PAGE_PROPERTIES';

const LOAD_GUIDE_STARTED = 'LOAD_GUIDE_STARTED';
const LOAD_GUIDE_SUCCESS = 'LOAD_GUIDE_SUCCESS';
const LOAD_GUIDE_ERROR = 'LOAD_GUIDE_ERROR';

const LOAD_NAVIGATION_STARTED = 'LOAD_NAVIGATION_STARTED';
const LOAD_NAVIGATION_SUCCESS = 'LOAD_NAVIGATION_SUCCESS';
const LOAD_NAVIGATION_ERROR = 'LOAD_NAVIGATION_ERROR';

const loadGuide = function loadGuide(currentPage, pageMatch) {
  return function (dispatch) {

    dispatch( { type: LOAD_GUIDE_STARTED, page: pageMatch  } );

    let currentPageArray = decodeURIComponent(currentPage).split('/');

    // Remove empties
    currentPageArray = currentPageArray.filter(String);

    let preparedCurrentPage = pageMatch.matchedPage.get('path').map(function(fragment, i){
      let ANYTHING_BUT_SLASH_REGEX = '/' + ProviderHelpers.regex.ANYTHING_BUT_SLASH.replace('/', '\\/') + '/';
      // Check if path fragment matches ANYTHING_BUT_SLASH regex and replace wildcard.
      if (fragment == ANYTHING_BUT_SLASH_REGEX || fragment.hasOwnProperty('matcher') && fragment.matcher == ANYTHING_BUT_SLASH_REGEX) {
        currentPageArray[i] = '*'
      }
    })
    
    //console.log('GUIDE MATCH = /' + currentPageArray.join('/') + '/');
    
    return DirectoryOperations.getDocuments('/FV/Workspaces/SharedData/Guides', 'FVGuide', ' AND fvguide:pageMatch LIKE \'/' + currentPageArray.join('/') + '/\'', { 'X-NXenrichers.document': '' })
    .then((response) => {
      dispatch( { type: LOAD_GUIDE_SUCCESS, document: response, page: pageMatch } )
    }).catch((error) => {
        dispatch( { type: LOAD_GUIDE_ERROR, error: error, page: pageMatch } )
    });
  }
};

const loadNavigation = function loadNavigation() {
  return function (dispatch) {

    dispatch( { type: LOAD_NAVIGATION_STARTED  } );

    return DirectoryOperations.getDocuments('/FV/sections/Site/Resources', 'FVPage', ' AND fvpage:primary_navigation = 1', {headers: {'X-NXproperties' : 'dublincore,fvpage'}})
    .then((response) => {
      dispatch( { type: LOAD_NAVIGATION_SUCCESS, document: response } )
    }).catch((error) => {
        dispatch( { type: LOAD_NAVIGATION_ERROR, error: error } )
    });
  }
};

/**
* Actions: Represent that something happened, triggered by component or other action
*/
const actions = {
  // Request to navigate to a page
  navigateTo(path) {
    return { type: NAVIGATE_PAGE, path };
  },

  // Request to toggle side-menu
  toggleMenuAction() {
    return { type: TOGGLE_MENU };
  },

  // Change theme
  changeTheme(id) {

    let theme = ThemeManager.getMuiTheme(FirstVoicesTheme);

    switch (id) {
      case 'kids':
        theme = ThemeManager.getMuiTheme(FirstVoicesKidsTheme);
      break;

      case 'workspace':
        theme = ThemeManager.getMuiTheme(FirstVoicesWorkspaceTheme);
      break;
    }

    return { type: CHANGE_THEME, theme: {palette: theme, id: id } }
  },

  changeTitleParams(titleParams) {
    return { type: CHANGE_TITLE_PARAMS, pageTitleParams: titleParams };
  },

  overrideBreadcrumbs(breadcrumbs) {
    return { type: OVERRIDE_BREADCRUMBS, breadcrumbs: breadcrumbs };
  },

  updatePageProperties(pageProperties) {
    return { type: PAGE_PROPERTIES, pageProperties };
  },
  
  loadGuide,
  loadNavigation
}

/**
* Reducers: Handle state changes based on an action.
* Accept current state, return new computed state.
* Reducer must be pure: No mutation, just calculations. See Redux for more info.
*/
const reducers = {

  computeNavigateTo(state = {path: null}, action) {
    switch (action.type) {
      case NAVIGATE_PAGE:
        return Object.assign({}, {path: action.path});
    }

    return state;
  },

  properties(state = null, action) {
    switch (action.type) {
      case CHANGE_THEME:
      	return {
      		...state,
      		theme: action.theme
      	};

      case CHANGE_TITLE_PARAMS:
      	return {
      		...state,
      		pageTitleParams: action.pageTitleParams
        };
        
      case OVERRIDE_BREADCRUMBS:
      return {
        ...state,
        breadcrumbs: action.breadcrumbs
      };

      case PAGE_PROPERTIES: 
      return {
        ...state,
        pageProperties: action.pageProperties
      };

      default:
        return state;
    }
  },

  computeLoadGuide(state = { isFetching: false, page: { matchedPage: null, matchedRouteParams: null }, response: null, success: false }, action) {
    switch (action.type) {
      case LOAD_GUIDE_STARTED:
        return Object.assign({}, state, { isFetching: true, page: action.page });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, page: action.page, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_GUIDE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, page: action.page });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false, page: action.page });
      break;
    }
  },

  computeLoadNavigation(state = { isFetching: false, response: null, success: false }, action) {
    switch (action.type) {
      case LOAD_NAVIGATION_STARTED:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_NAVIGATION_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case LOAD_NAVIGATION_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },

  computeToggleMenuAction(state = {menuVisible: false}, action) {
    switch (action.type) {
      case TOGGLE_MENU:
      	return {
      		...state,
      		menuVisible: !state.menuVisible
      	};

      default:
        return state;
    }
  },
};

function merge (stateProps, dispatchProps, parentProps) {
  return Object.assign(stateProps, dispatchProps, parentProps);
}

const middleware = [/*loggerMiddleware,*/ thunk];

export default { actions, reducers, middleware, merge };