import React from 'react'
import PropTypes from 'prop-types'

// Material UI
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LockIcon from '@material-ui/icons/Lock'
import Tooltip from '@material-ui/core/Tooltip'

import NavigationHelpers from 'common/NavigationHelpers'

const styles = () => ({
  card: {
    display: 'flex',
    height: 100,
    width: 360,
    margin: 10,
    textDecoration: 'none',
    border: 1,
    position: 'relative',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    minWidth: 100,
    minHeight: 100,
  },
  privateIcon: {
    color: '#D8AF06',
    position: 'absolute',
    right: '10px',
    top: '10px',
  },
})

const CustomTooltip = withStyles({
  tooltip: {
    backgroundColor: '#F7EAA3',
    borderColor: '#C9BB70',
    color: 'inherit',
    fontSize: '1.5rem',
    margin: '0',
    border: '1px solid #C9BB70',
    padding: '10px',
    textAlign: 'center',
  },
})(Tooltip)

function DialectTile({
  classes,
  dialectCoverImage,
  dialectTitle,
  actionIcon,
  dialectDescription,
  isWorkspaces,
  href,
  pushWindowPath,
}) {
  if (href.indexOf('sections') !== -1 || isWorkspaces) {
    return (
      <a
        href={NavigationHelpers.generateStaticURL(href)}
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(href, pushWindowPath, false)
        }}
        title={dialectTitle}
      >
        <Card className={`${classes.card} Dialect`}>
          <CardMedia className={`${classes.cover} DialectCover`} image={dialectCoverImage} title={dialectTitle} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <span className="DialectTitle fontBCSans">
                {dialectTitle}
                {actionIcon}
              </span>
              <div className="DialectDescription">{dialectDescription}</div>
            </CardContent>
          </div>
        </Card>
      </a>
    )
  }
  return (
    <CustomTooltip title="Private site: Please register to access" placement="top">
      <a
        href="/register"
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate('/register', pushWindowPath, false)
        }}
      >
        <Card className={`${classes.card} DialectPrivate`}>
          <CardMedia className={`${classes.cover} DialectCover`} image={dialectCoverImage} title={dialectTitle} />
          <LockIcon className={classes.privateIcon} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <span className="DialectTitle fontBCSans">
                {dialectTitle}
                {actionIcon}
              </span>
              <div className="DialectDescription">{dialectDescription}</div>
            </CardContent>
          </div>
        </Card>
      </a>
    </CustomTooltip>
  )
}
const { bool, object, string, func } = PropTypes
DialectTile.propTypes = {
  classes: object.isRequired,
  dialectCoverImage: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  dialectDescription: string,
  href: string.isRequired,
  isWorkspaces: bool.isRequired,
  pushWindowPath: func.isRequired,
}

export default withStyles(styles)(DialectTile)
