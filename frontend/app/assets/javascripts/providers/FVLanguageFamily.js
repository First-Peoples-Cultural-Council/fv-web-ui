import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

import thunk from 'redux-thunk';

const fetchLanguageFamily = RESTActions.fetch('FV_LANGUAGE_FAMILY', 'FVLanguageFamily', {headers: {'X-NXenrichers.document': 'ancestry'}});
const fetchLanguageFamilies = RESTActions.query('FV_LANGUAGE_FAMILIES', 'FVLanguageFamily', {headers: {'X-NXenrichers.document': 'ancestry'}});

const actions = {fetchLanguageFamilies, fetchLanguageFamily}

const computeLanguageFamilyQuery = RESTReducers.computeQuery('language_families');
const computeLanguageFamilyFetch = RESTReducers.computeFetch('language_family');

const reducers = {
    computeLanguageFamilies: computeLanguageFamilyQuery.computeLanguageFamilies,
    computeLanguageFamily: computeLanguageFamilyFetch.computeLanguageFamily
};

const middleware = [thunk];

export default {actions, reducers, middleware};