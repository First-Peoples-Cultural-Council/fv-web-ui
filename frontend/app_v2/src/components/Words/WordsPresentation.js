import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DictionaryListPresentation from 'components/DictionaryList/DictionaryListPresentation'
import DictionarySearchInput from 'components/DictionarySearchInput'

/**
 * @summary WordsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsPresentation({ isLoading, items, actions, moreActions, sitename, infiniteScroll }) {
  return (
    <>
      <section className="bg-gradient-to-b from-word to-word-dark p-5">
        <div className="mx-auto lg:w-3/5">
          <DictionarySearchInput.Container docType={'WORD'} />
        </div>
      </section>
      <div className="grid grid-cols-11 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-2">
          <h2 className="hidden md:block text-2xl ml-8">Related Links</h2>
          <ul className="inline-block md:block list-none m-2 md:m-0 md:space-y-4 ">
            <li
              id={'WordsFilter'}
              className="inline-block transition duration-500 ease-in-out md:block md:my-2 md:mx-5 flex-grow"
            >
              <Link
                className="inline-block transition duration-500 ease-in-out md:block p-3 flex-grow rounded-lg capitalize cursor-pointer border-l-4 border-primary bg-primary text-white"
                to={`/${sitename}/categories?docType=WORD`}
              >
                Categories
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
WordsPresentation.propTypes = {
  actions: array,
  moreActions: array,
  isLoading: bool,
  items: object,
  sitename: string,
  infiniteScroll: object,
}

export default WordsPresentation
