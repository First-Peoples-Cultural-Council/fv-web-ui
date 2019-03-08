import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchResource = RESTActions.fetch('FV_RESOURCE', 'FVPicture,FVAudio,FVVideo', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const fetchResources = RESTActions.query('FV_RESOURCES', 'FVPicture,FVAudio,FVVideo', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const updateResource = RESTActions.update('FV_RESOURCE', 'FVPicture,FVAudio,FVVideo', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}}, false);

const publishResource = RESTActions.execute('FV_RESOURCE_PUBLISH', 'FVPublish', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const askToPublishResource = RESTActions.execute('FV_RESOURCE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const unpublishResource = RESTActions.execute('FV_RESOURCE_UNPUBLISH', 'FVUnpublishDialect', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const askToUnpublishResource = RESTActions.execute('FV_RESOURCE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const enableResource = RESTActions.execute('FV_RESOURCE_ENABLE', 'FVEnableDocument', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const askToEnableResource = RESTActions.execute('FV_RESOURCE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const disableResource = RESTActions.execute('FV_RESOURCE_DISABLE', 'FVDisableDocument', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});
const askToDisableResource = RESTActions.execute('FV_RESOURCE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,media,permissions'}});

const computeResourceFetchFactory = RESTReducers.computeFetch('resource');
const computeResourcesQueryFactory = RESTReducers.computeQuery('resources');

const computeResourceEnableOperationFactory = RESTReducers.computeOperation('resource_enable_workflow');
const computeResourceDisableOperationFactory = RESTReducers.computeOperation('resource_disable_workflow');

const actions = {
    fetchResources,
    fetchResource,
    updateResource,
    publishResource,
    askToPublishResource,
    unpublishResource,
    askToUnpublishResource,
    enableResource,
    askToEnableResource,
    disableResource,
    askToDisableResource
};

const reducers = {
    computeResource: computeResourceFetchFactory.computeResource,
    computeResources: computeResourcesQueryFactory.computeResources,
    computeResourceEnableWorkflow: computeResourceEnableOperationFactory.computeResourceEnableWorkflow,
    computeResourceDisableWorkflow: computeResourceDisableOperationFactory.computeResourceDisableWorkflow
};

const middleware = [thunk];

export default {actions, reducers, middleware};