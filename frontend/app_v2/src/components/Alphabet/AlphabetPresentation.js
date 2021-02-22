import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AudioMinimal from 'components/AudioMinimal'
/**
 * @summary AlphabetPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
const AlphabetPresentationSelectedData = ({ /*uid,*/ title, src, relatedEntries, /*url,*/ videoSrc }) => {
  return (
    <>
      <h1
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
        <ul>
          {relatedEntries.map(({ title: relatedTitle, definitions, src: relatedSrc, url: relatedUrl }, index) => {
            return (
              <li key={index}>
                <Link to={relatedUrl}>{relatedTitle}</Link>
                {relatedSrc && <AudioMinimal.Container src={relatedSrc} />}
                {definitions.map((definition, indexInner) => (
                  <span key={indexInner}>{definition}</span>
                ))}
              </li>
            )
          })}
        </ul>
      )}
      {videoSrc && <Link to={videoSrc}>Video</Link>}
    </>
  )
}
AlphabetPresentationSelectedData.propTypes = {
  uid: string,
  title: string,
  src: string,
  relatedEntries: string,
  url: string,
  videoSrc: string,
}
function AlphabetPresentation({ language, isLoading, error, data, selectedData }) {
  if (isLoading) {
    return <div>some spinner if you want</div>
  }
  if (error) {
    return <div>some error if you want</div>
  }
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-12 text-4xl text-fv-blue font-bold uppercase sm:text-5xl">Alphabet</h2>
        <div className="grid grid-cols-6">
          <div className="col-span-6 sm:col-span-3">
            <div clasName="flex">
              {data &&
                data.map(({ title, uid /*, src*/ }) => {
                  return (
                    <Link
                      className="m-1 p-5 w-20 font-medium text-2xl inline-flex border rounded shadow"
                      key={uid}
                      to={`/${language}/alphabet/${title}`}
                    >
                      <div>{title}</div>
                      {/* <div>{src}</div>*/}
                    </Link>
                  )
                })}
            </div>
          </div>
          <div className="col-span-6 sm:col-span-3 mt-8 sm:mt-0">
            {selectedData && AlphabetPresentationSelectedData(selectedData)}
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { bool, array, string, shape, arrayOf, object } = PropTypes
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
}
// AlphabetPresentation.defaultProps = {
//   onCharacterClick: ()=>{},
// }

export default AlphabetPresentation
