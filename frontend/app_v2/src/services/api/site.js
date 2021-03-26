import { api } from 'services/config'

const site = {
  get: async (sitename) => {
    return await api.get(`site/sections/${sitename}`).json()
  },
}

export default site
