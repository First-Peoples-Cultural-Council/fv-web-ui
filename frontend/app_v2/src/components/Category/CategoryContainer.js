import React from 'react'

// FPCC
import CategoryPresentation from 'components/Category/CategoryPresentation'
import CategoryData from 'components/Category/CategoryData'
import Loading from 'components/Loading'

/**
 * @summary CategoryContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoryContainer() {
  const {
    categories,
    categoriesAreLoading,
    isLoading,
    items,
    actions,
    docType,
    moreActions,
    sitename,
    infiniteScroll,
    currentCategory,
    currentParentCategory,
    onCategoryClick,
  } = CategoryData()
  return (
    <Loading.Container isLoading={categoriesAreLoading}>
      <CategoryPresentation
        actions={actions}
        docType={docType}
        isLoading={isLoading}
        items={items}
        moreActions={moreActions}
        sitename={sitename}
        infiniteScroll={infiniteScroll}
        categories={categories}
        currentCategory={currentCategory}
        currentParentCategory={currentParentCategory}
        onCategoryClick={onCategoryClick}
      />
    </Loading.Container>
  )
}

export default CategoryContainer
