import { create, _delete, execute, query, update } from 'providers/redux/reducers/rest'

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

export const askToPublishPage = execute('FV_PAGE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const unpublishPage = execute('FV_PAGE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToUnpublishPage = execute('FV_PAGE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const enablePage = execute('FV_PAGE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToEnablePage = execute('FV_PAGE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const disablePage = execute('FV_PAGE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToDisablePage = execute('FV_PAGE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
