import { execute, fetch, query, update } from 'providers/redux/reducers/rest'

export const fetchResource = fetch('FV_RESOURCE', 'FVPicture,FVAudio,FVVideo', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const fetchResources = query('FV_RESOURCES', 'FVPicture,FVAudio,FVVideo', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const updateResource = update(
  'FV_RESOURCE',
  'FVPicture,FVAudio,FVVideo',
  { headers: { 'enrichers.document': 'ancestry,media,permissions' } },
  false
)

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishResource = execute('FV_RESOURCE_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToPublishResource = execute('FV_RESOURCE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const unpublishResource = execute('FV_RESOURCE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToUnpublishResource = execute('FV_RESOURCE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const enableResource = execute('FV_RESOURCE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToEnableResource = execute('FV_RESOURCE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const disableResource = execute('FV_RESOURCE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToDisableResource = execute('FV_RESOURCE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
