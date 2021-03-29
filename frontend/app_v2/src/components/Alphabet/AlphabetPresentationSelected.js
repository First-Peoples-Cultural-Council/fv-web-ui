import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// FPCC
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

const AlphabetPresentationSelected = ({ sitename, selectedData, onVideoClick, videoIsOpen }) => {
  const { title, relatedWords, audioUrl, videoUrl } = selectedData

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
        {audioUrl && (
          <div className="ml-2">
            <AudioMinimal.Container
              src={audioUrl}
              icons={{
                Play: useIcon('Audio', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                Pause: useIcon('PauseCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                Error: useIcon('TimesCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
              }}
            />
          </div>
        )}
      </h1>
      {relatedWords?.length > 0 && (
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
              {relatedWords.map(({ id: wordId, title: wordTitle, translations, audioUrl: wordAudioUrl }, index) => {
                const zebraStripe = index % 2 === 0 ? 'bg-gray-100' : ''
                return (
                  <tr key={index} className={zebraStripe}>
                    <td className="py-2 pl-5">
                      <Link to={`/${sitename}/word/${wordId}`}>{wordTitle}</Link>
                    </td>
                    <td className="p-2">
                      {wordAudioUrl && (
                        <AudioMinimal.Container
                          src={wordAudioUrl}
                          icons={{
                            Play: useIcon('Audio', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Pause: useIcon('PauseCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                            Error: useIcon('TimesCircle', 'fill-current h-6 w-6 sm:w-8 sm:h-8'),
                          }}
                        />
                      )}
                    </td>
                    <td className="py-2 pr-5">
                      <span>{translations.english}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
      {videoUrl && (
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
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => onVideoClick()}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between border-b border-solid border-gray-300 rounded-t">
                  <h3 className="p-2 text-2xl font-semibold">{title}</h3>
                  <button
                    className="ml-auto p-2 bg-transparent border-0 float-right leading-none font-semibold outline-none focus:outline-none text-black opacity-30 text-2xl"
                    onClick={() => onVideoClick()}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-2 flex-auto">
                  <video height="50" width="auto" src={videoUrl} controls autoPlay>
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      )}
    </>
  )
}

// PROPTYPES
const { array, bool, func, shape, string } = PropTypes

AlphabetPresentationSelected.propTypes = {
  sitename: string,
  selectedData: shape({
    title: string,
    id: string,
    relatedAudio: array,
    relatedVideo: array,
    relatedWords: array,
  }),
  onVideoClick: func,
  videoIsOpen: bool,
}

AlphabetPresentationSelected.defaultProps = {
  onVideoClick: () => {},
  videoIsOpen: false,
}

export default AlphabetPresentationSelected
