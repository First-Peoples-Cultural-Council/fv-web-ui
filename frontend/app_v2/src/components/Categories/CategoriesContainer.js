import React from 'react'
import Loading from 'components/Loading'
import CategoriesPresentation from 'components/Categories/CategoriesPresentation'
import CategoriesData from 'components/Categories/CategoriesData'

/**
 * @summary CategoriesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function CategoriesContainer() {
  const { categories, isLoading, sitename } = CategoriesData()
  return (
    <Loading.Container isLoading={isLoading}>
      <CategoriesPresentation categories={categories} sitename={sitename} />
    </Loading.Container>
  )
}

export default CategoriesContainer
