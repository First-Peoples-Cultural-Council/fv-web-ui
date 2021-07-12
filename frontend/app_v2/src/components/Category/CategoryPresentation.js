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
  actions,
  categories,
  currentCategory,
  currentParentCategory,
  docType,
  infiniteScroll,
  isLoading,
  items,
  moreActions,
  sitename,
}) {
  const getConditionalClass = (category) => {
    if (category.id === currentCategory.id || category.id === currentParentCategory.id) {
      return 'border-l-4 border-tertiaryB bg-tertiaryB text-white'
    }
    return 'text-tertiaryB'
  }

  const getCurrentCategory = () => {
    return (
      <>
        <Link
          className="transition duration-500 ease-in-out md:my-2 md:mx-5 rounded-lg flex items-center cursor-pointer border-l-4 border-tertiaryB bg-tertiaryB text-white"
          to={`/${sitename}/categories/${currentParentCategory.id}?docType=${docType}`}
        >
          {useCategoryIcon(currentParentCategory.title, 'inline-flex p-2 rounded-lg fill-current h-10 w-10')}
          <div className="inline-flex text-lg font-medium">{currentParentCategory.title}</div>
        </Link>
        {currentParentCategory?.children?.length > 0
          ? currentParentCategory?.children?.map((child) => {
              return (
                <Link
                  key={child.id}
                  className={`transition duration-500 ease-in-out md:my-2 md:mr-5 ml-10 rounded-lg flex items-center cursor-pointer ${getConditionalClass(
                    child
                  )}`}
                  to={`/${sitename}/categories/${child.id}?docType=${docType}`}
                >
                  {useCategoryIcon(child.title, 'inline-flex p-2 rounded-lg fill-current h-10 w-10')}
                  <div className="inline-flex text-lg font-medium">{child.title}</div>
                </Link>
              )
            })
          : null}
      </>
    )
  }

  const getFilterListItems = () => {
    return categories.map((category) => {
      return (
        <li
          key={category.id}
          id={'SearchFilter' + category.id}
          className="inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow rounded-lg text-tertiaryB"
        >
          <Link
            className={'transition duration-500 ease-in-out flex items-center  cursor-pointer '}
            to={`/${sitename}/categories/${category.id}?docType=${docType}`}
          >
            {useCategoryIcon(category.title, 'inline-flex p-2 rounded-lg fill-current h-10 w-10')}
            <div className="inline-flex text-lg font-medium">{category.title}</div>
          </Link>
        </li>
      )
    })
  }
  return (
    <>
      <h2 className="hidden md:block text-2xl ml-8">Categories</h2>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-2  divide-y-4 divide-gray-300">
          <div className="inline-flex align-center md:block m-2 md:m-0 h-56">{getCurrentCategory()}</div>
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
  categories: array,
  currentCategory: object,
  currentParentCategory: object,
  docType: string,
  infiniteScroll: object,
  isLoading: bool,
  items: object,
  moreActions: array,
  sitename: string,
}

export default CategoryPresentation
