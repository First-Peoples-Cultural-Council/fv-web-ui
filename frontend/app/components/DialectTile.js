import React from 'react'
import PropTypes from 'prop-types'

// Material UI
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LockIcon from '@material-ui/icons/Lock'

import NavigationHelpers from 'common/NavigationHelpers'

const styles = () => ({
  card: {
    display: 'flex',
    height: 100,
    width: 360,
    margin: 10,
    textDecoration: 'none',
    border: 1,
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
  },
})

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
    <Card className={`${classes.card} Dialect`}>
      <CardMedia className={`${classes.cover} DialectCover`} image={dialectCoverImage} title={dialectTitle} />

      <div className={classes.details}>
        <LockIcon className={classes.privateIcon} />
        <CardContent className={classes.content}>
          <span className="DialectTitle fontBCSans">
            {dialectTitle}
            {actionIcon}
          </span>
          <div className="DialectDescription">{dialectDescription}</div>
        </CardContent>
      </div>
    </Card>
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
