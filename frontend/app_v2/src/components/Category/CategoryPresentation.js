import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'
import useCategoryIcon from 'common/useCategoryIcon'

/**
 * @summary CategoryPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoryPresentation({
  isLoading,
  items,
  actions,
  docType,
  moreActions,
  sitename,
  infiniteScroll,
  categories,
  currentCategory,
  currentParentCategory,
  onCategoryClick,
}) {
  const getConditionalClass = (category) => {
    if (category.id === currentCategory.id) {
      return 'border-l-4 border-tertiaryB bg-tertiaryB text-white pb-2'
    }
    if (category.parentId === currentCategory.id) {
      return 'border-l-4 border-tertiaryB-light bg-tertiaryB-light text-white'
    }
    return 'text-tertiaryB'
  }

  const getFilterListItems = () => {
    return categories.map((category) => {
      return (
        <li
          key={category.id}
          id={'SearchFilter' + category.id}
          className={`inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow rounded-lg ${getConditionalClass(
            category
          )}`}
        >
          <Link
            className={`transition duration-500 ease-in-out flex items-center  cursor-pointer `}
            to={`/${sitename}/categories/${category.id}?docType=${docType}`}
            onClick={() => onCategoryClick(category)}
          >
            {useCategoryIcon(category.title, 'inline-flex p-2 rounded-lg fill-current h-10 w-10')}
            <div className="inline-flex text-lg font-medium">{category.title}</div>
          </Link>
          {(category.id === currentParentCategory || category.id === currentCategory.id) && (
            <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4">
              {category?.children?.map((child) => {
                console.log('Child', child)
                return (
                  <li
                    key={child.id}
                    className="inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow"
                  >
                    <Link
                      className={`transition duration-500 ease-in-out flex items-center rounded-lg cursor-pointer ${getConditionalClass(
                        child
                      )}`}
                      to={`/${sitename}/categories/${child.id}?docType=${docType}`}
                      onClick={() => onCategoryClick(child)}
                    >
                      {useCategoryIcon(child.title, 'inline-flex p-2 rounded-lg fill-current h-10 w-10')}
                      <div className="inline-flex text-lg font-medium">{child.title}</div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      )
    })
  }
  return (
    <>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-2">
          <h2 className="hidden md:block text-2xl ml-8">Categories</h2>
          <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4">{getFilterListItems()}</ul>
        </div>
        <div className="min-h-220 col-span-11 md:col-span-9">
          <DictionaryListPresentation
            items={items}
            actions={actions}
            isLoading={isLoading}
            moreActions={moreActions}
            sitename={sitename}
            infiniteScroll={infiniteScroll}
            showType
          />
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, object, string } = PropTypes
CategoryPresentation.propTypes = {
  actions: array,
  moreActions: array,
  isLoading: bool,
  items: object,
  sitename: string,
  infiniteScroll: object,
}

export default CategoryPresentation
