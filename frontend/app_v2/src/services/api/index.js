import apiErrorHandler from 'services/api/apiErrorHandler'
import { /*BASE_URL,*/ TIMEOUT } from 'services/api/config'
// import ky from 'ky'
const ky = () => {
  return {
    create: () => {},
    get: () => {},
  }
}
const get = (path) => {
  const api = ky.create({
    timeout: TIMEOUT,
  })
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
  getSomethingSpecific: (path) => {
    return get(path)
  },
}
