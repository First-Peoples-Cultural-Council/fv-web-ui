/* DISABLEglobals ENV_NUXEO_URL */
import apiErrorHandler from 'services/api/apiErrorHandler'
import { useQuery } from 'react-query'
import ky from 'ky'
import { /*BASE_URL,*/ TIMEOUT } from 'services/api/config'
const api = ky.create({
  timeout: TIMEOUT,
})

// npm run start --env NUXEO_URL="http://0.0.0.0:3001/nuxeo/site"
// const getBaseURL = () => {
//   if (ENV_NUXEO_URL !== null && typeof ENV_NUXEO_URL !== 'undefined') {
//     return ENV_NUXEO_URL
//   }
//   const { protocol, hostname, port } = window.location
//   return `${protocol}//${hostname}${port ? `:${port}` : ''}/nuxeo`
// }
const get = (path) => {
  return (
    api
      // .get(`${BASE_URL}${path}`)
      .get(path)
      .then((response) => {
        return response.json()
      })
      .catch(apiErrorHandler)
  )
}
// const post = (path, bodyObject) => {
//   const api = ky.create({
//     timeout: TIMEOUT,
//   })
//   return api.post(path, { json: bodyObject }).then(() => {
//     return
//   }, apiErrorHandler)
// }

export default {
  get,
  getSections: (sitename, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(['sections', sitename], () => {
      return get(`/nuxeo/api/v1/site/sections/${sitename}`)
    })
    if (isLoading === false && error === null && data && dataAdaptor) {
      const transformedData = dataAdaptor(Object.assign({}, data))
      return { isLoading, error, data: transformedData, dataOriginal: data }
    }
    return { isLoading, error, data, dataOriginal: data }
  },
  // TODO: remove postman example server url
  getCommunityHome: (sitename, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(['sections', sitename], () => {
      return get(
        `https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/api/v1/site/sections/${sitename}/pages/home`
      )
    })
    if (isLoading === false && error === null && data && dataAdaptor) {
      const transformedData = dataAdaptor(Object.assign({}, data))
      return { isLoading, error, data: transformedData, dataOriginal: data }
    }
    return { isLoading, error, data, dataOriginal: data }
  },
}
