import { api } from 'services/config'

const alphabet = {
  get: async (siteId) => {
    return await api.get(`alphabet/${siteId}`).json()
  },
}

export default alphabet
