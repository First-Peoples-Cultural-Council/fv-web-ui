import selectn from 'selectn'
import DirectoryOperations from 'operations/DirectoryOperations'
import {
  DIRECTORY_FETCH_START,
  DIRECTORY_FETCH_SUCCESS,
  DIRECTORY_FETCH_ERROR,
  LABEL_DIRECTORY_FETCH_START,
  LABEL_DIRECTORY_FETCH_SUCCESS,
  LABEL_DIRECTORY_FETCH_ERROR,
} from './actionTypes'

export const fetchDirectory = (name, pageSize, returnFullObject = false) => {
  return (dispatch) => {
    dispatch({ type: DIRECTORY_FETCH_START })

    return DirectoryOperations.getDirectory(name, pageSize)
      .then((response) => {
        const options = (selectn('entries', response) || []).map((directoryEntry) => {
          if (returnFullObject) {
            return Object.assign({}, directoryEntry.properties)
          }
          return {
            value: directoryEntry.properties.id,
            text: directoryEntry.properties.label,
          }
        })

        const directories = {}
        directories[name] = options

        dispatch({ type: DIRECTORY_FETCH_SUCCESS, directoryEntries: directories, directory: name })
      })
      .catch((error) => {
        dispatch({ type: DIRECTORY_FETCH_ERROR, error: error })
      })
  }
}

export const fetchLabelDirectory = (statename, name) => {
  return (dispatch) => {
    dispatch({ type: LABEL_DIRECTORY_FETCH_START })

    return DirectoryOperations.getDocumentsViaCustomAPI(`label/${name}`)
      .then((response) => {
        const options = response.map((directoryEntry) => ({
          value: directoryEntry.id,
          text: directoryEntry.label,
          templateStrings: directoryEntry.templateStrings,
          category: directoryEntry.category,
          type: directoryEntry.type,
          parent: directoryEntry.parent,
        }))

        const directories = {}
        directories[statename] = options
        dispatch({ type: LABEL_DIRECTORY_FETCH_SUCCESS, directoryEntries: directories, directory: statename })
      })
      .catch((error) => {
        dispatch({ type: LABEL_DIRECTORY_FETCH_ERROR, error: error })
      })
  }
}
