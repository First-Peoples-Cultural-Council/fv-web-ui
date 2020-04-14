import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import NavigationHelpers from 'common/NavigationHelpers'

const { object, string, func } = PropTypes

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
})

function DialectTile(props) {
  const { classes, dialectCoverImage, dialectTitle, actionIcon, dialectDescription, href, pushWindowPath } = props
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
            <span className="DialectTitle fontAboriginalSans">
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

DialectTile.propTypes = {
  classes: object.isRequired,
  dialectCoverImage: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  dialectDescription: string,
  href: string.isRequired,
  pushWindowPath: func.isRequired,
}

export default withStyles(styles)(DialectTile)
