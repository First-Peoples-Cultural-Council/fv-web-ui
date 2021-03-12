import api from 'services/api'
import { useParams } from 'react-router-dom'
import useGetSite from 'common/useGetSite'
import getHomeAdaptor from 'services/api/adaptors/getHome'
/**
 * @summary HomeData
 * @component
 *
 * @param {object} props
 *
 */
function HomeData() {
  const { sitename } = useParams()
  const { title, uid, path, logoUrl } = useGetSite()

  const { isLoading, error, data, dataOriginal } = api.getHome(sitename, getHomeAdaptor)
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
