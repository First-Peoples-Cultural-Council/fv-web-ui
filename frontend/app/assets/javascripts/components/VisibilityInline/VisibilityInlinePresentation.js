import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

// FPCC
import '!style-loader!css-loader!./VisibilityInline.css'
import FVLabel from 'views/components/FVLabel'
import VisibilitySelect from 'components/VisibilitySelect'

/**
 * @summary VisibilityInlinePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityInlinePresentation({
  computeEntities,
  dialectName,
  docVisibility,
  handleVisibilityChange,
  writePrivileges,
}) {
  function generateVisibilityLabel(visibility) {
    switch (visibility) {
      case 'team':
        return (
          <>
            {dialectName}&nbsp;
            <FVLabel transKey="team_only" defaultStr="Team Only" transform="first" />
          </>
        )
      case 'members':
        return (
          <>
            {dialectName}&nbsp;
            <FVLabel transKey="members" defaultStr="Members" transform="first" />
          </>
        )
      case 'public':
        return <FVLabel transKey="public" defaultStr="Public" transform="first" />
      default:
        return null
    }
  }

  return writePrivileges ? (
    <VisibilitySelect.Container
      docVisibility={docVisibility}
      handleVisibilityChange={handleVisibilityChange}
      computeEntities={computeEntities}
    />
  ) : (
    <div className="VisibilityInline">
      <div className="VisibilityInline__label">Who can see this word?</div>
      <Typography variant="body2">{generateVisibilityLabel(docVisibility)}</Typography>
    </div>
  )
}

// PROPTYPES
const { string, object, func, bool } = PropTypes
VisibilityInlinePresentation.propTypes = {
  computeEntities: object,
  dialectName: string,
  docVisibility: string,
  handleVisibilityChange: func,
  writePrivileges: bool,
}

VisibilityInlinePresentation.defaultProps = {
  dialectName: '',
  docVisibility: '',
  handleVisibilityChange: () => {},
  writePrivileges: false,
}

export default VisibilityInlinePresentation
