import PropTypes from 'prop-types'

/**
 * @summary DetailSongData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DetailSongData({children}) {
  return children({
    log: 'Output from DetailSongData',
  })
}

// PROPTYPES
const {func} = PropTypes
DetailSongData.propTypes = {
  children: func,
}

export default DetailSongData
