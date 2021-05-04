import { execute, fetch, query, update } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'
// console.log('! fvDialect:', { RESTActions, DocumentOperations }) // eslint-disable-line
import { FV_DIALECT_FETCH_START, FV_DIALECT_FETCH_SUCCESS, FV_DIALECT_FETCH_ERROR } from './actionTypes'

export const fetchDialect = (pathOrId) => {
  return (dispatch) => {
    dispatch({ type: FV_DIALECT_FETCH_START })

    return DocumentOperations.getDocument(pathOrId, 'FVDialect', {
      headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
    })
      .then((response) => {
        dispatch({ type: FV_DIALECT_FETCH_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_DIALECT_FETCH_ERROR, error: error })
      })
  }
}

export const updateDialect2 = update('FV_DIALECT2', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const fetchDialect2 = fetch('FV_DIALECT2', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions,acls' },
})

export const queryDialect2ByShortURL = query('FV_DIALECT2_SHORTURL', 'FVDialect', {})

export const fetchDialects = query('FV_DIALECTS', 'FVDialect', {
  headers: { 'enrichers.document': 'ancestry,dialect' },
})

export const fetchDialectList = execute('FV_DIALECT_LIST', 'Document.ListDialects', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const republishDialect = execute('FV_DIALECT2_REPUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,dialect,permissions' },
})
