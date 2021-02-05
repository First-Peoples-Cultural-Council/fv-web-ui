import React from 'react'
import PropTypes from 'prop-types'

// Material UI

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LockIcon from '@material-ui/icons/Lock'

import { DialectTileStyles, CustomTooltip } from './DialectTileStyles'
/**
 * @summary DialectTilePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectTilePresentation({
  dialectLogo,
  dialectTitle,
  actionIcon,
  isLoggedIn,
  isPrivate,
  href,
  onDialectClick,
}) {
  const classes = DialectTileStyles()
  // tooltip needs to apply DOM event listeners to its child element, hence use of forwardRef
  // see https://material-ui.com/components/tooltips/#custom-child-element
  const Tile = React.forwardRef(function Tile(props, ref) {
    return (
      <a href={href} onClick={onDialectClick} title={dialectTitle} {...props} ref={ref}>
        <Card className={`${classes.card} ${isPrivate ? 'DialectPrivate' : 'Dialect'}`}>
          <CardMedia className={`${classes.cover} DialectCover`} image={dialectLogo} title={dialectTitle} />
          {isPrivate ? <LockIcon className={classes.privateIcon} /> : null}
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <span className="DialectTitle fontBCSans">
                {dialectTitle}
                {actionIcon}
              </span>
            </CardContent>
          </div>
        </Card>
      </a>
    )
  })

  return isPrivate ? (
    <CustomTooltip
      title={
        isLoggedIn ? 'Private site: Please contact hello@firstvoices.com' : 'Private site: Please register to access'
      }
      placement="top"
    >
      <Tile />
    </CustomTooltip>
  ) : (
    <Tile />
  )
}
// PROPTYPES
const { bool, object, string, func } = PropTypes

DialectTilePresentation.propTypes = {
  dialectLogo: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  href: string.isRequired,
  isLoggedIn: bool.isRequired,
  isPrivate: bool.isRequired,
  onDialectClick: func.isRequired,
}

export default DialectTilePresentation
