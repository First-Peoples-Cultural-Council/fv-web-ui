import { api } from 'services/api/config'

const search = {
  get: async ({ query, siteId, type }) => {
    return await api
      .get(`customSearch?q=${query}&docType=${type}&domain=ENGLISH&parentPath=/FV/sections&parentId=${siteId}`)
      .json()
  },
}

export default search
