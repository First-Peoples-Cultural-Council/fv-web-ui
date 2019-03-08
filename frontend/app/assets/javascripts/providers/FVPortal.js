// Middleware
import thunk from 'redux-thunk';

import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

const updatePortal = RESTActions.update('FV_PORTAL', 'FVPortal', {headers: {'X-NXenrichers.document': 'ancestry,portal'}});
const publishPortal = RESTActions.execute('FV_PORTAL_PUBLISH', 'FVPublish', {headers: {'X-NXenrichers.document': 'ancestry,portal'}});
const unpublishPortal = RESTActions.execute('FV_PORTAL_UNPUBLISH', 'FVUnpublishDialect', {headers: {'X-NXenrichers.document': 'ancestry,portal'}});
const fetchPortal = RESTActions.fetch('FV_PORTAL', 'FVPortal', {headers: {'X-NXenrichers.document': 'ancestry,portal'}});
const fetchPortals = RESTActions.query('FV_PORTALS', 'FVPortal', {headers: {'X-NXenrichers.document': 'ancestry,portal', 'X-NXproperties' : ''}});


const actions = {fetchPortal, fetchPortals, updatePortal, publishPortal, unpublishPortal};

const computePortalQuery = RESTReducers.computeQuery('portals');
const computePortalFactory = RESTReducers.computeFetch('portal');

const reducers = {
    computePortal: computePortalFactory.computePortal,
    computePortals: computePortalQuery.computePortals
};

const middleware = [thunk];

export default {actions, reducers, middleware};