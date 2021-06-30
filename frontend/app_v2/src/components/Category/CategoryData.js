import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'

// FPCC
import CategoriesData from 'components/Categories/CategoriesData'
import useGetSite from 'common/useGetSite'
import { triggerError } from 'common/navigationHelpers'
import useIntersectionObserver from 'common/useIntersectionObserver'
import api from 'services/api'

/**
 * @summary CategoryData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function CategoryData() {
  const { uid } = useGetSite()
  const history = useHistory()
  const location = useLocation()
  const { sitename, categoryId } = useParams()
  const { categories, categoriesResponse } = CategoriesData()

  const docType = new URLSearchParams(location.search).get('docType')
    ? new URLSearchParams(location.search).get('docType')
    : 'WORDS_AND_PHRASES'

  const query = `?&docType=${docType}&perPage=100&sortBy=entry&category=${categoryId}`

  // Param options: perPage=100&page=1&kidsOnly=false&gamesOnly=false&sortBy=entry&docType=WORDS_AND_PHRASES&sortAscending=true&q=Appla&alphabetCharacter=A
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ['category', query],
    ({ pageParam = 1 }) => api.dictionary.get({ sitename: uid, query: query, pageParam: pageParam }),
    {
      // The query will not execute until the siteId exists and a search term has been provided
      enabled: !!uid,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const [currentCategory, setCurrentCategory] = useState({})
  const [currentParentCategory, setCurrentParentCategory] = useState(null)

  useEffect(() => {
    if (categoriesResponse?.data && categoriesResponse?.status === 'success' && !categoriesResponse?.isError) {
      // using the raw response from CategoriesData to find selected category, as 'categories' is a nested array of parents and children)
      const selectedCategory = categoriesResponse?.data?.categories?.find((category) => category?.id === categoryId)
      if (selectedCategory?.id !== currentCategory?.id) {
        setCurrentCategory(selectedCategory)
        setCurrentParentCategory(selectedCategory?.parentId)
      }
    }
  }, [categoriesResponse?.status, currentCategory])

  const onCategoryClick = (category) => {
    setCurrentCategory(category)
    setCurrentParentCategory(category?.parentId)
  }

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  const loadButtonRef = useRef()
  let loadButtonLabel = ''
  if (isFetchingNextPage) {
    loadButtonLabel = 'Loading more...'
  } else if (hasNextPage) {
    loadButtonLabel = 'Load more'
  } else {
    loadButtonLabel = 'Nothing more to load'
  }

  useIntersectionObserver({
    target: loadButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  // Props needed for infinite scroll
  const infiniteScroll = { fetchNextPage, hasNextPage, isFetchingNextPage, loadButtonLabel, loadButtonRef }

  return {
    categories,
    categoriesAreLoading: categoriesResponse?.isLoading,
    isLoading: isLoading || isError,
    items: data ? data : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
    infiniteScroll,
    currentCategory,
    currentParentCategory,
    onCategoryClick,
    docType,
  }
}

export default CategoryData
