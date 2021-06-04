import { api } from 'services/config'

const site = {
  get: async (sitename) => {
    return await api.get(`site/${sitename}`).json()
  },
}

export default site
