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
  const { /*uid,*/ title, src, relatedEntries, /*url,*/ videoSrc } = selectedData
  return (
    <>
      <h1
        data-testid="AlphabetPresentationSelected__header"
        className={`
            flex
            font-bold
            justify-center
            sm:text-4xl
            text-3xl
            text-center
            text-fv-blue
          `}
      >
        {title} {src && <AudioMinimal.Container src={src} />}
      </h1>
      <h2
        className={`
            sm:text-3xl
            text-2xl
            text-center
            text-fv-blue
          `}
      >
        Example words
      </h2>
      {relatedEntries && (
        <table>
          <tbody className="table-fixed">
            {relatedEntries.map(({ title: relatedTitle, definitions, src: relatedSrc, url: relatedUrl }, index) => {
              return (
                <tr key={index}>
                  <td className="w-1/2">
                    <Link to={relatedUrl}>{relatedTitle}</Link>
                    {relatedSrc && <AudioMinimal.Container src={relatedSrc} />}
                  </td>
                  <td>
                    {definitions.map((definition, indexInner) => (
                      <span key={indexInner}>{definition.translation}</span>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {videoSrc && (
        <div>
          <button
            onClick={onVideoClick}
            className="ml-4 whitespace-nowrap inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-3xl  shadow-sm text-base font-medium text-white bg-fv-orange hover:bg-fv-orange-dark"
          >
            {useIcon('PlayCircle', 'fill-current mr-2')}
            Play Video
          </button>
          {/*Modal*/}
          {videoIsOpen ? (
            <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
              <div className="absolute w-full h-full bg-gray-500 opacity-50" />
              <div className=" bg-white mx-auto rounded shadow-lg z-50 overflow-y-auto p-5 inline-flex justify-center">
                <video height={100} src={videoSrc} preload="none" controls>
                  Your browser does not support the video tag.
                </video>
                <div onClick={onVideoClick}>{useIcon('Close', 'h-8 w-8 fill-current text-black')}</div>
              </div>
            </div>
          ) : null}
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
