import { DISMISS_ERROR, ENABLE_EDIT_MODE, DISABLE_EDIT_MODE } from './actionTypes'

export const dismissError = (error) => {
  return { type: DISMISS_ERROR, error }
}

export const enableEditMode = (field) => {
  return { type: ENABLE_EDIT_MODE, field }
}

export const disableEditMode = (field = null) => {
  return { type: DISABLE_EDIT_MODE, field }
}
