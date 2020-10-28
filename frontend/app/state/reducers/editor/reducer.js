import { combineReducers } from 'redux'
import { ENABLE_EDIT_MODE, DISABLE_EDIT_MODE, REQUEST_SAVE_FIELD } from './actionTypes'
import { FV_PORTAL_UPDATE_SUCCESS } from 'reducers/fvPortal'
const computeEditMode = (state = { initiatingField: null }, action) => {
  const enabledField = {}
  enabledField[action.field] = true
  switch (action.type) {
    case ENABLE_EDIT_MODE:
      return { ...state, ...enabledField, initiatingField: action.field }
    case DISABLE_EDIT_MODE:
      return { ...state, initiatingField: action.field }
    case FV_PORTAL_UPDATE_SUCCESS: {
      // See http://stackoverflow.com/questions/35342355/remove-data-from-nested-objects-without-mutating/35367927
      // eslint-disable-next-line
      const { [action.field]: deletedItem, ...rest } = { ...state, initiatingField: action.field }
      return rest
    }
    default:
      return state
  }
}

const properties = (state = null) => {
  return state
}

const saveField = (state = false, action) => {
  switch (action.type) {
    case REQUEST_SAVE_FIELD:
      return !state
    default:
      return state
  }
}
export const editorReducer = combineReducers({
  computeEditMode,
  properties,
  saveField,
})
