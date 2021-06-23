import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

//FPCC
import useGetSite from 'common/useGetSite'
import api from 'services/api'
import { triggerError } from 'common/navigationHelpers'
/**
 * @summary CategoriesData
 * @component
 *
 * @param {object} props
 *
 */
function CategoriesData() {
  const { uid } = useGetSite()
  const { sitename } = useParams()
  const history = useHistory()

  // Data fetch
  const response = useQuery(
    ['categories', uid],
    () => api.category.get({ siteId: 'ea255adb-1d8e-41ea-9834-0ef9851f1189' }),
    {
      // The query will not execute until the siteId exists
      enabled: !!uid,
    }
  )
  const { status, isLoading, error, isError, data } = response

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [status, isError])

  return {
    categories: data?.categories,
    isLoading: isLoading || status === 'idle' || isError,
    sitename,
  }
}

export default CategoriesData
