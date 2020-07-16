import PropTypes from 'prop-types'
//FPCC
import useVisibility from 'DataSource/useVisibility'

/**
 * @summary VisibilitySelectData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilitySelectData({ children }) {
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()

  const handleVisibilityChange = (visibility, id) => {
    switch (visibility) {
      case 'team':
        return updateVisibilityToTeam(id)
      case 'members':
        return updateVisibilityToMembers(id)
      case 'public':
        return updateVisibilityToPublic(id)
      default:
        return null
    }
  }

  return children({
    handleVisibilityChange,
  })
}
// PROPTYPES
const { func } = PropTypes
VisibilitySelectData.propTypes = {
  children: func,
}

export default VisibilitySelectData
