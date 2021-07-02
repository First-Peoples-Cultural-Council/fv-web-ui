import { api } from 'services/config'

const category = {
  get: async ({ siteId, parentsOnly = 'false', inUseOnly = 'false' }) => {
    return await api.get(`category/${siteId}?parentsOnly=${parentsOnly}&inUseOnly=${inUseOnly}`).json()
  },
}

export default category
