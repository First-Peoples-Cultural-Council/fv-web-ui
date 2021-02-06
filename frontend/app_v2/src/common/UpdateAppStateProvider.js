// import PropTypes from 'prop-types'
// import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from 'services/api'
// import AppStateContext from 'common/AppStateContext'

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
  const { isLoading, error, data } = api.getSections(language, adaptor)
  if (isLoading === false && error === null) {
    // eslint-disable-next-line
    console.log('Update the AppStateContext with', { data })
  }
  return null
}
// PROPTYPES
// const { node } = PropTypes
UpdateAppStateProvider.propTypes = {
  //   children: node,
}

export default UpdateAppStateProvider
