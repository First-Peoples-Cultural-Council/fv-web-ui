import {
  SET_LOCALE,
  FV_LABELS_FETCH_START,
  FV_LABELS_FETCH_SUCCESS,
  FV_LABELS_FETCH_ERROR,
  SET_WORKSPACE,
  SET_IMMERSION_MODE,
  SET_HELP_MODE,
  SET_EDITING_LABEL,
  ADD_NEW_LABEL,
} from './actionTypes'
import DirectoryOperations from 'operations/DirectoryOperations'

export const setLocale = (locale = '') => {
  return (dispatch) => {
    dispatch({ type: SET_LOCALE, payload: locale })
  }
}

export const setImmersionMode = (immersionMode = false) => {
  return (dispatch, getState) => {
    if (immersionMode && getState().locale.workspace) {
      getWorkspaceLabels(getState().locale.locale, getState().locale.workspace, immersionMode, dispatch)
    } else {
      dispatch({ type: SET_IMMERSION_MODE, payload: immersionMode })
    }
  }
}

export const setEditingLabel = (editingLabel = null) => {
  return (dispatch) => {
    dispatch({ type: SET_EDITING_LABEL, payload: editingLabel })
  }
}

export const setIntlWorkspace = (workspace = '') => {
  return (dispatch, getState) => {
    if (getState().locale.immersionMode && workspace) {
      getWorkspaceLabels(getState().locale.intlService.locale, workspace, getState().locale.immersionMode, dispatch)
    }
    dispatch({ type: SET_WORKSPACE, payload: workspace })
  }
}

/**
 * Assumes you're within a workspace
 * @param {*} label
 * @param {*} labelKey
 */
export const addNewLabelToIntl = (label, labelKey, uuid) => {
  return (dispatch, getState) => {
    const output = updateLabels(
      uuid,
      label,
      labelKey,
      { ...getState().locale.localeLists }[getState().locale.workspace],
      {
        ...getState().locale.labelIds,
      }
    )

    const newLocales = {
      ...getState().locale.localeLists,
      [getState().locale.workspace]: output.locales,
    }

    dispatch({
      type: ADD_NEW_LABEL,
      payload: {
        locales: newLocales,
        ids: output.ids,
      },
    })
  }
}

function getWorkspaceLabels(locale, workspace, immersionMode, dispatch) {
  function _getImmersiveWords() {
    return DirectoryOperations.getDocumentsViaResultSetQuery(
      workspace,
      'FVLabel',
      'dc:title, fvlabel:labelKey, ecm:uuid'
    ).then((result) => {
      let translations = {}
      let ids = {}
      result.entries.forEach((entry) => {
        const output = updateLabels(entry['ecm:uuid'], entry['dc:title'], entry['fvlabel:labelKey'], translations, ids)
        translations = output.locales
        ids = output.ids
      })
      return {
        translations,
        ids,
      }
    })
  }

  dispatch({ type: FV_LABELS_FETCH_START })

  return _getImmersiveWords()
    .then(({ translations, ids }) => {
      dispatch({
        type: FV_LABELS_FETCH_SUCCESS,
        payload: {
          labels: translations,
          labelIds: ids,
          workspace,
          locale,
          immersionMode,
        },
      })
    })
    .catch((error) => {
      dispatch({ type: FV_LABELS_FETCH_ERROR, error: error })
    })
}

export const toggleHelpMode = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_HELP_MODE,
      payload: !getState().locale.isInHelpMode,
    })
  }
}

function updateLabels(id, label, labelPath, locales, ids) {
  let translationTargetRef = locales || {}
  let idsTargetRef = ids
  const path = labelPath.split('.')

  path.slice(0, -1).forEach((step) => {
    if (!translationTargetRef[step]) {
      translationTargetRef[step] = {}
      idsTargetRef[step] = {}
    }
    translationTargetRef = translationTargetRef[step]
    idsTargetRef = idsTargetRef[step]
  })
  translationTargetRef[path[path.length - 1]] = label
  idsTargetRef[path[path.length - 1]] = id

  return {
    locales,
    ids,
  }
}
