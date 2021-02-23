import api from 'services/api'
import useGetSections from 'common/useGetSections'
import homeAdaptor from 'components/Home/homeAdaptor'
/**
 * @summary HomeData
 * @component
 *
 * @param {object} props
 *
 */
// TODO: REMOVE HARDCODED LANGUAGE DEFAULT
function HomeData() {
  const { title, uid, path, logoUrl } = useGetSections()
  const { isLoading, error, data, dataOriginal } = api.getCommunityHome(title, homeAdaptor)

  return {
    isLoading,
    error,
    data,
    dataOriginal,
    language: {
      title,
      uid,
      path,
      logoUrl,
    },
  }
}

export default HomeData
