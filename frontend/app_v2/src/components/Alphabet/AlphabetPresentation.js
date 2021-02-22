import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import AudioMinimal from 'components/AudioMinimal'
/**
 * @summary AlphabetPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentation({ language, isLoading, error, data /*, selectedData*/ }) {
  // console.log('Pres', selectedData)
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
                {/* {src && <AudioMinimal.Container src={src} />} */}
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
      <div>sidebar</div>
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
