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
  const getFilterListItems = () => {
    return categories.map((category) => {
      return (
        <li
          key={category.id}
          id={'SearchFilter' + category.id}
          className="inline-block md:block transition duration-500 ease-in-out md:my-2 md:mx-5 flex-grow "
        >
          <Link
            className="transition duration-500 ease-in-out flex items-center cursor-pointer rounded-lg text-tertiaryB"
            to={`/${sitename}/categories/${category.id}?docType=${docType}`}
          >
            {useCategoryIcon(category.title, 'inline-flex p-2 rounded-lg fill-current h-14 w-14')}
            <div className="inline-flex text-lg font-medium">{category.title}</div>
          </Link>
        </li>
      )
    })
  }
  return (
    <>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-2 md:mt-5">
          <div className="inline-block md:block md:p-3">
            <ul
              className={`list-none m-2 md:space-y-4 ${
                currentCategory?.id === currentParentCategory?.id ? 'border-l-4 border-tertiaryB' : ''
              }`}
            >
              <li
                key={currentParentCategory.id}
                id={'SearchFilter' + currentParentCategory.id}
                className="inline-block md:block transition duration-500 ease-in-out md:my-2 md:mx-5 flex-grow"
              >
                <Link
                  className="transition duration-500 ease-in-out rounded-lg flex items-center cursor-pointer text-tertiaryB bg-gray-300"
                  to={`/${sitename}/categories/${currentParentCategory.id}?docType=${docType}`}
                >
                  {useCategoryIcon(currentParentCategory.title, 'inline-flex p-2 rounded-lg fill-current h-14 w-14')}
                  <div className="inline-flex text-lg font-medium">{currentParentCategory.title}</div>
                </Link>
              </li>
              {currentParentCategory?.children?.length > 0
                ? currentParentCategory?.children?.map((child) => {
                    return (
                      <li
                        key={child.id}
                        id={'SearchFilter' + child.id}
                        className={`inline-block md:block transition duration-500 ease-in-out md:my-2 md:mx-5 flex-grow ${
                          child.id === currentCategory.id ? 'border-l-4 border-tertiaryB' : ''
                        }`}
                      >
                        <Link
                          className={`transition duration-500 ease-in-out md:ml-10 rounded-lg flex items-center cursor-pointer text-tertiaryB ${
                            child.id === currentCategory.id ? 'bg-gray-300' : ''
                          }`}
                          to={`/${sitename}/categories/${child.id}?docType=${docType}`}
                        >
                          <div className="p-2 h-10 inline-flex text-lg font-medium">{child.title}</div>
                        </Link>
                      </li>
                    )
                  })
                : null}
            </ul>
          </div>
          <div className="inline-block md:block md:p-3">
            <ul className="list-none m-2 pt-5 md:space-y-4 border-t-2 border-gray-300">{getFilterListItems()}</ul>
          </div>
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
