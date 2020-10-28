import { execute } from 'reducers/rest'
// A document ID is expected as an arg for these actions

export const updateVisibility = execute('FV_UPDATE_VISIBILITY', 'Document.UpdateVisibilityOperation', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
