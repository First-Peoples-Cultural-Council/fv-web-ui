import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'
import IntlService from 'views/services/intl'
import ConfGlobal from 'conf/local.js'

/*
 * create
 * --------------------------------------
 */
export const create = (key /*, type, properties = {}*/) => {
  return (parentDoc, docParams, file = null, timestamp, xpath) => {
    return (dispatch) => {
      // timestamp specified as we can't rely on pathOrId to be unique at this point
      const pathOrId = parentDoc + '/' + docParams.name + '.' + timestamp
      dispatch({ type: key + '_CREATE_START', pathOrId: pathOrId })
      if (file) {
        return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file, xpath)
          .then((response) => {
            const dispatchObj = {
              type: key + '_CREATE_SUCCESS',
              message:
                IntlService.instance.translate({
                  key: 'providers.document_with_blob_created_successfully',
                  default: 'Document with blob created successfully',
                  case: 'first',
                }) + '!',
              response: response,
              pathOrId: pathOrId,
            }
            dispatch(dispatchObj)
            // modify for components
            dispatchObj.success = true
            return dispatchObj
          })
          .catch((error) => {
            const dispatchObj = { type: key + '_CREATE_ERROR', message: error, pathOrId: pathOrId }
            dispatch(dispatchObj)
            // modify for components
            dispatchObj.success = false
          })
      }
      return DocumentOperations.createDocument(parentDoc, docParams)
        .then((response) => {
          const dispatchObj = {
            type: key + '_CREATE_SUCCESS',
            message:
              IntlService.instance.translate({
                key: 'providers.document_created_successfully',
                default: 'Document created successfully',
                case: 'first',
              }) + '!',
            response: response,
            pathOrId: pathOrId,
          }
          dispatch(dispatchObj)
          // modify for components
          dispatchObj.success = true
          return dispatchObj
        })
        .catch((error) => {
          const dispatchObj = {
            type: key + '_CREATE_ERROR',
            message: IntlService.instance.searchAndReplace(error),
            pathOrId: pathOrId,
          }
          dispatch(dispatchObj)
          // modify for components
          dispatchObj.success = false
          return dispatchObj
        })
    }
  }
}

/*
 * _delete
 * --------------------------------------
 * Initial call: _delete(key)
 * eg: `export const deleteContributor = _delete('FV_CONTRIBUTOR')`
 *
 * Subsequent calls: _delete(pathOrId, messageStart, messageSuccess, messageError)
 * eg (continued from above): `deleteContributor(contributor.uid)`
 */
export const _delete = (key /*, type, properties = {}*/) => {
  return (pathOrId, messageStart = null, messageSuccess = null, messageError = null) => {
    return (dispatch) => {
      dispatch({
        type: key + '_DELETE_START',
        pathOrId: pathOrId,
        message:
          IntlService.instance.searchAndReplace(messageStart) ||
          IntlService.instance.translate({
            key: 'providers.delete_started',
            default: 'Delete started',
            case: 'first',
          }) + '...',
      })

      return DocumentOperations.executeOperation(pathOrId, 'Document.Trash', {})
        .then((response) => {
          dispatch({
            type: key + '_DELETE_SUCCESS',
            message:
              IntlService.instance.searchAndReplace(messageSuccess) ||
              IntlService.instance.translate({
                key: 'providers.document_deleted_successfully',
                default: 'Document deleted successfully',
                case: 'first',
              }) + '!',
            response: response,
            pathOrId: pathOrId,
          })
        })
        .catch((error) => {
          dispatch({
            type: key + '_DELETE_ERROR',
            message:
              IntlService.instance.searchAndReplace(messageError) || IntlService.instance.searchAndReplace(error),
            pathOrId: pathOrId,
          })
        })
    }
  }
}

/*
 * execute
 * --------------------------------------
 *
 * Initial call:
 *  execute(key, operationName, properties)
 *
 * Subsequent calls:
 *  execute(pathOrId, operationParams, messageStart, messageSuccess, messageError)
 */
export const execute = (key, operationName, properties = {}) => {
  // Initial call
  // Subsequent call
  return (pathOrId, operationParams, messageStart = null, messageSuccess = null, messageError = null) => {
    return (dispatch) => {
      dispatch({
        type: key + '_EXECUTE_START',
        pathOrId: pathOrId,
        message:
          IntlService.instance.searchAndReplace(messageStart) ||
          IntlService.instance.translate({
            key: 'providers.fetch_started',
            default: 'Fetch Started',
            case: 'words',
          }) + '...',
      })

      return DocumentOperations.executeOperation(pathOrId, operationName, operationParams, {
        headers: properties.headers,
      })
        .then((response) => {
          dispatch({
            type: key + '_EXECUTE_SUCCESS',
            message: IntlService.instance.searchAndReplace(messageSuccess),
            response: response,
            pathOrId: pathOrId,
          })
          // NOTE: Returning a response for other functions
          // Initially added to work with Material-Table
          return response
        })
        .catch((error) => {
          const errorMessage =
            IntlService.instance.searchAndReplace(messageError) || IntlService.instance.searchAndReplace(error)
          dispatch({
            type: key + '_EXECUTE_ERROR',
            message: errorMessage,
            pathOrId: pathOrId,
          })
          // NOTE: Returning a response for other functions
          // Initially added to work with Material-Table
          return errorMessage
        })
    }
  }
}

/*
 * fetch
 *
 * Initial call:
 *  fetch(key, type, properties)
 *
 * Subsequent calls:
 *  fetch(pathOrId, messageStart, messageSuccess, messageError, propertiesOverride)
 *
 * --------------------------------------
 */
export const fetch = (key, type, properties = {}) => {
  return (pathOrId, messageStart = null, messageSuccess = null, messageError = null, propertiesOverride = {}) => {
    return (dispatch) => {
      dispatch({
        type: key + '_FETCH_START',
        pathOrId: pathOrId,
        message:
          IntlService.instance.searchAndReplace(messageStart) ||
          IntlService.instance.translate({
            key: 'providers.fetch_started',
            default: 'Fetch Started',
            case: 'words',
          }) + '...',
      })
      return DocumentOperations.getDocument(pathOrId, type, {
        headers: propertiesOverride.headers || properties.headers,
      })
        .then((response) => {
          dispatch({
            type: key + '_FETCH_SUCCESS',
            message: IntlService.instance.searchAndReplace(messageSuccess),
            response: response,
            pathOrId: pathOrId,
          })
        })
        .catch((error) => {
          dispatch({
            type: key + '_FETCH_ERROR',
            message:
              IntlService.instance.searchAndReplace(messageError) || IntlService.instance.searchAndReplace(error),
            pathOrId: pathOrId,
          })
        })
    }
  }
}

/*
 * query
 *
 * Initial call:
 *  query(key, type, properties)
 *
 * Subsequent calls:
 *  query(pathOrId, queryAppend, messageStart, messageSuccess, messageError)
 *
 * --------------------------------------
 */
export const query = (key, type, properties = {}) => {
  return (pathOrId, queryAppend, messageStart = null, messageSuccess = null, messageError = null) => {
    const _messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
    const _messageError = IntlService.instance.searchAndReplace(messageError)

    return (dispatch) => {
      dispatch({
        type: key + '_QUERY_START',
        pathOrId: pathOrId,
        message:
          IntlService.instance.searchAndReplace(messageStart) ||
          IntlService.instance.translate({
            key: 'providers.fetch_started',
            default: 'Fetch Started',
            case: 'words',
          }) + '...',
      })

      // Switch methods used based on path until everything is converted to use the the new endpoints
      if (pathOrId.indexOf(ConfGlobal.apiURL) !== -1) {
        return DirectoryOperations.getDocumentsViaAPI(pathOrId)
          .then((response) => {
            dispatch({
              type: key + '_QUERY_SUCCESS',
              message: _messageSuccess,
              response: response,
              pathOrId: pathOrId,
            })
          })
          .catch((error) => {
            dispatch({
              type: key + '_QUERY_ERROR',
              message: _messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
      return DirectoryOperations.getDocuments(pathOrId, type, properties.queryAppend || queryAppend, {
        headers: properties.headers,
      })
        .then((response) => {
          dispatch({
            type: key + '_QUERY_SUCCESS',
            message: _messageSuccess,
            response: response,
            pathOrId: pathOrId,
          })
        })
        .catch((error) => {
          dispatch({
            type: key + '_QUERY_ERROR',
            message: _messageError || IntlService.instance.searchAndReplace(error),
            pathOrId: pathOrId,
          })
        })
    }
  }
}

/*
 * update
 * --------------------------------------
 */
export const update = (key, type, properties = {}, usePathAsId = true) => {
  return function _update(
    newDoc,
    messageStart = undefined,
    messageSuccess = undefined,
    messageError = undefined,
    file,
    xpath
  ) {
    const _messageStart = IntlService.instance.searchAndReplace(messageStart)
    const _messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
    const _messageError = IntlService.instance.searchAndReplace(messageError)
    return (dispatch) => {
      dispatch({
        type: key + '_UPDATE_START',
        pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
        message:
          _messageStart === undefined
            ? IntlService.instance.translate({
                key: 'operations.update_started',
                default: 'Update Started',
                case: 'words',
              }) + '...'
            : _messageStart,
      })

      return DocumentOperations.updateDocument(newDoc, { headers: properties.headers }, file, xpath)
        .then((response) => {
          const dispatchObj = {
            type: key + '_UPDATE_SUCCESS',
            message:
              _messageSuccess === undefined
                ? IntlService.instance.translate({
                    key: 'providers.document_updated_successfully',
                    default: 'Document updated successfully',
                    case: 'first',
                  }) + '!'
                : _messageSuccess,
            response: response,
            pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
          }
          dispatch(dispatchObj)
          // modify for components
          dispatchObj.success = true
          return dispatchObj
        })
        .catch((error) => {
          const dispatchObj = {
            type: key + '_UPDATE_ERROR',
            message: _messageError || IntlService.instance.searchAndReplace(error),
            pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
          }
          dispatch(dispatchObj)
          // modify for components
          dispatchObj.success = false
          return dispatchObj
        })
    }
  }
}
