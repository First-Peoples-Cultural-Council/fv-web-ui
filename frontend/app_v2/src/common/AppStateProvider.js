import PropTypes from 'prop-types'
import useRoute from 'app_v1/useRoute'
import React, { useReducer, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppStateContext from 'common/AppStateContext'
import AudioMachineData from 'components/AudioMachine/AudioMachineData'
import api from 'services/api'

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

function reducer(state, action) {
  if (action.type === 'api.getSections') {
    // NOTE: logoUrl is added via api.getSections.logo
    // If we don't do the following test the logoUrl will be lost
    if (state.api.getSections.uid === action.payload.uid) {
      state.api.getSections = { ...state.api.getSections, ...action.payload }
    } else {
      state.api.getSections = action.payload
    }
  }
  if (action.type === 'api.getSections.logo') {
    const { logoUrl, uid } = action.payload
    if (state.api.getSections.uid === uid) {
      state.api.getSections = { ...state.api.getSections, logoUrl }
    }
  }
  return state

  // switch (action.type) {
  //   case 'api.getSections': {
  //     state.api.getSections = action.payload
  //     return state
  //   }
  //   default:
  //     return state
  // }
}
function AppStateProvider({ children }) {
  const [getLogoUrl, setGetLogoUrl] = useState(false)
  const { language } = useParams()
  const { machine, send } = AudioMachineData()
  const [state, dispatch] = useReducer(reducer, {
    api: {
      getSections: {},
    },
  })
  // NOTE: using getLogoUrl flag because I was having troubles getting
  // useEffect to respond to changes within state.api.getSections.idLogo
  useEffect(() => {
    setGetLogoUrl(false)
  }, [language])

  // Get language data
  const { isLoading: sectionsIsLoading, error: sectionsError, data: sectionsData } = api.getSections(
    language,
    getSectionsAdaptor
  )
  useEffect(() => {
    if (sectionsIsLoading === false && sectionsError === null) {
      dispatch({ type: 'api.getSections', payload: sectionsData })
      // toggle getLogoUrl flag
      setGetLogoUrl(true)
    }
  }, [sectionsIsLoading, sectionsError])

  // Get language logo
  const logoId = state.api.getSections.idLogo
  useEffect(() => {
    if (logoId) {
      api.rawGetById(logoId, rawGetByIdAdaptor).then(({ error: rawGetByIdError, data: rawGetByIdData }) => {
        if (rawGetByIdError === undefined) {
          const { url } = rawGetByIdData
          dispatch({ type: 'api.getSections.logo', payload: { logoUrl: url, uid: sectionsData.uid } })
        }
      })
    }
  }, [getLogoUrl])

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
