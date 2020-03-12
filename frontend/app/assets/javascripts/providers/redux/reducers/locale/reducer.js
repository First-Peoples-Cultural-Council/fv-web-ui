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
import IntlService from '../../../../views/services/intl'
import en from 'views/../locale/locale.en.json'
import fr from 'views/../locale/locale.fr.json'
import sp from 'views/../locale/locale.sp.json'

const startingLocaleLists = {
  en,
  fr,
  sp,
}

const startingLocale = getLocaleFromStorage()

const initialState = {
  localeLists: startingLocaleLists,
  locale: startingLocale, // en, fr, sp
  immersionMode: false,
  intlService: new IntlService(startingLocaleLists, startingLocale, startingLocale),
  workspace: '',
  isInHelpMode: false,
  labelIds: {},
  editingLabel: null,
}

function getLocaleFromStorage() {
  let locale

  if (localStorage !== null && localStorage !== undefined) {
    if (localStorage.hasOwnProperty('intl-service-locale')) {
      locale = localStorage.getItem('intl-service-locale')
    }
  }
  if (locale === null) {
    if (navigator !== null && navigator !== undefined) {
      const ls = navigator.language
      if (ls[0] !== null && ls[0] !== undefined) {
        if (ls[0].search('en') >= 0) {
          locale = 'en'
        } else if (ls[1].search('fr') >= 0) {
          locale = 'fr'
        } else if (ls[1].search('sp') >= 0) {
          locale = 'sp'
        }
      }
    }
  }
  if (!locale) {
    locale = 'en'
  }

  return locale
}

function setLocaleToStorage(locale = '') {
  if (locale) {
    localStorage.setItem('intl-service-locale', locale)
  }
  return
}

export const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      setLocaleToStorage(action.payload)
      return Object.assign({}, state, {
        intlService: new IntlService(
          state.localeLists,
          state.workspace && state.immersionMode ? state.workspace : action.payload,
          action.payload
        ),
        locale: action.payload,
      })
    case SET_IMMERSION_MODE:
      return Object.assign({}, state, {
        intlService: new IntlService(state.localeLists, state.locale, state.locale),
        immersionMode: action.payload,
        isInHelpMode: false,
      })
    case SET_WORKSPACE:
      return Object.assign({}, state, {
        intlService: new IntlService(state.localeLists, state.locale, state.locale),
        workspace: action.payload,
        isInHelpMode: action.payload ? state.isInHelpMode : false,
      })
    case FV_LABELS_FETCH_START:
      return { ...state, fvlabelsFetch: { isFetching: true } }
    case FV_LABELS_FETCH_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const newLocales = {
        ...state.localeLists,
      }
      newLocales[action.payload.workspace] = action.payload.labels
      setLocaleToStorage(action.payload.locale)
      return {
        ...state,
        workspace: action.payload.workspace,
        locale: action.payload.locale,
        immersionMode: action.payload.immersionMode,
        localeLists: newLocales,
        fvlabelsFetch: { isFetching: false, success: true },
        intlService: new IntlService(
          newLocales,
          action.payload.immersionMode ? action.payload.workspace : action.payload.locale,
          action.payload.locale
        ),
        labelIds: action.payload.labelIds,
        isInHelpMode: false,
      }
    case FV_LABELS_FETCH_ERROR:
      return {
        ...state,
        fvlabelsFetch: {
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: false,
        },
        isInHelpMode: false,
      }
    case SET_HELP_MODE:
      return {
        ...state,
        isInHelpMode: action.payload,
      }
    case SET_EDITING_LABEL:
      return {
        ...state,
        editingLabel: action.payload,
      }
    case ADD_NEW_LABEL:

      return {
        ...state,
        localeLists: action.payload.locales,
        intlService: new IntlService(
          action.payload.locales,
          state.immersionMode ? state.workspace : state.locale,
          state.locale
        ),
        labelIds: action.payload.ids,
        isInHelpMode: false,
      }
    default:
      return state
  }
}

