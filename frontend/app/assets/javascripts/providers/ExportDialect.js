import selectn from 'selectn'

// Middleware
import thunk from 'redux-thunk'
import Request from 'request'

// Constants
// TODO: CHANGE TO BACKEND ADDRESS
const EXPORT_DIALECT_HOST_ROOT = 'localhost'
const EXPORT_DIALECT_HOST_PORT = '8081' // ''
// TODO: CHANGE TO BACKEND ADDRESS

// TODO: USE HTTPS
const EXPORT_DIALECT_SCHEME_HOST_URL = `http://${EXPORT_DIALECT_HOST_ROOT}${
  EXPORT_DIALECT_HOST_PORT ? `:${EXPORT_DIALECT_HOST_PORT}` : ''
}`
// TODO: USE HTTPS

const EXPORT_DIALECT_CHECK_PREVIOUS_URL = '/automation/Document.GetFormattedDocument' // TODO: endpoint may change to plural
const EXPORT_DIALECT_REQUEST_URL = '/automation/Document.FVGenerateDocumentWithFormat'

// let EXPORT_DIALECT_PROGRESS_URL = '/nuxeo/site/automation/Document.GetExportProgress'
// TODO: TEMP, REMOVE. (FAKING BACKEND PROGRESS UPDATES)
let URLCOUNTER = 0
const EXPORT_DIALECT_PROGRESS_URLS = [
  '/nuxeo/site/automation/Document.GetExportProgress/1',
  '/nuxeo/site/automation/Document.GetExportProgress/2',
  '/nuxeo/site/automation/Document.GetExportProgress/3',
]
let EXPORT_DIALECT_PROGRESS_URL = '/nuxeo/site/automation/Document.GetExportProgress/1'
// TODO: TEMP, REMOVE

const NOT_STARTED = 'NOT_STARTED'
const STARTED = 'STARTED'
const IN_PROGRESS = 'IN_PROGRESS'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const initialState = {
  dialectIdDocumentUuid: {},
  dialectIdLifecycle: {},
  dialectIdData: {},
  CONSTANTS: {
    NOT_STARTED,
    IN_PROGRESS,
    SUCCESS,
    ERROR,
  },
}

// Actions
const EXPORT_DIALECT_REQUEST = 'EXPORT_DIALECT_REQUEST'
const EXPORT_DIALECT_REQUEST_SUCCESS = 'EXPORT_DIALECT_REQUEST_SUCCESS'
const EXPORT_DIALECT_PROGRESS = 'EXPORT_DIALECT_PROGRESS'
const EXPORT_DIALECT_SUCCESS = 'EXPORT_DIALECT_SUCCESS'
const EXPORT_DIALECT_ERROR = 'EXPORT_DIALECT_ERROR'

const ExportDialectCheckPrevious = function ExportDialectCheckPrevious(dialectId) {
  return (dispatch) => {
    const promiseRequest = new Promise((resolve, reject) => {
      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_CHECK_PREVIOUS_URL}`,
          method: 'POST',
          json: true,
        },
        (error, response, body) => {
          if (response && response.statusCode === 200) {
            resolve(body)
          } else {
            reject(error)
          }
        }
      )
    })
    const promiseRequestResult = promiseRequest
      .then((body) => {
        const _dialectExported = (body.entries || []).filter((existingExport) => {
          const exportedDialectId = selectn('properties.fvexport:dialect', existingExport)
          return exportedDialectId === dialectId
        })
        if (_dialectExported.length) {
          const dialectExported = _dialectExported[0]
          const documentUuid = dialectExported.uid
          const message = dialectExported.properties['fvexport:progressString']
          const percentage = dialectExported.properties['fvexport:progressValue']

          if (percentage === 100) {
            const file = body.properties['file:content']
            dispatch({
              type: EXPORT_DIALECT_SUCCESS,
              payload: {
                dialectId,
                documentUuid,
                message,
                percentage,
                ExportDialectFileName: file.name,
                ExportDialectFileUrl: file.data,
              },
            })
          } else {
            dispatch({
              type: EXPORT_DIALECT_PROGRESS,
              payload: {
                dialectId,
                message,
                percentage,
              },
            })
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            error,
          },
        })
      })
    return promiseRequestResult
  }
}
const ExportDialectRequest = function ExportDialectRequest(dialectId) {
  return (dispatch) => {
    dispatch({
      type: EXPORT_DIALECT_REQUEST,
      payload: {
        dialectId,
      },
    })
    const reqBody = {
      input: dialectId,
      params: {
        columns: '*',
        format: 'CSV',
        query: '*',
      },
    }
    const promiseRequest = new Promise((resolve, reject) => {
      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_REQUEST_URL}`,
          method: 'POST',
          body: reqBody,
          json: true,
        },
        (error, response, body) => {
          if (response && response.statusCode === 200) {
            resolve(body)
          } else {
            reject(error)
          }
        }
      )
    })
    const promiseRequestResult = promiseRequest
      .then((body) => {
        // Success
        dispatch({
          type: EXPORT_DIALECT_REQUEST_SUCCESS,
          payload: {
            dialectId,
            documentUuid: body.uid,
            message: body.properties['fvexport:progressString'],
            percentage: body.properties['fvexport:progressValue'],
          },
        })
      })
      .catch((error) => {
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            dialectId,
            error,
          },
        })
      })
    return promiseRequestResult
  }
}

const ExportDialectProgress = function ExportDialectProgress(dialectId, documentUuid) {
  return (dispatch) => {
    const reqBody = {
      input: documentUuid,
    }

    const promiseRequest = new Promise((resolve, reject) => {
      // TODO: TEMP, REMOVE WHEN INTEGRATED
      EXPORT_DIALECT_PROGRESS_URL = EXPORT_DIALECT_PROGRESS_URLS[URLCOUNTER]
      if (URLCOUNTER >= 2) {
        URLCOUNTER = 0
      } else {
        URLCOUNTER += 1
      }
      // TODO: TEMP, REMOVE WHEN INTEGRATED

      Request(
        {
          url: `${EXPORT_DIALECT_SCHEME_HOST_URL}${EXPORT_DIALECT_PROGRESS_URL}`,
          method: 'POST',
          body: reqBody,
          json: true,
        },
        (error, response, body) => {
          if (response && response.statusCode === 200) {
            resolve(body)
          } else {
            reject(error)
          }
        }
      )
    })

    return promiseRequest
      .then((body) => {
        // Success
        const message = body.properties['fvexport:progressString']
        const percentage = body.properties['fvexport:progressValue']
        if (percentage === 100) {
          const file = body.properties['file:content']

          dispatch({
            type: EXPORT_DIALECT_SUCCESS,
            payload: {
              dialectId,
              message,
              percentage,
              ExportDialectFileName: file.name,
              ExportDialectFileUrl: file.data,
            },
          })
        } else {
          dispatch({
            type: EXPORT_DIALECT_PROGRESS,
            payload: {
              dialectId,
              message,
              percentage,
            },
          })
        }
      })
      .catch((error) => {
        // Error
        dispatch({
          type: EXPORT_DIALECT_ERROR,
          payload: {
            dialectId,
            documentUuid,
            error,
          },
        })
        // return error
      })
  }
}

// Reducer
// =================================
const ExportDialectReducer = function ExportDialectReducer(state = initialState, action) {
  // grab current state
  const newState = Object.assign({}, state)

  const { payload } = action
  switch (action.type) {
    case EXPORT_DIALECT_REQUEST: {
      const { dialectId } = payload
      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = STARTED
      return newState
    }

    case EXPORT_DIALECT_REQUEST_SUCCESS: {
      const { dialectId, documentUuid, message, percentage } = payload

      // Save documentUuid in dialectIdDocumentUuid = {}
      // For easy lookup when a component unloads and reloads in the same session
      newState.dialectIdDocumentUuid[dialectId] = documentUuid

      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
      }

      return newState
    }

    case EXPORT_DIALECT_PROGRESS: {
      // Send progress report
      const { dialectId, message = 'EXPORT_DIALECT_PROGRESS', percentage = -1 } = payload

      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = IN_PROGRESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
      }

      return newState
    }

    case EXPORT_DIALECT_SUCCESS: {
      // Send progress report
      const { dialectId, message, percentage, ExportDialectFileName, ExportDialectFileUrl } = payload
      // Set dialectIdLifecycle state
      newState.dialectIdLifecycle[dialectId] = SUCCESS

      newState.dialectIdData[dialectId] = {
        message,
        percentage,
        ExportDialectFileName,
        ExportDialectFileUrl,
      }

      return newState
    }

    case EXPORT_DIALECT_ERROR: {
      const { dialectId, error } = payload
      // Notify user
      newState.dialectIdLifecycle[dialectId] = ERROR
      newState.dialectIdData[dialectId] = {
        message: 'We encountered a problem trying to create the document. Please try again later',
        error,
      }
      return newState
    }

    default:
      return newState
  }
}

const actions = { ExportDialectRequest, ExportDialectProgress, ExportDialectCheckPrevious }
const reducers = { ExportDialectReducer }
const middleware = [thunk]

export default { actions, reducers, middleware }
