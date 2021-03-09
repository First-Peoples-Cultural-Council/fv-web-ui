import { useQuery } from 'react-query'
import ky from 'ky'
import { TIMEOUT } from 'services/api/config'
const api = ky.create({
  timeout: TIMEOUT,
})

const formatResponse = (response, dataAdaptor) => {
  const { isLoading, error, data } = response
  if (isLoading === false && error === null && data && dataAdaptor) {
    const transformedData = dataAdaptor(Object.assign({}, data))
    return { isLoading, error, data: transformedData, dataOriginal: data }
  }
  return { isLoading, error, data, dataOriginal: data }
}

const queryOptions = {
  retry: (failureCount, { message: status }) => {
    if (status !== '404' && status !== '401') {
      return false
    }
    return failureCount > 2
  },
}

const get = ({ path, headers }) => {
  return api.get(path, headers).json()
}

const post = ({ path, bodyObject, headers }) => {
  return api.post(path, { json: bodyObject, headers }).json()
}

export default {
  get,
  // rawGetById is getById without useQuery - bypasses cache
  rawGetById: (id, dataAdaptor, properties = '*') => {
    return get({ path: `/nuxeo/api/v1/id/${id}?properties=${properties}` }).then(
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
    const response = useQuery(
      ['getAlphabet', language],
      async () => {
        return await post({
          path: '/nuxeo/api/v1/automation/Document.EnrichedQuery',
          bodyObject: {
            params: {
              language: 'NXQL',
              sortBy: 'fvcharacter:alphabet_order',
              sortOrder: 'asc',
              query: `SELECT * FROM FVCharacter WHERE ecm:path STARTSWITH '/FV/sections/Data/Test/Test/${language}/Alphabet' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 `,
            },
            context: {},
          },
          headers: { 'enrichers.document': 'character' },
        })
      },
      queryOptions
    )
    return formatResponse(response, dataAdaptor)
  },
  getById: (id, dataAdaptor, properties = '*') => {
    const response = useQuery(
      ['getById', id],
      async () => {
        return await get({ path: `/nuxeo/api/v1/id/${id}?properties=${properties}` })
      },
      queryOptions
    )
    return formatResponse(response, dataAdaptor)
  },
  getSections: (sitename, dataAdaptor) => {
    const response = useQuery(
      ['getSections', sitename],
      async () => {
        return await get({ path: `/nuxeo/api/v1/site/sections/${sitename}` })
      },
      queryOptions
    )
    return formatResponse(response, dataAdaptor)
  },
  // TODO: remove postman example server url
  getCommunityHome: (sitename, dataAdaptor) => {
    const response = useQuery(['getCommunityHome', sitename], async () => {
      return await get({
        path: `https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/api/v1/site/sections/${sitename}/pages/home`,
      })
    })
    return formatResponse(response, dataAdaptor)
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
    // TODO: Confirm this path and params when FW-2106 BE is complete and handle success response in UI
    return post({ path: '/nuxeo/site/automation/Document.Mail', bodyObject: { params: params, input: docId } })
  },
  getUser: (dataAdaptor) => {
    const response = useQuery('getUser', async () => {
      return await get({
        path: '/nuxeo/api/v1/me/',
      })
    })
    return formatResponse(response, dataAdaptor)
  },
}
