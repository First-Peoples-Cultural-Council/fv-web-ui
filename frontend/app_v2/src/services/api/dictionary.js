import { api } from 'services/config'

const dictionary = {
  get: async ({ sitename, query, pageParam }) => {
    const response = await api.get(`dictionary/${sitename}${query}&page=${pageParam}`).json()
    const lastPage = Math.ceil(response?.statistics?.resultCount / 5)
    const nextPage = pageParam >= lastPage ? undefined : pageParam + 1
    return { ...response, nextPage: nextPage, lastPage: lastPage }
  },
}

export default dictionary
