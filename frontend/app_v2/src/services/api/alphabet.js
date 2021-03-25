import { api } from 'services/api/config'

const alphabet = {
  get: async (siteId) => {
    return await api.get(`alphabet/${siteId}`).json()
  },
}

export default alphabet
