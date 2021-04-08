import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AlphabetPresentationSelected from 'components/Alphabet/AlphabetPresentationSelected'
/**
 * @summary AlphabetPresentationWidget
 * @component
 *
 * @param {object} props
 * @param {func} onCharacterClick is for Widget view only
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentationWidget({ characters, onCharacterClick, links, selectedData, onVideoClick, videoIsOpen }) {
  return (
    <section className="py-12 bg-white" data-testid="AlphabetPresentationWidget">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h2 className="mb-12 relative z-10 text-center text-4xl text-fv-blue font-bold sm:text-5xl uppercase">
            <span className="inline-block bg-white px-4 sm:px-8 lg:px-20">Alphabet</span>
          </h2>
          <hr className="absolute z-0 w-full border-gray-300" style={{ top: '50%' }} />
        </div>
        <div className="grid grid-cols-7 gap-8 md:divide-x-2 divide-gray-300">
          <div className="col-span-7 md:col-span-4">
            <div className="grid grid-cols-7 md:grid-cols-5 lg:grid-cols-7">
              {characters &&
                characters.map(({ title, id }) => {
                  return (
                    <button
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
                      key={id}
                      onClick={() => onCharacterClick(title)}
                    >
                      {title}
                    </button>
                  )
                })}
            </div>
          </div>
          <div className="col-span-7 md:col-span-3 mt-8 md:mt-0">
            {selectedData?.title === undefined && (
              <div
                data-testid="AlphabetPresentationWidget__noCharacter"
                className="text-center font-bold sm:text-3xl text-2xl text-fv-blue m-10"
              >
                Please select a character
              </div>
            )}
            {selectedData?.id && AlphabetPresentationSelected({ selectedData, onVideoClick, videoIsOpen })}
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
const { bool, array, func, string, shape, arrayOf, object } = PropTypes
AlphabetPresentationWidget.propTypes = {
  characters: arrayOf(
    shape({
      title: string,
      id: string,
      src: string,
      relatedEntries: array,
    })
  ),
  onCharacterClick: func,
  selectedData: object,
  links: array,
  onVideoClick: func,
  videoIsOpen: bool,
}

AlphabetPresentationWidget.defaultProps = {
  onCharacterClick: () => {},
  onVideoClick: () => {},
}

export default AlphabetPresentationWidget
