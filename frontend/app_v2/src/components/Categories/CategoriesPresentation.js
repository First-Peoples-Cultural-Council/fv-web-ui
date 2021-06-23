import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary CategoriesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoriesPresentation({ categories, sitename }) {
  const tabs = [
    { name: 'Word Categories', href: '?docType=WORD', current: false },
    { name: 'Phrase Categories', href: '?docType=PHRASE', current: false },
    { name: 'All Categories', href: '?docType=BOTH', current: true },
  ]
  const currentCategory = '617e467e-cf92-4230-9b75-b567d3e903f7'

  const [isGridView, setIsGridView] = useState(true)
  return (
    <div className="Categories">
      <div className="flex-1 flex items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <h1 className="flex-1 text-2xl font-bold text-primary">Categories</h1>
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
                  {useIcon('MusicNote', 'h-5 w-5')}
                  <span className="sr-only">Use grid view</span>
                </button>
              </div>
            </div>
            <div className="mt-3 sm:mt-2">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-fv-charcoal focus:border-fv-charcoal sm:text-sm rounded-lg"
                  defaultValue="Recently Viewed"
                >
                  <option>Word</option>
                  <option>Phrase</option>
                  <option>Both</option>
                </select>
              </div>
              {/* Desktop View */}
              <div className="hidden sm:block">
                <div className="flex items-center border-b border-gray-200">
                  <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        aria-current={tab.current ? 'page' : undefined}
                        className={`${
                          tab.current
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        {tab.name}
                      </a>
                    ))}
                  </nav>
                  <div className="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
                    <button
                      type="button"
                      onClick={() => setIsGridView(false)}
                      className={`${
                        !isGridView ? 'bg-white shadow-sm text-primary' : 'hover:bg-white hover:shadow-sm text-gray-400'
                      } p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal`}
                    >
                      {useIcon('HamburgerMenu', 'fill-current h-5 w-5')}
                      <span className="sr-only">Use list view</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGridView(true)}
                      className={`${
                        isGridView ? 'bg-white shadow-sm text-primary' : 'hover:bg-white hover:shadow-sm text-gray-400'
                      } ml-0.5 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fv-charcoal`}
                    >
                      {useIcon('MusicNote', 'fill-current h-5 w-5')}
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
                      <div className="focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary group block w-full rounded-lg bg-gray-100 overflow-hidden">
                        <a
                          key={category.id}
                          href={`/${sitename}/categories/${category.id}`}
                          className="bg-tertiaryB text-white text-lg group w-full px-5 py-10 rounded-lg flex flex-col items-center font-medium group-hover:opacity-75"
                          aria-current={category.id === currentCategory ? 'page' : undefined}
                        >
                          {useIcon('MusicNote', 'fill-current h-28 w-28')}
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
                <ul
                  role="list"
                  className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {categories.map((category) => (
                    <li key={category.id} className="relative">
                      <div className="group block w-full rounded-lg overflow-hidden">
                        <a
                          key={category.id}
                          href={`/${sitename}/categories/${category.id}`}
                          className="group w-full px-5 rounded-lg inline-flex items-center group-hover:opacity-75"
                          aria-current={category.id === currentCategory ? 'page' : undefined}
                        >
                          <div className="inline-flex bg-tertiaryB text-white group p-2 rounded-lg items-center">
                            {useIcon('MusicNote', 'fill-current h-6 w-6')}
                          </div>
                          <div className="inline-flex m-3 text-lg font-medium">{category.title}</div>
                        </a>
                        <button type="button" className="absolute inset-0 focus:outline-none">
                          <span className="sr-only">Go to {category.title}</span>
                        </button>
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
const { string } = PropTypes
CategoriesPresentation.propTypes = {
  sitename: string,
}

export default CategoriesPresentation
