import { api } from 'services/api/config'

const site = {
  get: async (sitename) => {
    return await api.get(`site/sections/${sitename}`).json()
  },
}

export default site
