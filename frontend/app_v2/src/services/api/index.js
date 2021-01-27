/* globals ENV_NUXEO_URL */
import apiErrorHandler from 'services/api/apiErrorHandler'
import { /*BASE_URL,*/ TIMEOUT } from 'services/api/config'
import ky from 'ky'
const api = ky.create({
  timeout: TIMEOUT,
})

// npm run start --env NUXEO_URL="http://0.0.0.0:3001/nuxeo/site"
const getBaseURL = () => {
  if (ENV_NUXEO_URL !== null && typeof ENV_NUXEO_URL !== 'undefined') {
    return ENV_NUXEO_URL
  }
  const { protocol, hostname, port } = window.location
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/nuxeo`
}
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
  getSections: (sitename) => {
    return get(`${getBaseURL()}/api/v1/site/sections/${sitename}`)
  },
}
