import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DictionaryList from 'components/DictionaryList'
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
function DictionaryPresentation({
  actions,
  currentOption,
  docType,
  handleSearchSubmit,
  handleTextFieldChange,
  infiniteScroll,
  isLoadingEntries,
  items,
  moreActions,
  onOptionClick,
  onSortByClick,
  options,
  resetSearch,
  searchValue,
  sitename,
  siteTitle,
  sorting,
  typePlural,
}) {
  const docTypeClass = docType.toLowerCase()
  return (
    <>
      <section className={`bg-gradient-to-b from-${docTypeClass} to-${docTypeClass}-dark p-5`}>
        <div className="mx-auto lg:w-3/5">
          <DictionarySearchInput.Presentation
            currentOption={currentOption}
            handleSearchSubmit={handleSearchSubmit}
            handleTextFieldChange={handleTextFieldChange}
            onOptionClick={onOptionClick}
            options={options}
            resetSearch={resetSearch}
            searchValue={searchValue}
            siteTitle={siteTitle}
            typePlural={typePlural}
          />
        </div>
      </section>
      <div className="grid grid-cols-12 md:p-2">
        <div className="col-span-11 md:col-span-2 mt-5">
          <h2 className="hidden md:block text-2xl font-semibold ml-7 text-fv-charcoal">BROWSE BY:</h2>
          <ul className="list-none">
            <li
              id={'CategoryLink'}
              className="inline-block md:block transition duration-500 ease-in-out md:my-3 md:ml-8"
            >
              <Link
                className="transition duration-500 ease-in-out p-3 flex-grow rounded-lg capitalize cursor-pointer text-xl text-fv-charcoal"
                to={`/${sitename}/categories?docType=${docType}`}
              >
                {useIcon('Categories', 'inline-flex fill-current h-8 lg:mr-5')}Categories
              </Link>
            </li>
            <li
              id={'AlphabetLink'}
              className="inline-block md:block transition duration-500 ease-in-out md:my-3 md:ml-8"
            >
              <Link
                className="transition duration-500 ease-in-out p-3 flex-grow rounded-lg capitalize cursor-pointer text-xl text-fv-charcoal"
                to={`/${sitename}/alphabet?docType=${docType}`}
              >
                {useIcon('Alphabet', 'inline-flex fill-current h-10 lg:mr-5')}Alphabet
              </Link>
            </li>
          </ul>
        </div>
        <div className="min-h-220 col-span-12 md:col-span-10">
          <DictionaryList.Presentation
            items={items}
            actions={actions}
            infiniteScroll={infiniteScroll}
            isLoading={isLoadingEntries}
            moreActions={moreActions}
            onSortByClick={onSortByClick}
            sitename={sitename}
            sorting={sorting}
          />
        </div>
      </div>
    </>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
DictionaryPresentation.propTypes = {
  actions: array,
  currentOption: object,
  docType: string,
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  infiniteScroll: object,
  isLoadingEntries: bool,
  items: object,
  moreActions: array,
  onOptionClick: func,
  onSortByClick: func,
  options: array,
  resetSearch: func,
  searchValue: string,
  sitename: string,
  siteTitle: string,
  sorting: object,
  typePlural: string,
}

export default DictionaryPresentation
