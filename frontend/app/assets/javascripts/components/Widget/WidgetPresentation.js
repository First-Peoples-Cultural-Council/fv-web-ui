import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./Widget.css'
import { CONTENT_FULL_WIDTH } from 'common/Constants'
/**
 * @summary WidgetPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.children
 * @param {string} props.title
 *
 * @returns {node} jsx markup
 */
function WidgetPresentation({ children, childrenHeader, title, variant }) {
  let classNameVariant
  switch (variant) {
    case CONTENT_FULL_WIDTH:
      classNameVariant = 'Widget--ContentFullWidth'
      break
    default:
      classNameVariant = ''
      break
  }
  return (
    <div className={`Widget ${classNameVariant}`}>
      <div className="Widget__header">
        <Typography className="Widget__title" variant="h6" component="h2">
          {title}
        </Typography>
        <div className="Widget__headerChildren">{childrenHeader}</div>
      </div>
      <div className="Widget__body">{children}</div>
    </div>
  )
}
// PROPTYPES
const { string, node, oneOf } = PropTypes
WidgetPresentation.propTypes = {
  title: string,
  childrenHeader: node,
  children: node,
  variant: oneOf([1]),
}

export default WidgetPresentation
