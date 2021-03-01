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
function AlphabetPresentation({ language, isLoading, error, data, selectedData, onVideoClick, links, videoIsOpen }) {
  if (isLoading) {
    return <div>some spinner if you want</div>
  }
  if (error) {
    return <div>some error if you want</div>
  }
  return (
    <section className="py-12 bg-white" data-testid="AlphabetPresentation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h2 className="mb-12 relative z-10 text-center text-4xl text-fv-blue font-bold sm:text-5xl uppercase">
            <span
              className={`
            inline-block
            px-4
            sm:px-8
            lg:px-20

            bg-white
          `}
            >
              Alphabet
            </span>
          </h2>
          <hr className="absolute z-0 w-full" style={{ top: '50%' }} />
        </div>
        <div className="grid grid-cols-6 gap-8 ">
          <div className="col-span-6 sm:col-span-3">
            <div className="grid grid-cols-7 sm:grid-cols-5 lg:grid-cols-7">
              {data &&
                data.map(({ title, uid }) => {
                  return (
                    <Link
                      data-testid={
                        selectedData?.title === title ? 'AlphabetPresentation__selectedCharacter' : undefined
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
          <div className="col-span-6 sm:col-span-3 mt-8 sm:mt-0">
            {selectedData?.title === undefined && (
              <div data-testid="AlphabetPresentation__noCharacter">Please select a character</div>
            )}
            {selectedData && AlphabetPresentationSelected({ selectedData, onVideoClick, videoIsOpen })}
            {links && (
              <div className="">
                {links.map(({ url, title }, index) => {
                  return (
                    <Link key={index} to={url}>
                      {title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { bool, array, func, string, shape, arrayOf, object } = PropTypes
AlphabetPresentation.propTypes = {
  isLoading: bool,
  error: array, // TODO: CONFIRM?
  data: arrayOf(
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
  videoIsOpen: bool,
  onVideoClick: func,
}

AlphabetPresentation.defaultProps = {
  onVideoClick: () => {},
}

export default AlphabetPresentation
