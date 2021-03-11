import api from 'services/api'
import { useParams } from 'react-router-dom'
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
  const { language } = useParams()
  const { title, uid, path, logoUrl } = useGetSections()

  const site = title || language
  const { isLoading, error, data, dataOriginal } = api.getCommunityHome(site, getCommunityHomeAdaptor)
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
