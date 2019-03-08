import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

import thunk from 'redux-thunk';

const fetchLanguage = RESTActions.fetch('FV_LANGUAGE', 'FVLanguage', {headers: {'X-NXenrichers.document': 'ancestry'}});
const fetchLanguages = RESTActions.query('FV_LANGUAGES', 'FVLanguage', {headers: {'X-NXenrichers.document': 'ancestry'}});

const actions = {fetchLanguages, fetchLanguage};

const computeLanguageFetch = RESTReducers.computeFetch('language');
const computeLanguageQuery = RESTReducers.computeQuery('languages');

const reducers = {
    computeLanguages: computeLanguageQuery.computeLanguages,
    computeLanguage: computeLanguageFetch.computeLanguage
};

const middleware = [thunk];

export default {actions, reducers, middleware};