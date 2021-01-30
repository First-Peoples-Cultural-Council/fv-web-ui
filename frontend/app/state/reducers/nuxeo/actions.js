import selectn from 'selectn'
import BaseOperations from 'operations/BaseOperations'
import UserOperations from 'operations/UserOperations'
import { setImmersionMode } from 'reducers/locale'

import { CONNECT, GET_CURRENT_USER_START, GET_CURRENT_USER_SUCCESS, GET_CURRENT_USER_ERROR } from './actionTypes'

/**
 * Actions: Represent that something happened
 */
export const nuxeoConnect = () => {
  return async (dispatch) => {
    // console.log('! nuxeoConnect 1')
    await BaseOperations.initClient()
    // console.log('! nuxeoConnect 2')
    const properties = await BaseOperations.getProperties()
    // console.log('! nuxeoConnect 3')
    dispatch({ type: CONNECT, client: properties.client })
  }
}

export const getCurrentUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: GET_CURRENT_USER_START })

    return UserOperations.getCurrentUser()
      .then((response) => {
        let immersionLookup = selectn('properties.languagePreference', response)
        dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })

        if (response.isAnonymous &&
          localStorage !== null && localStorage !== undefined
          && Object.prototype.hasOwnProperty.call(localStorage, 'intl-service-immersion-mode')) {
          // For anonymous users retrieve persistant immersion from local storage
          immersionLookup = localStorage.getItem('intl-service-immersion-mode')
        }

        setImmersionMode(immersionLookup === 'true')(dispatch, getState)
      })
      .catch((error) => {
        dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
      })
  }
}

export const updateCurrentUser = (languagePreference = false) => {
  return (dispatch, getState) => {
    const userId = selectn('nuxeo.computeLogin.response.id', getState())
    setImmersionMode(languagePreference)(dispatch, getState)
    if (userId !== 'Guest') {
      dispatch({ type: GET_CURRENT_USER_START })
      return UserOperations.fvUpdateUser(selectn('nuxeo.computeLogin.response.id', getState()), languagePreference.toString()).then(() => {
        return UserOperations.getCurrentUser()
          .then((response) => {
            dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
          })
          .catch((error) => {
            dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
          })
      })
    }
    // user local storage
    localStorage.setItem('intl-service-immersion-mode', languagePreference)

    return UserOperations.getCurrentUser()
      .then((response) => {
        dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
      })
      .catch((error) => {
        dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
      })
  }
}
