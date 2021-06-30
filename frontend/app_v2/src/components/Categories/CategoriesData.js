import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

//FPCC
import useGetSite from 'common/useGetSite'
import api from 'services/api'
import { triggerError } from 'common/navigationHelpers'
import { makePlural } from 'common/urlHelpers'

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
    () => api.category.get({ siteId: uid, parentsOnly: 'false', inUseOnly: 'true' }),
    {
      enabled: !!uid, // The query will not execute until the siteId exists
    }
  )

  const { status, isLoading, error, isError, data } = response

  const [categoriesToShow, setCategoriesToShow] = useState([])
  const [filter, setFilter] = useState('WORDS_AND_PHRASES')

  function filterCategoriesByType(category) {
    return category?.type === filter
  }

  function filterParentCategories(category) {
    return category?.parentId === null
  }

  function getChildren(parentId) {
    return data?.categories?.filter((category) => {
      return category?.parentId === parentId
    })
  }

  useEffect(() => {
    if (data && status === 'success' && !isError) {
      const parentCategories = data?.categories?.filter(filterParentCategories)
      const categoriesInclChildren = parentCategories.map((category) => ({
        ...category,
        children: getChildren(category.id),
      }))
      if (filter === 'WORDS' || filter === 'PHRASES') {
        const filteredCategories = categoriesInclChildren.filter(filterCategoriesByType)
        setCategoriesToShow(filteredCategories)
      } else {
        setCategoriesToShow(categoriesInclChildren)
      }
    }
  }, [status, filter])

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  const tabs = [
    { label: 'WORDS', icon: 'Word', value: 'WORDS', current: filter === 'WORDS' },
    { label: 'PHRASES', icon: 'Phrase', value: 'PHRASES', current: filter === 'PHRASES' },
    { label: 'ALL', icon: 'All', value: 'WORDS_AND_PHRASES', current: filter === 'WORDS_AND_PHRASES' },
  ]

  return {
    categories: categoriesToShow,
    // categoriesResponse is used by CategoryData component
    categoriesResponse: response,
    filter,
    isLoading: isLoading || status === 'idle' || isError,
    setFilter,
    sitename,
    tabs,
  }
}

export default CategoriesData
