import { api } from 'services/config'

const search = {
  get: async (query) => {
    return await api.get(`customSearch${query}`).json()
  },
}

export default search
