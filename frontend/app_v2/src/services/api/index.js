import { useQuery } from 'react-query'
import { api } from 'services/api/config'

import responseFormatter from 'services/api/helpers/responseFormatter'

export default {
  getAlphabet: (sitename, dataAdaptor) => {
    const response = useQuery(['getAlphabet', sitename], async () => {
      return await api
        .post('automation/Document.EnrichedQuery', {
          json: {
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
        .json()
    })
    return responseFormatter(response, dataAdaptor)
  },
  getById: (id, queryKey, dataAdaptor, properties = '*') => {
    const response = useQuery([queryKey, id], async () => {
      return await api.get(`id/${id}?properties=${properties}`).json()
    })
    return responseFormatter(response, dataAdaptor)
  },
  getSite: (sitename, dataAdaptor) => {
    const response = useQuery(['getSite', sitename], async () => {
      return await api.get(`site/sections/${sitename}`).json()
    })
    return responseFormatter(response, dataAdaptor)
  },
  // TODO: remove postman example server url
  getHome: (sitename, dataAdaptor) => {
    const response = useQuery(['getHome', sitename], async () => {
      return await api
        .get(`https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/api/v1/site/sections/${sitename}/pages/home`, {
          prefixUrl: '',
        })
        .json()
    })
    return responseFormatter(response, dataAdaptor)
  },
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
    return api.post('nuxeo/site/automation/Document.Mail', { json: { params: params, input: docId } }).json()
  },
  getUser: (dataAdaptor) => {
    const response = useQuery('getUser', async () => {
      return await api.get('me/').json()
    })
    return responseFormatter(response, dataAdaptor)
  },
}
