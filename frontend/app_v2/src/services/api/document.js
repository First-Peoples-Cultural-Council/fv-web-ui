import { api } from 'services/config'

const document = {
  get: async ({ id, properties = '*', contextParameters = '' }) => {
    return await api.get(`id/${id}?properties=${properties}&enrichers.document=${contextParameters}`).json()
  },
}

export default document
