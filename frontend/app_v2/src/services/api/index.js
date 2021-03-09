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

const get = ({ path, headers }) => {
  return api.get(path, headers).json()
}

const post = ({ path, bodyObject, headers }) => {
  return api.post(path, { json: bodyObject, headers }).json()
}

export default {
  get,
  getAlphabet: (sitename, dataAdaptor) => {
    const response = useQuery(['getAlphabet', sitename], async () => {
      return await post({
        path: '/nuxeo/api/v1/automation/Document.EnrichedQuery',
        bodyObject: {
          params: {
            language: 'NXQL',
            sortBy: 'fvcharacter:alphabet_order',
            sortOrder: 'asc',
            query: `SELECT * FROM FVCharacter WHERE ecm:path STARTSWITH '/FV/sections/Data/Test/Test/${sitename}/Alphabet' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 `,
          },
          context: {},
        },
        headers: { 'enrichers.document': 'character' },
      })
    })
    return formatResponse(response, dataAdaptor)
  },
  getById: (id, queryKey, dataAdaptor, properties = '*') => {
    const response = useQuery([queryKey, id], async () => {
      return await get({ path: `/nuxeo/api/v1/id/${id}?properties=${properties}` })
    })
    return formatResponse(response, dataAdaptor)
  },
  getSections: (sitename, dataAdaptor) => {
    const response = useQuery(['getSections', sitename], async () => {
      return await get({ path: `/nuxeo/api/v1/site/sections/${sitename}` })
    })
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
      return await post({
        path: '/nuxeo/api/v1/automation/User.Get',
        bodyObject: { params: {}, context: {} },
        headers: { properties: '*' },
      })
    })
    return formatResponse(response, dataAdaptor)
  },
}
