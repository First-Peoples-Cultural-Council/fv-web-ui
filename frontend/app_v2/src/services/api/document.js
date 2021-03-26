import { api } from 'services/config'

const document = {
  get: async (id, properties = '*') => {
    return await api.get(`id/${id}?properties=${properties}`).json()
  },
}

export default document
