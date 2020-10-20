import { create, _delete, execute, fetch, query, update } from 'providers/redux/reducers/rest'

export const fetchGallery = fetch('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const fetchGalleries = query('FV_GALLERIES', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const createGallery = create('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const updateGallery = update(
  'FV_GALLERY',
  'FVGallery',
  { headers: { 'enrichers.document': 'ancestry,gallery,permissions' } },
  false
)
export const deleteGallery = _delete('FV_GALLERY', 'FVGallery', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishGallery = execute('FV_GALLERY_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const unpublishGallery = execute('FV_GALLERY_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const enableGallery = execute('FV_GALLERY_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const disableGallery = execute('FV_GALLERY_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
