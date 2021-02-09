// import PropTypes from 'prop-types'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from 'services/api'
import AppStateContext from 'common/AppStateContext'

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
function UpdateAppStateProvider() {
  const { language } = useParams()
  const { reducer } = useContext(AppStateContext)
  const { dispatch, state } = reducer

  const { isLoading: sectionsIsLoading, error: sectionsError, data: sectionsData } = api.getSections(
    language,
    getSectionsAdaptor
  )
  if (sectionsIsLoading === false && sectionsError === null) {
    dispatch({ type: 'api.getSections', payload: sectionsData })
  }
  const logoId = state.api.getSections?.idLogo
  useEffect(() => {
    if (logoId) {
      api.rawGetById(logoId, rawGetByIdAdaptor).then(({ error: rawGetByIdError, data: rawGetByIdData }) => {
        if (rawGetByIdError === undefined) {
          const { url } = rawGetByIdData
          dispatch({ type: 'api.getSections.logo', payload: { logoUrl: url, uid: sectionsData.uid } })
        }
      })
    }
  }, [logoId])

  return null
}
// PROPTYPES
// const { node } = PropTypes
UpdateAppStateProvider.propTypes = {
  //   children: node,
}

export default UpdateAppStateProvider
