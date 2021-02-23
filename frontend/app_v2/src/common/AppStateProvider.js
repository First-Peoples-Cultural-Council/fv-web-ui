import PropTypes from 'prop-types'
import React, { useReducer, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import useRoute from 'app_v1/useRoute'
import AppStateContext from 'common/AppStateContext'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'
import api from 'services/api'
import { reducerInitialState, reducer } from 'common/reducer'
export function getSectionsAdaptor(response) {
  const {
    title,
    uid,
    path,
    logoId: idLogo,
    // parentLanguageTitle,
  } = response
  return {
    title,
    uid,
    path,
    idLogo,
  }
}
export function rawGetByIdAdaptor(response) {
  const fileContent = response?.properties?.['file:content'] || {}
  return {
    url: fileContent.data,
    mimeType: fileContent['mime-type'],
    name: fileContent.name,
  }
}

function AppStateProvider({ children }) {
  const queryClient = useQueryClient()
  const { language } = useParams()
  const { machine, send } = AudioMachineData()
  const [state, dispatch] = useReducer(reducer, reducerInitialState)
  // Get language data
  const { isLoading: sectionsIsLoading, error: sectionsError, data: sectionsData } = api.getSections(
    language,
    getSectionsAdaptor
  )
  useEffect(() => {
    if (sectionsIsLoading === false && sectionsError === null) {
      dispatch({ type: 'api.getSections', payload: sectionsData })
    }
  }, [sectionsIsLoading, sectionsError])

  // Get language logo
  const logoId = state.api.getSections.idLogo
  useEffect(() => {
    if (state.api.getSections.idLogo) {
      api.rawGetById(logoId, rawGetByIdAdaptor).then(({ error: rawGetByIdError, data: rawGetByIdData }) => {
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

  // Set routeParams over in V1 (eg: used for displaying words)
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
