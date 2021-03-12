import PropTypes from 'prop-types'
import React, { useReducer, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useLocalStorage from 'react-use-localstorage'
import useRoute from 'app_v1/useRoute'

import AppStateContext from 'common/AppStateContext'
import { reducerInitialState, reducer } from 'common/reducer'

import api from 'services/api'
import getSiteAdaptor from 'services/api/adaptors/getSite'
import getUserAdaptor from 'services/api/adaptors/getUser'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'
import MenuMachineData from 'components/MenuMachine/MenuMachineData'
function AppStateProvider({ children }) {
  const [workspaceToggle, setWorkspaceToggle] = useLocalStorage('fpcc:workspaceToggle', false)
  const { sitename } = useParams()
  const { machine, send } = AudioMachineData()
  const { machine: menuMachine, send: menuSend } = MenuMachineData()
  const [state, dispatch] = useReducer(reducer, reducerInitialState)

  // Get language data
  // --------------------------------
  const { isLoading: siteIsLoading, error: siteError, data: siteData } = api.getSite(sitename, getSiteAdaptor)
  useEffect(() => {
    if (siteIsLoading === false && siteError === null) {
      dispatch({ type: 'api.getSite', payload: siteData })
    }
  }, [siteIsLoading, siteError])

  // Get user data
  // --------------------------------
  const { isLoading: isLoadingGetUser, error: errorGetUser, data: dataGetUser } = api.getUser(getUserAdaptor)
  useEffect(() => {
    if (isLoadingGetUser === false && errorGetUser === null) {
      dispatch({ type: 'api.getUser', payload: dataGetUser })
    }
  }, [isLoadingGetUser, errorGetUser])

  // Sets internal Redux > routeParams value over in V1
  // (eg: used for displaying words)
  // --------------------------------
  const path = siteData?.path
  const { setRouteParams } = useRoute()
  useEffect(() => {
    if (path) {
      setRouteParams({
        matchedRouteParams: {
          dialect_path: path,
        },
      })
    }
  }, [path])

  return (
    <AppStateContext.Provider
      value={{
        reducer: {
          state,
          dispatch,
        },
        audio: {
          machine,
          send,
        },
        menu: {
          machine: menuMachine,
          send: menuSend,
        },
        workspaceToggle: {
          value: workspaceToggle === 'true',
          set: setWorkspaceToggle,
        },
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}
// PROPTYPES
const { node } = PropTypes
AppStateProvider.propTypes = {
  children: node,
}

export default AppStateProvider
