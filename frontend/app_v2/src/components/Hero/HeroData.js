import PropTypes from 'prop-types'

/**
 * @summary HeroData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function HeroData({ children }) {
  return children({
    log: 'Output from HeroData',
  })
}
// PROPTYPES
const { func } = PropTypes
HeroData.propTypes = {
  children: func,
}

export default HeroData
