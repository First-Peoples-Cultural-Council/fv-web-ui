import selectn from 'selectn'
import DirectoryOperations from 'operations/DirectoryOperations'
import {
  DIRECTORY_FETCH_START,
  DIRECTORY_FETCH_SUCCESS,
  DIRECTORY_FETCH_ERROR,
} from './actionTypes'

export const fetchDirectory = (name, pageSize, returnFullObject = false) => {
  return (dispatch) => {
    dispatch({ type: DIRECTORY_FETCH_START })

    return DirectoryOperations.getDirectory(name, pageSize)
      .then((response) => {
        const options = (selectn('entries', response) || []).map((directoryEntry) => {
          if (returnFullObject) {
            return Object.assign({}, directoryEntry.properties)
          } else {
            return {
              value: directoryEntry.properties.id,
              text: directoryEntry.properties.label,
            }
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
