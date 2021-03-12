/* global ENV_API_URL */
import ky from 'ky'

export const api = ky.create({
  prefixUrl: ENV_API_URL,
  timeout: 60000,
})
