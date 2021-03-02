/* DISABLEglobals ENV_NUXEO_URL */
import { useQuery } from 'react-query'
import ky from 'ky'
import { /*BASE_URL,*/ TIMEOUT } from 'services/api/config'
const api = ky.create({
  timeout: TIMEOUT,
})

const formatResponse = ({ isLoading, error, data, dataAdaptor }) => {
  if (isLoading === false && error === null && data && dataAdaptor) {
    const transformedData = dataAdaptor(Object.assign({}, data))
    return { isLoading, error, data: transformedData, dataOriginal: data }
  }
  return { isLoading, error, data, dataOriginal: data }
}

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

const get = ({ path, headers }) => {
  return (
    api
      .get(path, headers)
      //.then(handleSuccessAndError) // TODO?
      // TODO: CHECK IF NEEDED, POSSIBLY REMOVE BELOW
      .then(
        (response) => {
          return response.json()
        },
        ({ response }) => {
          return response
        }
      )
  )
}

const post = ({ path, bodyObject, headers }) => {
  return api
    .post(path, { json: bodyObject, headers })
    .then(handleSuccessAndError)
    .then(
      (response) => {
        return response.json()
      },
      ({ response }) => {
        return response
      }
    )
}

export default {
  get,
  rawGetById: (id, dataAdaptor) => {
    return get({ path: `/nuxeo/api/v1/id/${id}?properties=*` })
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
  getAlphabet: (language, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['getAlphabet', language],
      () => {
        if (language) {
          // TODO handle all variations of 'language' i.e. ensure language name is url friendly / matches path
          const _language = language.replace(/'/g, "\\'")
          return post({
            path: '/nuxeo/api/v1/automation/Document.EnrichedQuery',
            bodyObject: {
              params: {
                language: 'NXQL',
                sortBy: 'fvcharacter:alphabet_order',
                sortOrder: 'asc',
                query: `SELECT * FROM FVCharacter WHERE ecm:path STARTSWITH '/FV/sections/Data/Test/Test/${_language}/Alphabet' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 `,
              },
              context: {},
            },
            headers: { 'enrichers.document': 'character' },
          })
        }
      },
      queryOptions
    )
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  // getCharacter is currently not being used - drop if not needed in v2
  getCharacter: (character, language, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['getCharacter', character],
      () => {
        if (language && character) {
          const _language = language.replace(/'/g, "\\'")
          return get({
            path: `/nuxeo/api/v1/path/FV/sections/Data/Test/Test/${_language}/Alphabet/${character}`,
            headers: { 'enrichers.document': 'ancestry, character, permissions', properties: '*' },
          }).then(handleSuccessAndError)
        }
      },
      queryOptions
    )
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  getById: (id, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['getById', id],
      () => {
        return get({ path: `/nuxeo/api/v1/id/${id}?properties=*` }).then(handleSuccessAndError)
      },
      queryOptions
    )
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  getSections: (sitename, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(
      ['getSections', sitename],
      () => {
        return get({ path: `/nuxeo/api/v1/site/sections/${sitename}` }).then(handleSuccessAndError)
      },
      queryOptions
    )
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  // TODO: remove postman example server url
  getCommunityHome: (sitename, dataAdaptor) => {
    const { isLoading, error, data } = useQuery(['getCommunityHome', sitename], () => {
      return get({
        path: `https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/api/v1/site/sections/${sitename}/pages/home`,
      })
    })
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  post,
  postMail: ({ docId, from, message, name, to }) => {
    const params = {
      from,
      message,
      subject: 'FirstVoices Language enquiry from ' + name,
      HTML: 'false',
      rollbackOnError: 'true',
      viewId: 'view_documents',
      bcc: 'hello@firstvoices.com',
      cc: '',
      files: '',
      replyto: from,
      to,
    }
    // TODO: Update this path when BE ready and handle success response in UI
    return post({ path: '/nuxeo/site/automation/Document.Mail', bodyObject: { params: params, input: docId } })
  },
  postUserGet: (dataAdaptor) => {
    const { isLoading, error, data } = useQuery('postUserGet', () => {
      return post({
        path: '/nuxeo/api/v1/automation/User.Get',
        bodyObject: { params: {}, context: {} },
        headers: { properties: '*' },
      })
    })
    return formatResponse({ isLoading, error, data, dataAdaptor })
  },
  // TODO: remove postman example server url
  postWorkspaceSetting: (workpaceValue, dataAdaptor) => {
    return post({
      path: 'https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/nuxeo/api/v1/automation/User.Workspace',
      bodyObject: { params: { value: workpaceValue }, context: {} },
      // headers: { properties: '*' },
    }).then((response) => {
      return formatResponse({ isLoading: false, error: [], data: response, dataAdaptor })
    })
  },
}
