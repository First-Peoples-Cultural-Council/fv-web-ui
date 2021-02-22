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
  /*
   {
        uid: '1-2-3',
        title: 'RelatedWord',
        definitions: ['defn1', 'defn2'],
        src:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
      },
      */
  return (
    <>
      <h1
        className={`
          flex
          font-bold
          justify-center
          sm:text-5xl
          text-4xl
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
        Example words for <strong>{title}</strong>
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
    <section>
      <div>
        {data &&
          data.map(({ title, uid /*, src*/ }) => {
            return (
              <Link key={uid} to={`/${language}/alphabet/${title}`}>
                {title}
                {/* <div>{src}</div>
                {relatedEntries.map(({ uid: relatedUid, title: relatedTitle, definitions, src: relatedSrc }) => {
                  return (
                    <>
                      <div>{relatedUid}</div>
                      <div>{relatedTitle}</div>
                      <div>{definitions.map((definition, index)=>{
                        return <span key={index}>{definition}</span>
                      })}</div>
                      <div>{relatedSrc}</div>
                    </>
                  )
                })} */}
              </Link>
            )
          })}
      </div>
      {selectedData && AlphabetPresentationSelectedData(selectedData)}
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
