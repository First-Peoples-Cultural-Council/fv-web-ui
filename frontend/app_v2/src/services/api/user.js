import { api } from 'services/config'

const user = {
  get: async () => {
    return await api.get('me/').json()
  },
}

export default user
