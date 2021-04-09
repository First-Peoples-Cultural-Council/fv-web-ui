import { execute, fetch, query, update } from 'reducers/rest'

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
