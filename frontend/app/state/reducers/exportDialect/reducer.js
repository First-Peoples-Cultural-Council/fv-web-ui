import selectn from 'selectn'

import { EXPORT_DEFAULT, EXPORT_ERROR, EXPORT_IN_PROGRESS, EXPORT_INITIALIZING, EXPORT_SUCCESS } from './constants'

const getIndexFromExportData = ({ exportId, exportData = [] }) => {
  return exportData.findIndex((element) => {
    return element.exportId === exportId
  })
}
const rebuildAllData = (newState) => {
  const _newState = Object.assign({}, newState)
  const exportDataFilter = _newState.exportData || []
  _newState.exportDefault = exportDataFilter.filter((data) => {
    return data.lifecycle === EXPORT_DEFAULT
  })
  _newState.exportError = exportDataFilter.filter((data) => {
    return data.lifecycle === EXPORT_ERROR
  })
  _newState.exportInProgress = exportDataFilter.filter((data) => {
    return data.lifecycle === EXPORT_IN_PROGRESS && data['fvexport:progressValue'] !== 100
  })
  _newState.exportInitializing = exportDataFilter.filter((data) => {
    return data.lifecycle === EXPORT_INITIALIZING
  })
  _newState.exportSuccess = exportDataFilter.filter((data) => {
    return data.lifecycle === EXPORT_SUCCESS || data['fvexport:progressValue'] === 100
  })
  _newState.exportLast = exportDataFilter.length !== 0 ? exportDataFilter[exportDataFilter.length - 1] : {}

  return _newState
}
const exportDialectDefaultState = {
  CONSTANTS: {
    EXPORT_DEFAULT,
    EXPORT_ERROR,
    EXPORT_IN_PROGRESS,
    EXPORT_INITIALIZING,
    EXPORT_SUCCESS,
  },
  exportData: undefined,
}
export const exportDialectReducer = (state = exportDialectDefaultState, action) => {
  // grab current state
  const newState = rebuildAllData(state)

  const itemId = action.pathOrId

  switch (action.type) {
    case 'EXPORT_ERROR_GENERIC': {
      const lifecycle = EXPORT_ERROR
      const dialectId = action.dialectIdData.dialectId
      const exportId = action.dialectIdData.exportId

      const updatedExportData = {
        dialectId,
        exportId,
        lifecycle,
        message: action.message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // CHECK FOR EXISTING EXPORT: START
    // ==============================
    case 'EXPORT_DIALECT_GET_FORMATTED_DOCUMENT_EXECUTE_START': {
      return newState
    }
    // ==============================
    // CHECK FOR EXISTING EXPORT: SUCCESS
    // ==============================
    case 'EXPORT_DIALECT_GET_FORMATTED_DOCUMENT_EXECUTE_SUCCESS': {
      const dialectId = itemId

      // NOTE: A 204 from the server indicates that the dialect hasn't been exported yet
      const is204 = selectn('response.status', action) === 204

      // CLEAR OUT OLD DATA:
      newState.exportData = []

      const entries = selectn('response.entries', action) || []
      entries.forEach((entry) => {
        const exportId = selectn(['uid'], entry)
        let lifecycle = EXPORT_DEFAULT
        if (is204 === false) {
          const progressValue = selectn(['properties', 'fvexport:progressValue'], entry)
          lifecycle = progressValue === 100 ? EXPORT_SUCCESS : EXPORT_IN_PROGRESS
        }
        const updatedExportData = {
          dialectId,
          exportId,
          'file:content': selectn(['properties', 'file:content'], entry),
          'fvexport:columns': selectn(['properties', 'fvexport:columns'], entry),
          'fvexport:dialect': selectn(['properties', 'fvexport:dialect'], entry),
          'fvexport:exportdigest': selectn(['properties', 'fvexport:exportdigest'], entry),
          'fvexport:format': selectn(['properties', 'fvexport:format'], entry),
          'fvexport:progressString': selectn(['properties', 'fvexport:progressString'], entry),
          'fvexport:progressValue': selectn(['properties', 'fvexport:progressValue'], entry),
          'fvexport:query': selectn(['properties', 'fvexport:query'], entry),
          'fvexport:workdigest': selectn(['properties', 'fvexport:workdigest'], entry),
          lifecycle,
          message: action.message,
        }

        newState.exportData.push(updatedExportData)
      })

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // CHECK FOR EXISTING EXPORT: ERROR
    // ==============================
    case 'EXPORT_DIALECT_GET_FORMATTED_DOCUMENT_EXECUTE_ERROR': {
      const dialectId = itemId

      // IS THIS ERROR SPECIFIC TO A SINGLE EXPORT OR THE DIALECT IN GENERAL?
      // MEANING: CAN THERE BE A MIX OF ERROR & SUCCESS ENTRIES?

      // TODO: need exportId
      const exportId = 0
      // debugger

      const updatedExportData = {
        dialectId,
        exportId,
        lifecycle: EXPORT_ERROR,
        message: action.message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // GET PROGRESS: START
    // ==============================
    case 'EXPORT_DIALECT_PROGRESS_EXECUTE_START': {
      return newState
    }
    // ==============================
    // GET PROGRESS: SUCCESS
    // ==============================
    case 'EXPORT_DIALECT_PROGRESS_EXECUTE_SUCCESS': {
      // NOTE: Progress functions uses Export ID as the itemId
      const dialectId = selectn(['response', 'properties', 'fvexport:dialect'], action)
      const exportId = itemId

      const timestamp = Date.now()
      // Prep data to be saved...
      const progressValue = selectn(['response', 'properties', 'fvexport:progressValue'], action)
      const lifecycle = progressValue === 100 ? EXPORT_SUCCESS : EXPORT_IN_PROGRESS

      const updatedExportData = {
        timestamp,
        dialectId,
        exportId,
        'file:content': selectn(['response', 'properties', 'file:content'], action),
        'fvexport:columns': selectn(['response', 'properties', 'fvexport:columns'], action),
        'fvexport:dialect': selectn(['response', 'properties', 'fvexport:dialect'], action),
        'fvexport:exportdigest': selectn(['response', 'properties', 'fvexport:exportdigest'], action),
        'fvexport:format': selectn(['response', 'properties', 'fvexport:format'], action),
        'fvexport:progressString': selectn(['response', 'properties', 'fvexport:progressString'], action),
        'fvexport:progressValue': progressValue,
        'fvexport:query': selectn(['response', 'properties', 'fvexport:query'], action),
        'fvexport:workdigest': selectn(['response', 'properties', 'fvexport:workdigest'], action),
        lifecycle,
        message: action.message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // GET PROGRESS: ERROR
    // ==============================
    case 'EXPORT_DIALECT_PROGRESS_EXECUTE_ERROR': {
      // NOTE: Progress functions use Export ID as itemId

      // TODO: need dialectId
      const dialectId = 0
      // TODO: confirm correct exportId
      const exportId = itemId
      // debugger

      const updatedExportData = {
        dialectId,
        exportId,
        lifecycle: EXPORT_ERROR,
        message: action.message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // GENERATE DOCUMENT: START
    // ==============================
    case 'EXPORT_DIALECT_FV_GENERATE_DOCUMENT_WITH_FORMAT_EXECUTE_START': {
      return newState
    }
    // ==============================
    // GENERATE DOCUMENT: SUCCESS
    // ==============================
    case 'EXPORT_DIALECT_FV_GENERATE_DOCUMENT_WITH_FORMAT_EXECUTE_SUCCESS': {
      // Prep data to be saved...
      const dialectId = itemId
      const exportId = selectn(['response', 'uid'], action)

      // NOTE: A 204 from the server indicates the dialect has nothing to export
      const is204 = selectn('response.status', action) === 204
      const lifecycle = is204 ? EXPORT_ERROR : EXPORT_IN_PROGRESS

      const message = is204 ? 'No items to export!' : action.message

      const updatedExportData = {
        dialectId,
        exportId,
        'file:content': selectn(['response', 'properties', 'file:content'], action),
        'fvexport:columns': selectn(['response', 'properties', 'fvexport:columns'], action),
        'fvexport:dialect': selectn(['response', 'properties', 'fvexport:dialect'], action),
        'fvexport:exportdigest': selectn(['response', 'properties', 'fvexport:exportdigest'], action),
        'fvexport:format': selectn(['response', 'properties', 'fvexport:format'], action),
        'fvexport:progressString': selectn(['response', 'properties', 'fvexport:progressString'], action),
        'fvexport:progressValue': selectn(['response', 'properties', 'fvexport:progressValue'], action),
        'fvexport:query': selectn(['response', 'properties', 'fvexport:query'], action),
        'fvexport:workdigest': selectn(['response', 'properties', 'fvexport:workdigest'], action),
        lifecycle,
        message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }
    // ==============================
    // GENERATE DOCUMENT: ERROR
    // ==============================
    case 'EXPORT_DIALECT_FV_GENERATE_DOCUMENT_WITH_FORMAT_EXECUTE_ERROR': {
      const dialectId = itemId

      // TODO: need exportId
      const exportId = 0
      // debugger

      const updatedExportData = {
        dialectId,
        exportId,
        lifecycle: EXPORT_ERROR,
        message: action.message,
      }

      const exportDataIndex = getIndexFromExportData({ exportId, exportData: newState.exportData })
      if (exportDataIndex === -1) {
        if (newState.exportData === undefined) {
          newState.exportData = []
        }
        newState.exportData.push(updatedExportData)
      } else {
        newState.exportData[exportDataIndex] = updatedExportData
      }

      // Send it back out
      return rebuildAllData(newState)
    }

    // ==============================
    // RESET DATA
    // ==============================
    case 'EXPORT_DIALECT_RESET_DATA': {
      return exportDialectDefaultState
    }

    default:
      return newState
  }
}
