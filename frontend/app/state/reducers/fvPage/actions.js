import { create, _delete, execute, query, update } from 'reducers/rest'

export const queryPage = query('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const createPage = create('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const updatePage = update('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const deletePage = _delete('FV_PAGE', 'FVPage', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishPage = execute('FV_PAGE_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
