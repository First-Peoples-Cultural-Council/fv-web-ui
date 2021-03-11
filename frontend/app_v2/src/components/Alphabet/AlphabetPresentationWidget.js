import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AlphabetPresentationSelected from 'components/Alphabet/AlphabetPresentationSelected'
import useIcon from 'common/useIcon'
/**
 * @summary AlphabetPresentationWidget
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentationWidget({ language, isLoading, error, characters, selectedData, links }) {
  if (isLoading) {
    return (
      <div className="flex justify-around p-10">
        <button
          type="button"
          className="bg-fv-orange border border-transparent items-center inline-flex px-5 py-2 rounded-md shadow-sm text-base text-white ease-in-out"
          disabled
        >
          {useIcon('Spinner', 'animate-spin h-5 w-5 mr-3 fill-current')}
          Loading
        </button>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-10">
        <h1>Sorry, something went wrong!</h1>
        <p>Please report this error by emailing hello@firstvoices.com so that we can fix it.</p>
        <p>Include the link or action you took to get to this page.</p>
        <p>Thank You!</p>
      </div>
    )
  }
  return (
    <section className="py-12 bg-white" data-testid="AlphabetPresentationWidget">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h2 className="mb-12 relative z-10 text-center text-4xl text-fv-blue font-bold sm:text-5xl uppercase">
            <span className="inline-block bg-white px-4 sm:px-8 lg:px-20">Alphabet</span>
          </h2>
          <hr className="absolute z-0 w-full border-gray-300" style={{ top: '50%' }} />
        </div>
        <div className="grid grid-cols-7 gap-8 divide-x-2 divide-gray-300">
          <div className="col-span-7 sm:col-span-4">
            <div className="grid grid-cols-7 sm:grid-cols-5 lg:grid-cols-7">
              {characters &&
                characters.map(({ title, uid }) => {
                  return (
                    <Link
                      data-testid={
                        selectedData?.title === title ? 'AlphabetPresentationWidget__selectedCharacter' : undefined
                      }
                      className={`
                      border
                      col-span-1
                      font-medium
                      inline-flex
                      justify-center
                      m-1
                      p-5
                      rounded
                      shadow
                      text-2xl
                      ${selectedData?.title === title ? 'bg-fv-blue text-white' : ''}
                      `}
                      key={uid}
                      to={`/${language}/alphabet/${title}`}
                    >
                      {title}
                    </Link>
                  )
                })}
            </div>
          </div>
          <div className="col-span-7 sm:col-span-3 mt-8 sm:mt-0">
            {selectedData?.title === undefined && (
              <div
                data-testid="AlphabetPresentationWidget__noCharacter"
                className="text-center font-bold sm:text-3xl text-2xl text-fv-blue m-10"
              >
                Please select a character
              </div>
            )}
            {selectedData && AlphabetPresentationSelected()}
            {links && (
              <ul className="text-center mt-10">
                {links.map(({ url, title }, index) => {
                  return (
                    <li key={index} className="m-3">
                      <Link to={url}>{title}</Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { bool, array, string, shape, arrayOf, object } = PropTypes
AlphabetPresentationWidget.propTypes = {
  isLoading: bool,
  error: array,
  characters: arrayOf(
    shape({
      title: string,
      uid: string,
      src: string,
      relatedEntries: array,
    })
  ),
  language: string,
  selectedData: object,
  links: array,
}

AlphabetPresentationWidget.defaultProps = {
  onVideoClick: () => {},
}

export default AlphabetPresentationWidget
