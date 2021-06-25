import { useEffect, useState } from 'react'
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
  const { status, isLoading, error, isError, data } = useQuery(
    ['categories', uid],
    () => api.category.get({ siteId: uid, parentsOnly: 'true', inUseOnly: 'false' }),
    {
      enabled: !!uid, // The query will not execute until the siteId exists
    }
  )

  const [categoriesToShow, setCategoriesToShow] = useState([])
  const [filter, setFilter] = useState('all')

  function filterCategories(category) {
    return category.type === filter
  }

  useEffect(() => {
    if (data && status === 'success' && !isError) {
      if (filter === 'word' || filter === 'phrase') {
        const filteredCategories = data?.categories?.filter(filterCategories)
        setCategoriesToShow(filteredCategories)
      } else {
        setCategoriesToShow(data?.categories)
      }
    }
  }, [status, filter])

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    categories: categoriesToShow,
    filter,
    isLoading: isLoading || status === 'idle' || isError,
    setFilter,
    sitename,
  }
}

export default CategoriesData
