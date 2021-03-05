import PropTypes from 'prop-types'
import React, { useReducer, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import useLocalStorage from 'react-use-localstorage'
import useRoute from 'app_v1/useRoute'

import AppStateContext from 'common/AppStateContext'
import { reducerInitialState, reducer } from 'common/reducer'

import api from 'services/api'
import getSectionsAdaptor from 'services/api/adaptors/getSections'
import rawGetByIdAdaptor from 'services/api/adaptors/rawGetById'
import getUserAdaptor from 'services/api/adaptors/getUser'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'
import MenuMachineData from 'components/MenuMachine/MenuMachineData'
function AppStateProvider({ children }) {
  const [workspaceToggle, setWorkspaceToggle] = useLocalStorage('fpcc:workspaceToggle', false)
  const queryClient = useQueryClient()
  const { language } = useParams()
  const { machine, send } = AudioMachineData()
  const { machine: menuMachine, send: menuSend } = MenuMachineData()
  const [state, dispatch] = useReducer(reducer, reducerInitialState)

  // Get language data
  // --------------------------------
  const { isLoading: sectionsIsLoading, error: sectionsError, data: sectionsData } = api.getSections(
    language,
    getSectionsAdaptor
  )
  useEffect(() => {
    if (sectionsIsLoading === false && sectionsError === null) {
      dispatch({ type: 'api.getSections', payload: sectionsData })
    }
  }, [sectionsIsLoading, sectionsError])

  // Get user data
  // --------------------------------
  const { isLoading: isLoadingGetUser, error: errorGetUser, data: dataGetUser } = api.getUser(getUserAdaptor)
  useEffect(() => {
    if (isLoadingGetUser === false && errorGetUser === null) {
      dispatch({ type: 'api.getUser', payload: dataGetUser })
    }
  }, [isLoadingGetUser, errorGetUser])

  // Get language logo
  // --------------------------------
  const logoId = state.api.getSections.idLogo
  useEffect(() => {
    if (state.api.getSections.idLogo) {
      api.rawGetById(logoId, rawGetByIdAdaptor, 'file').then(({ error: rawGetByIdError, data: rawGetByIdData }) => {
        if (rawGetByIdError === undefined) {
          const { url } = rawGetByIdData
          // IMPORTANT: have to invalidate sections cache since
          // react-query will suppress a rerender
          // and child components will not get the updated data
          queryClient.invalidateQueries(['sections', sectionsData.title])
          dispatch({ type: 'api.getSections.logo', payload: { logoUrl: url, uid: sectionsData.uid } })
        }
      })
    }
  }, [state.api.getSections.idLogo])

  // Sets internal Redux > routeParams value over in V1
  // (eg: used for displaying words)
  // --------------------------------
  const path = sectionsData?.path
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
