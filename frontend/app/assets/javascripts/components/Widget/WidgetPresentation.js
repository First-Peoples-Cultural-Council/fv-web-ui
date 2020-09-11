import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./Widget.css'
import { TABLE_FULL_WIDTH } from 'common/Constants'
/**
 * @summary WidgetPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.children
 * @param {node} props.childrenHeader Slot for jsx in the header area, initially used for adding links
 * @param {number} props.variant Specify presentation variant/modifier
 * @param {string} props.title
 *
 * @returns {node} jsx markup
 */
function WidgetPresentation({ children, childrenHeader, title, variant }) {
  let classNameVariant = ''
  if (variant === TABLE_FULL_WIDTH) {
    classNameVariant = 'Widget--fullWidth'
  }
  return (
    <div className={`Widget ${classNameVariant}`}>
      <div className="Widget__header">
        <Typography className="Widget__title" variant="h6" component="h2">
          {title}
        </Typography>
        {childrenHeader && <div className="Widget__headerChildren">{childrenHeader}</div>}
      </div>
      <div className="Widget__body">{children}</div>
    </div>
  )
}
// PROPTYPES
const { string, node, oneOf } = PropTypes
WidgetPresentation.propTypes = {
  children: node,
  childrenHeader: node,
  title: string,
  variant: oneOf([TABLE_FULL_WIDTH]),
}

export default WidgetPresentation
