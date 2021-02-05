import api from 'services/api'
import homeAdaptor from 'components/Home/homeAdaptor'
/**
 * @summary HomeData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 */
// TODO: REMOVE HARDCODED LANGUAGE DEFAULT
function HomeData({ language = 'bÍẕ' } = {}) {
  const { isLoading, error, data, dataOriginal } = api.getCommunityHome(language, homeAdaptor)
  return {
    isLoading,
    error,
    data,
    dataOriginal,
  }
}

export default HomeData
