import { api } from 'services/config'

const home = {
  get: async (sitename) => {
    return await api
      .get(`https://55a3e5b9-4aac-4955-aa51-4ab821d4e3a1.mock.pstmn.io/api/v1/site/sections/${sitename}/pages/home`, {
        prefixUrl: '',
      })
      .json()
  },
}

export default home
