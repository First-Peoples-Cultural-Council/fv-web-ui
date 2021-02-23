import api from 'services/api'
import useGetSections from 'common/useGetSections'
import useUserGet from 'common/useUserGet'
import getCommunityHomeAdaptor from 'services/api/adaptors/getCommunityHome'
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
  const { isLoading, error, data, dataOriginal } = api.getCommunityHome(title, getCommunityHomeAdaptor)
  const { isWorkspaceOn } = useUserGet()
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
    isWorkspaceOn,
  }
}

export default HomeData
