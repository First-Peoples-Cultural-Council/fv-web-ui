// import PropTypes from 'prop-types'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from 'services/api'
import AppStateContext from 'common/AppStateContext'

export function adaptor(response) {
  const { title, uid, path } = response
  return {
    title,
    uid,
    path,
  }
}
function UpdateAppStateProvider() {
  const { language } = useParams()
  const { reducer } = useContext(AppStateContext)
  const { dispatch } = reducer
  const { isLoading, error, data } = api.getSections(language, adaptor)
  if (isLoading === false && error === null) {
    dispatch({ type: 'api.getSections', payload: data })
  }
  return null
}
// PROPTYPES
// const { node } = PropTypes
UpdateAppStateProvider.propTypes = {
  //   children: node,
}

export default UpdateAppStateProvider
