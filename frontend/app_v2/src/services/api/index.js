/* DISABLEglobals ENV_NUXEO_URL */
import { useQuery } from 'react-query'
import ky from 'ky'
import { /*BASE_URL,*/ TIMEOUT } from 'services/api/config'
const api = ky.create({
  timeout: TIMEOUT,
})

// const getNuxeoURL = () => {
//   if (ENV_NUXEO_URL !== null && typeof ENV_NUXEO_URL !== 'undefined') {
//     return ENV_NUXEO_URL
//   }
//   return '/nuxeo'
// }
const queryOptions = {
  retry: (count, { message: status }) => status !== '404' && status !== '401',
}
const handleSuccessAndError = (response) => {
  if (response.ok === false) {
    throw new Error(response.status)
  }
  return response
}
const get = (path) => {
  return api.get(path).then(
    (response) => {
      return response.json()
    },
    ({ response }) => {
      return response
    }
  )
}
// const post = (path, bodyObject) => {
//   const api = ky.create({
//     timeout: TIMEOUT,
//   })
//   return api.post(path, { json: bodyObject }).then(() => {
//     return
//   })
// }

export default {
  get,
  rawGetById: (id, dataAdaptor) => {
    return get(`/nuxeo/api/v1/id/${id}?properties=*`)
      .then(handleSuccessAndError)
      .then(
        (response) => {
          if (dataAdaptor) {
            return { isLoading: false, data: dataAdaptor(response), dataOriginal: response }
          }
          return { isLoading: false, data: response, dataOriginal: response }
        },
        (error) => {
          return { isLoading: false, error }
        }
      )
  },
  getById: (id, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['id', id],
      () => {
        return get(`/nuxeo/api/v1/id/${id}?properties=*`).then(handleSuccessAndError)
      },
      queryOptions
    )
    if (isLoading === false && error === null && data && dataAdaptor) {
      const transformedData = dataAdaptor(Object.assign({}, data))
      return { isLoading, error, data: transformedData, dataOriginal: data }
    }
    return { isLoading, error, data, dataOriginal: data }
  },
  getSections: (sitename, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['sections', sitename],
      () => {
        return get(`/nuxeo/api/v1/site/sections/${sitename}`).then(handleSuccessAndError)
      },
      queryOptions
    )
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
