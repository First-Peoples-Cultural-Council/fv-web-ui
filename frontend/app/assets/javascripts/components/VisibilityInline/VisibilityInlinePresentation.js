import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

// FPCC
import '!style-loader!css-loader!./VisibilityInline.css'
import FVLabel from 'views/components/FVLabel'

/**
 * @summary VisibilityInlinePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityInlinePresentation({ dialectName, docVisibility }) {
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

  return (
    <div className="VisibilityInline">
      <div className="VisibilityInline__label">Who can see this word?</div>
      <Typography variant="body2">{generateVisibilityLabel(docVisibility)}</Typography>
    </div>
  )
}

// PROPTYPES
const { string } = PropTypes
VisibilityInlinePresentation.propTypes = {
  dialectName: string,
  docVisibility: string,
}

VisibilityInlinePresentation.defaultProps = {
  dialectName: '',
  docVisibility: '',
}

export default VisibilityInlinePresentation
