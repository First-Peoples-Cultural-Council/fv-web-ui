import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AlphabetPresentationSelected from 'components/Alphabet/AlphabetPresentationSelected'
/**
 * @summary AlphabetPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentation({ sitename, characters, selectedData, links, onVideoClick, videoIsOpen }) {
  return (
    <section className="py-12 bg-white" data-testid="AlphabetPresentation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h2 className="mb-5 relative z-10 text-center text-4xl text-fv-blue font-bold sm:text-5xl uppercase">
            <span className="inline-block bg-white px-4 sm:px-8 lg:px-20">Alphabet</span>
          </h2>
          <hr className="absolute z-0 w-full border-gray-300" style={{ top: '50%' }} />
        </div>
        <div
          className="
            flex
            font-bold
            items-center
            justify-center
            text-center
            text-fv-blue
            mb-5"
        >
          {links && (
            <ul className="flex text-center">
              {links.map(({ url, title }, index) => {
                return (
                  <li key={index} className="m-3 inline-flex">
                    <Link to={url}>{title}</Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="mb-5 grid grid-cols-4 md:grid-cols-7 lg:grid-cols-10 max-w-screen-lg mx-auto">
          {characters &&
            characters.map(({ title, id }) => {
              return (
                <Link
                  data-testid={selectedData?.title === title ? 'AlphabetPresentation__selectedCharacter' : undefined}
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
                  key={id}
                  to={`/${sitename}/alphabet/${title}`}
                >
                  {title}
                </Link>
              )
            })}
        </div>
        <div className="p-2">
          {selectedData?.title === undefined && (
            <div
              data-testid="AlphabetPresentation__noCharacter"
              className="text-center font-bold sm:text-3xl text-2xl text-fv-blue m-10"
            >
              Please select a character
            </div>
          )}
          {selectedData?.id && AlphabetPresentationSelected({ selectedData, sitename, onVideoClick, videoIsOpen })}
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { bool, array, func, string, shape, arrayOf, object } = PropTypes
AlphabetPresentation.propTypes = {
  characters: arrayOf(
    shape({
      title: string,
      id: string,
      relatedAudio: array,
      relatedLinks: array,
      relatedPictures: array,
      relatedVideo: array,
      relatedWords: array,
    })
  ),
  sitename: string,
  selectedData: object,
  links: array,
  onVideoClick: func,
  videoIsOpen: bool,
}

AlphabetPresentation.defaultProps = {
  onVideoClick: () => {},
}

export default AlphabetPresentation
