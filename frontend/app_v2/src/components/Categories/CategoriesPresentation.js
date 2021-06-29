import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
import useCategoryIcon from 'common/useCategoryIcon'

/**
 * @summary CategoriesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoriesPresentation({ categories, filter, setFilter, sitename, tabs }) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const [isGridView, setIsGridView] = useState(true)
  return (
    <div className="Categories">
      <div className="flex-1 flex items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              {/* Mobile View */}
              <div className="ml-6 bg-gray-100 p-0.5 rounded-lg flex items-center sm:hidden">
                <button
                  type="button"
                  onClick={() => setIsGridView(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal"
                >
                  {useIcon('HamburgerMenu', 'h-5 w-5')}
                  <span className="sr-only">Use list view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsGridView(true)}
                  className="ml-0.5 bg-white p-1.5 rounded-lg shadow-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal"
                >
                  {useIcon('Grid', 'h-5 w-5')}
                  <span className="sr-only">Use grid view</span>
                </button>
              </div>
            </div>
            <div className="">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  onChange={(event) => setFilter(event.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-fv-charcoal focus:border-fv-charcoal sm:text-sm rounded-lg"
                  defaultValue="all"
                >
                  <option value="word">Word</option>
                  <option value="phrase">Phrase</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block border-b border-gray-200 py-4">
                <h2 className="text-gray-500 text-sm p-1">SHOW CATEGORIES FOR:</h2>
                <div className="flex items-center">
                  <nav className="relative w-auto -mb-px flex-1 rounded-lg" aria-label="Tabs">
                    {tabs.map((tab, tabIndex) => (
                      <button
                        key={tab.label}
                        onClick={() => setFilter(tab.value)}
                        className={classNames(
                          tab.current
                            ? 'text-white bg-tertiaryB border-tertiaryB'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-gray-200',
                          tabIndex === 0 ? 'rounded-l-lg border-r-0' : '',
                          tabIndex === tabs.length - 1 ? 'rounded-r-lg border-l-0' : '',
                          'group relative min-w-auto flex-1 border-2 py-2 px-4 font-medium text-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal-light'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        {tab.icon !== 'All' ? useIcon(tab.icon, 'inline-flex fill-current w-5 h-5 mr-2') : ''}
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                  <div className="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
                    <button
                      type="button"
                      onClick={() => setIsGridView(false)}
                      className={`${
                        !isGridView
                          ? 'bg-white shadow-sm text-tertiaryB'
                          : 'hover:bg-white hover:shadow-sm text-gray-400'
                      } p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal`}
                    >
                      {useIcon('HamburgerMenu', 'fill-current h-5 w-5')}
                      <span className="sr-only">Use list view</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGridView(true)}
                      className={`${
                        isGridView
                          ? 'bg-white shadow-sm text-tertiaryB'
                          : 'hover:bg-white hover:shadow-sm text-gray-400'
                      } ml-0.5 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal`}
                    >
                      {useIcon('Grid', 'fill-current h-5 w-5')}
                      <span className="sr-only">Use grid view</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {isGridView ? (
              <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                <h2 id="gallery-heading" className="sr-only">
                  Recently viewed
                </h2>
                <ul
                  role="list"
                  className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                >
                  {categories.map((category) => (
                    <li key={category.id} className="relative">
                      <div className="focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-tertiaryB group block w-full rounded-lg bg-gray-100 overflow-hidden">
                        <a
                          key={category.id}
                          href={`/${sitename}/categories/${category.id}?docType=${filter}`}
                          className="bg-tertiaryB text-white text-lg group w-full px-5 py-10 rounded-lg flex flex-col items-center font-medium group-hover:opacity-75"
                        >
                          {useCategoryIcon(category.title, 'fill-current h-28 w-28')}
                          <span className="m-5">{category.title}</span>
                        </a>
                        <button type="button" className="absolute inset-0 focus:outline-none">
                          <span className="sr-only">Go to {category.title}</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                <h2 id="gallery-heading" className="sr-only">
                  Recently viewed
                </h2>
                <ul role="list" className="grid grid-cols-2 gap-x-3 gap-y-3 lg:grid-cols-3">
                  {categories?.map((category) => (
                    <li key={category.id} className="relative">
                      <div className="group block w-full overflow-hidden border-b-2 border-gray-200">
                        <a
                          key={category.id}
                          href={`/${sitename}/categories/${category.id}?docType=${filter}`}
                          className="group w-full px-5 rounded-lg inline-flex items-center group-hover:opacity-75"
                        >
                          <div className="inline-flex bg-white text-tertiaryB group p-2 rounded-lg items-center">
                            {useCategoryIcon(category.title, 'fill-current h-10 w-10')}
                          </div>
                          <div className="inline-flex m-3 text-lg font-medium">{category.title}</div>
                        </a>
                        <button type="button" className="absolute inset-0 focus:outline-none">
                          <span className="sr-only">Go to {category.title}</span>
                        </button>
                        {category?.children?.map((child) => (
                          <div key={child.id} className="group block w-full overflow-hidden ml-10">
                            <a
                              key={child.id}
                              href={`/${sitename}/categories/${child.id}`}
                              className="group w-full px-5 rounded-lg inline-flex items-center group-hover:opacity-75"
                            >
                              <div className="inline-flex bg-white text-tertiaryB group p-2 rounded-lg items-center">
                                {useCategoryIcon(child.title, 'fill-current h-6 w-6')}
                              </div>
                              <div className="inline-flex m-2 font-medium">{child.title}</div>
                            </a>
                            <button type="button" className="absolute inset-0 focus:outline-none">
                              <span className="sr-only">Go to {child.title}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
// PROPTYPES
const { array, func, string } = PropTypes
CategoriesPresentation.propTypes = {
  categories: array,
  filter: string,
  setFilter: func,
  sitename: string,
}

export default CategoriesPresentation
