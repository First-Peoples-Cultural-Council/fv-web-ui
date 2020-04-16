import { getLiteralUnicodeValues } from 'common/UnicodeHelpers'
import PropTypes from 'prop-types'
const LiteralUnicodeData = (props) => {
  const { children, character } = props
  return children(getLiteralUnicodeValues(character))
}

const { func, string } = PropTypes
LiteralUnicodeData.propTypes = {
  character: string.isRequired,
  children: func.isRequired,
}

export default LiteralUnicodeData
