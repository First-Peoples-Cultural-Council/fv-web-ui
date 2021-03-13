import { api } from 'services/api/config'

const search = {
  get: async ({ query, siteId, type }) => {
    return await api
      .get(`customSearch?q=${query}&domain=ENGLISH&parentPath=/FV/sections&parentId=${siteId}&docType=${type}`)
      .json()
  },
}

export default search
