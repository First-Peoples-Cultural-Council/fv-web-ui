import api from 'services/api'
import useGetSections from 'common/useGetSections'
import getCommunityHomeAdaptor from 'services/api/adaptors/getCommunityHome'
/**
 * @summary HomeData
 * @component
 *
 * @param {object} props
 *
 */
function HomeData() {
  const { title, uid, path, logoUrl } = useGetSections()
  const { isLoading, error, data, dataOriginal } = api.getCommunityHome(title, getCommunityHomeAdaptor)
  return {
    isLoading,
    error: title === undefined || error,
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
