import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

const styles = () => ({
  card: {
    display: 'flex',
    height: 100,
    maxWidth: 395,
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
    width: 100,
    height: 100,
  },
})

function DialectTile(props) {
  const { classes } = props
  return (
    <Card className={`${classes.card} Dialect`}>
      <CardMedia
        className={`${classes.cover} DialectCover`}
        image={props.dialectCoverImage}
        title="Live from space album cover"
      />
      <div className={`${classes.details} DialectData`}>
        <CardContent className={classes.content}>
          <span className="DialectTitle fontAboriginalSans">
            {props.dialectTitle}
            {props.actionIcon}
          </span>
          {props.dialectDescription}
        </CardContent>
      </div>
    </Card>
  )
}

DialectTile.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DialectTile)
