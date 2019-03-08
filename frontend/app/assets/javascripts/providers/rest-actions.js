import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'
import IntlService from 'views/services/intl'

import ConfGlobal from 'conf/local.json'

export default {
  create: (key, type, properties = {}) => {
    return function create(parentDoc, docParams, file = null, timestamp) {
      return (dispatch) => {
        // timestamp specified as we can't rely on pathOrId to be unique at this point
        const pathOrId = parentDoc + '/' + docParams.name + '.' + timestamp

        dispatch({ type: key + '_CREATE_START', pathOrId: pathOrId })

        if (file) {
          return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
            .then((response) => {
              dispatch({
                type: key + '_CREATE_SUCCESS',
                message:
                  IntlService.instance.translate({
                    key: 'providers.document_with_blob_created_successfully',
                    default: 'Document with blob created successfully',
                    case: 'first',
                  }) + '!',
                response: response,
                pathOrId: pathOrId,
              })
            })
            .catch((error) => {
              dispatch({ type: key + '_CREATE_ERROR', message: error, pathOrId: pathOrId })
            })
        }
        return DocumentOperations.createDocument(parentDoc, docParams)
          .then((response) => {
            dispatch({
              type: key + '_CREATE_SUCCESS',
              message:
                IntlService.instance.translate({
                  key: 'providers.document_created_successfully',
                  default: 'Document created successfully',
                  case: 'first',
                }) + '!',
              response: response,
              pathOrId: pathOrId,
            })
          })
          .catch((error) => {
            dispatch({
              type: key + '_CREATE_ERROR',
              message: IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
    }
  },
  fetch: (key, type, properties = {}) => {
    return function fetch(
      pathOrId,
      messageStart = null,
      messageSuccess = null,
      messageError = null,
      propertiesOverride = {}
    ) {
      messageStart = IntlService.instance.searchAndReplace(messageStart)
      messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
      messageError = IntlService.instance.searchAndReplace(messageError)
      return (dispatch) => {
        dispatch({
          type: key + '_FETCH_START',
          pathOrId: pathOrId,
          message:
            messageStart ||
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
              message: messageSuccess,
              response: response,
              pathOrId: pathOrId,
            })
          })
          .catch((error) => {
            dispatch({
              type: key + '_FETCH_ERROR',
              message: messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
    }
  },
  query: (key, type, properties = {}) => {
    return function query(pathOrId, queryAppend, messageStart = null, messageSuccess = null, messageError = null) {
      messageStart = IntlService.instance.searchAndReplace(messageStart)
      messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
      messageError = IntlService.instance.searchAndReplace(messageError)

      return (dispatch) => {
        dispatch({
          type: key + '_QUERY_START',
          pathOrId: pathOrId,
          message:
            messageStart ||
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
                message: messageSuccess,
                response: response,
                pathOrId: pathOrId,
              })
            })
            .catch((error) => {
              dispatch({
                type: key + '_QUERY_ERROR',
                message: messageError || IntlService.instance.searchAndReplace(error),
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
              message: messageSuccess,
              response: response,
              pathOrId: pathOrId,
            })
          })
          .catch((error) => {
            dispatch({
              type: key + '_QUERY_ERROR',
              message: messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
    }
  },
  execute: (key, operationName, properties = {}) => {
    return function execute(
      pathOrId,
      operationParams,
      messageStart = null,
      messageSuccess = null,
      messageError = null
    ) {
      messageStart = IntlService.instance.searchAndReplace(messageStart)
      messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
      messageError = IntlService.instance.searchAndReplace(messageError)
      return (dispatch) => {
        dispatch({
          type: key + '_EXECUTE_START',
          pathOrId: pathOrId,
          message:
            messageStart ||
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
          })
          .catch((error) => {
            dispatch({
              type: key + '_EXECUTE_ERROR',
              message: messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
    }
  },
  update: (key, type, properties = {}, usePathAsId = true) => {
    return function update(newDoc, messageStart = undefined, messageSuccess = undefined, messageError = undefined) {
      messageStart = IntlService.instance.searchAndReplace(messageStart)
      messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
      messageError = IntlService.instance.searchAndReplace(messageError)
      return (dispatch) => {
        dispatch({
          type: key + '_UPDATE_START',
          pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
          message:
            messageStart === undefined
              ? IntlService.instance.translate({
                key: 'operations.update_started',
                default: 'Update Started',
                case: 'words',
              }) + '...'
              : messageStart,
        })

        return DocumentOperations.updateDocument(newDoc, { headers: properties.headers })
          .then((response) => {
            dispatch({
              type: key + '_UPDATE_SUCCESS',
              message:
                messageSuccess === undefined
                  ? IntlService.instance.translate({
                    key: 'providers.document_updated_successfully',
                    default: 'Document updated successfully',
                    case: 'first',
                  }) + '!'
                  : messageSuccess,
              response: response,
              pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
            })
          })
          .catch((error) => {
            dispatch({
              type: key + '_UPDATE_ERROR',
              message: messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: usePathAsId ? newDoc.path : newDoc.uid,
            })
          })
      }
    }
  },
  delete: (key, type, properties = {}) => {
    return function update(pathOrId, messageStart = null, messageSuccess = null, messageError = null) {
      messageStart = IntlService.instance.searchAndReplace(messageStart)
      messageSuccess = IntlService.instance.searchAndReplace(messageSuccess)
      messageError = IntlService.instance.searchAndReplace(messageError)
      return (dispatch) => {
        dispatch({
          type: key + '_DELETE_START',
          pathOrId: pathOrId,
          message:
            messageStart ||
            IntlService.instance.translate({
              key: 'providers.delete_started',
              default: 'Delete started',
              case: 'first',
            }) + '...',
        })

        return DocumentOperations.executeOperation(pathOrId, 'Document.FollowLifecycleTransition', { value: 'delete' })
          .then((response) => {
            dispatch({
              type: key + '_DELETE_SUCCESS',
              message:
                messageSuccess ||
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
              message: messageError || IntlService.instance.searchAndReplace(error),
              pathOrId: pathOrId,
            })
          })
      }
    }
  },
}
