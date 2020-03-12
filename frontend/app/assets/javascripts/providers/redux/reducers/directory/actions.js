// NOTE: see `.../javascripts/providers/redux/reducers/index.js` about `_directory` vs `directory`
import selectn from 'selectn'
import DirectoryOperations from 'operations/DirectoryOperations'
import {
  DIRECTORY_FETCH_START,
  DIRECTORY_FETCH_SUCCESS,
  DIRECTORY_FETCH_ERROR,
  DIRECTORY_FETCH_ENTRIES_START,
  DIRECTORY_FETCH_ENTRIES_SUCCESS,
  DIRECTORY_FETCH_ENTRIES_ERROR,
} from './actionTypes'

export const fetchDirectory = (name, headers) => {
  return (dispatch) => {
    dispatch({ type: DIRECTORY_FETCH_START })

    return DirectoryOperations.getDirectory(name, { headers: headers })
      .then((response) => {
        const options = (selectn('entries', response) || []).map((directoryEntry) => {
          return {
            value: directoryEntry.properties.id,
            text: directoryEntry.properties.label,
          }
        })

        const directories = {}
        directories[name] = options

        dispatch({ type: DIRECTORY_FETCH_SUCCESS, directories: directories, directory: name })
      })
      .catch((error) => {
        dispatch({ type: DIRECTORY_FETCH_ERROR, error: error })
      })
  }
}

export const fetchDirectoryEntries = (name, map, headers, params) => {
  return (dispatch) => {
    dispatch({ type: DIRECTORY_FETCH_ENTRIES_START })

    return DirectoryOperations.getDirectoryEntries(name, { headers: headers }, { params: params })
      .then((response) => {
        const options = (response || []).map((directoryEntry) => {
          const entry = {
            id: directoryEntry.id,
            label: directoryEntry.label,
          }
          map.forEach((val) => {
            entry[val] = directoryEntry[val]
          })
          return entry
        })

        const directoryEntries = {}
        directoryEntries[name] = options

        dispatch({ type: DIRECTORY_FETCH_ENTRIES_SUCCESS, directoryEntries: directoryEntries, directory: name })
      })
      .catch((error) => {
        dispatch({ type: DIRECTORY_FETCH_ENTRIES_ERROR, error: error })
      })
  }
}
