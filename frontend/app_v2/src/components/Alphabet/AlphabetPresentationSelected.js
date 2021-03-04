import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AudioMinimal from 'components/AudioMinimal'
import useIcon from 'common/useIcon'
/**
 * @summary AlphabetPresentationSelected
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

const AlphabetPresentationSelected = ({ selectedData, onVideoClick, videoIsOpen }) => {
  const { title, src, relatedEntries, videoSrc } = selectedData
  return (
    <>
      <h1
        data-testid="AlphabetPresentationSelected__header"
        className="
            flex
            font-bold
            items-center
            justify-center
            sm:text-4xl
            text-3xl
            text-center
            text-fv-blue
            mb-5"
      >
        {title}
        {src && (
          <div className="ml-2">
            <AudioMinimal.Container
              src={src}
              icons={{
                Play: useIcon('Audio', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                Pause: useIcon('PauseCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                Error: useIcon('TimesCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
              }}
            />
          </div>
        )}
      </h1>
      {relatedEntries && (
        <>
          <table className="table-auto mx-auto my-5 w-3/4">
            <thead>
              <tr>
                <th colSpan="3" className="sm:text-2xl font-medium text-xl text-center text-fv-blue p-3">
                  Example words
                </th>
              </tr>
              <tr>
                <th className=" hidden">Title</th>
                <th className="hidden">Audio</th>
                <th className="hidden">Definitions</th>
              </tr>
            </thead>
            <tbody className="py-2 px-10">
              {relatedEntries.map(({ title: relatedTitle, definitions, src: relatedSrc, url: relatedUrl }, index) => {
                const zebraStripe = index % 2 === 0 ? 'bg-gray-100' : ''

                return (
                  <tr key={index} className={zebraStripe}>
                    <td className="py-2 pl-5">
                      <Link to={relatedUrl}>{relatedTitle}</Link>
                    </td>
                    <td className="p-2">
                      {relatedSrc && (
                        <AudioMinimal.Container
                          src={relatedSrc}
                          icons={{
                            Play: useIcon('Audio', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Pause: useIcon('PauseCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Error: useIcon('TimesCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                          }}
                        />
                      )}
                    </td>
                    <td className="py-2 pr-5">
                      {definitions.map((definition, indexInner) => (
                        <span key={indexInner}>{definition.translation}</span>
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
      {videoSrc && (
        <div className="flex justify-center">
          <button
            onClick={onVideoClick}
            className="
            bg-fv-orange
            hover:bg-fv-orange-dark
            border
            border-transparent
            flex
            font-medium
            items-center
            justify-center
            px-5
            py-2
            rounded-3xl
            shadow-sm
            text-base
            text-center
            text-white"
          >
            {useIcon('PlayArrow', 'fill-current mr-2 -ml-1 h-8 w-8')}
            Play Video
          </button>
        </div>
      )}
      {/*Modal*/}
      {videoIsOpen && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="absolute w-full h-full bg-gray-500 opacity-50" />
          <div className=" bg-white mx-auto rounded shadow-lg z-50 overflow-y-auto p-5 inline-flex justify-center">
            <video height="100" width="auto" src={videoSrc} controls autoPlay>
              Your browser does not support the video tag.
            </video>
            <div onClick={onVideoClick}>{useIcon('Close', 'h-6 w-6 fill-current text-black')}</div>
          </div>
        </div>
      )}
    </>
  )
}

// PROPTYPES
const { bool, func, shape, string } = PropTypes

AlphabetPresentationSelected.propTypes = {
  selectedData: shape({
    uid: string,
    title: string,
    src: string,
    relatedEntries: string,
    url: string,
    videoSrc: string,
  }),
  videoIsOpen: bool,
  onVideoClick: func,
}

export default AlphabetPresentationSelected
