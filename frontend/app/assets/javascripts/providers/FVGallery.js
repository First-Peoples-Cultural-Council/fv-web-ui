import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

const fetchGallery = RESTActions.fetch('FV_GALLERY', 'FVGallery', {headers: {'X-NXenrichers.document': 'ancestry,gallery,permissions'}});
const fetchGalleries = RESTActions.query('FV_GALLERIES', 'FVGallery', {headers: {'X-NXenrichers.document': 'ancestry,gallery,permissions'}});
const createGallery = RESTActions.create('FV_GALLERY', 'FVGallery', {headers: {'X-NXenrichers.document': 'ancestry,gallery,permissions'}});
const updateGallery = RESTActions.update('FV_GALLERY', 'FVGallery', {headers: {'X-NXenrichers.document': 'ancestry,gallery,permissions'}}, false);
const deleteGallery = RESTActions.delete('FV_GALLERY', 'FVGallery', {});

const publishGallery = RESTActions.execute('FV_GALLERY_PUBLISH', 'FVPublish', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const askToPublishGallery = RESTActions.execute('FV_GALLERY_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const unpublishGallery = RESTActions.execute('FV_GALLERY_UNPUBLISH', 'FVUnpublishDialect', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const askToUnpublishGallery = RESTActions.execute('FV_GALLERY_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const enableGallery = RESTActions.execute('FV_GALLERY_ENABLE', 'FVEnableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const askToEnableGallery = RESTActions.execute('FV_GALLERY_ENABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const disableGallery = RESTActions.execute('FV_GALLERY_DISABLE', 'FVDisableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});
const askToDisableGallery = RESTActions.execute('FV_GALLERY_DISABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,gallery'}});

const actions = {
    fetchGallery,
    updateGallery,
    fetchGalleries,
    createGallery,
    deleteGallery,
    publishGallery,
    askToPublishGallery,
    unpublishGallery,
    askToUnpublishGallery,
    enableGallery,
    askToEnableGallery,
    disableGallery,
    askToDisableGallery
};

const computeGalleryFetchFactory = RESTReducers.computeFetch('gallery');
const computeGalleryEntriesQueryFactory = RESTReducers.computeQuery('galleries');
const computeGalleryDeleteFactory = RESTReducers.computeDelete('delete_gallery');

const reducers = {
    computeGallery: computeGalleryFetchFactory.computeGallery,
    computeGalleries: computeGalleryEntriesQueryFactory.computeGalleries,
    computeDeleteGallery: computeGalleryDeleteFactory.computeDeleteGallery
};

const middleware = [thunk];

export default {actions, reducers, middleware};