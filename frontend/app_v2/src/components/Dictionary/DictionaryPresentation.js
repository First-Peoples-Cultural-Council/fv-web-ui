import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'
import DictionarySearchInput from 'components/DictionarySearchInput'
import useIcon from 'common/useIcon'

/**
 * @summary DictionaryPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryPresentation({ docType, isLoading, items, actions, moreActions, sitename, infiniteScroll }) {
  const docTypeClass = docType.toLowerCase()
  return (
    <>
      <section className={`bg-gradient-to-b from-${docTypeClass} to-${docTypeClass}-dark p-5`}>
        <div className="mx-auto lg:w-3/5">
          <DictionarySearchInput.Container docType={docType} />
        </div>
      </section>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-5">
          <h2 className="hidden md:block text-2xl font-semibold ml-8">BROWSE BY:</h2>
          <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4 ">
            <li
              id={'DictionaryFilter'}
              className="inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow"
            >
              <Link
                className="inline-block transition duration-500 ease-in-out md:block p-3 flex-grow rounded-lg capitalize cursor-pointer text-xl text-fv-charcoal"
                to={`/${sitename}/categories?docType=${docType}`}
              >
                {useIcon('Categories', 'inline-flex fill-current h-8 mr-5')}Categories
              </Link>
              <Link
                className="inline-block transition duration-500 ease-in-out md:block p-3 flex-grow rounded-lg capitalize cursor-pointer text-xl text-fv-charcoal"
                to={`/${sitename}/categories?docType=${docType}`}
              >
                {useIcon('Alphabet', 'inline-flex fill-current h-10 mr-5')}Alphabet
              </Link>
            </li>
          </ul>
        </div>
        <div className="min-h-220 col-span-11 md:col-span-9">
          <DictionaryListPresentation
            items={items}
            actions={actions}
            isLoading={isLoading}
            moreActions={moreActions}
            sitename={sitename}
            infiniteScroll={infiniteScroll}
          />
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, object, string } = PropTypes
DictionaryPresentation.propTypes = {
  actions: array,
  moreActions: array,
  isLoading: bool,
  items: object,
  sitename: string,
  infiniteScroll: object,
}

export default DictionaryPresentation
