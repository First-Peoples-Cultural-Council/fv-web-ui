import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary AlphabetPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetPresentation({ isLoading, error, data }) {
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
          data.map(({ title, uid, src /*, relatedEntries*/ }) => {
            return (
              <div key={uid}>
                <div>{title}</div>
                <div>{src}</div>
              </div>
            )
          })}
      </div>
      <div>sidebar</div>
    </section>
  )
}
// PROPTYPES
const { bool, array, string, shape, arrayOf } = PropTypes
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
}

export default AlphabetPresentation
