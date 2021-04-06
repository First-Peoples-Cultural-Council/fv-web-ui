import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

//FPCC
import api from 'services/api'
import useGetSite from 'common/useGetSite'
import homeDataAdaptor from 'components/Home/homeDataAdaptor'
import { getMediaUrl } from 'common/urlHelpers'
/**
 * @summary HomeData
 * @component
 *
 * @param {object} props
 *
 */
function HomeData() {
  const { sitename } = useParams()
  const history = useHistory()
  const { title, uid, path, logoId } = useGetSite()
  const [formattedData, setFormattedData] = useState({})
  const logoUrl = getMediaUrl({ type: 'image', id: logoId, viewName: 'Small' })

  const { data, error, isError, isLoading } = useQuery(['getHome', sitename], () => api.home.get(sitename))

  useEffect(() => {
    if (isLoading === false && error === null) {
      setFormattedData(homeDataAdaptor(data))
    }
    if (isError)
      // Setting the errorStatusCode will trigger the render of the ErrorHandler component
      history.replace(history.location.pathname, {
        errorStatusCode: error?.response?.status,
      })
  }, [isLoading, error])

  useEffect(() => {}, [isError])

  return {
    isLoading,
    error,
    data: formattedData,
    language: {
      title,
      uid,
      path,
      logoUrl,
    },
  }
}

export default HomeData
