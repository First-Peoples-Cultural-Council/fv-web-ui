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
  const isPrivate = !(href.indexOf('sections') !== -1 || isWorkspaces)

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

  // tooltip needs to apply DOM event listeners to its child element, hence use of forwardRef
  // see https://material-ui.com/components/tooltips/#custom-child-element
  const Tile = React.forwardRef(function Tile(props, ref) {
    const hrefToUse = isPrivate ? '/register' : NavigationHelpers.generateStaticURL(href)
    return (
      <a
        href={hrefToUse}
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(hrefToUse, pushWindowPath, false)
        }}
        title={dialectTitle}
        {...props}
        ref={ref}
      >
        <Card className={`${classes.card} ${isPrivate ? 'DialectPrivate' : 'Dialect'}`}>
          <CardMedia className={`${classes.cover} DialectCover`} image={dialectCoverImage} title={dialectTitle} />
          {isPrivate ? <LockIcon className={classes.privateIcon} /> : null}
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
  })

  // For Private Language Sites on Sections
  return isPrivate ? (
    <CustomTooltip title="Private site: Please register to access" placement="top">
      <Tile />
    </CustomTooltip>
  ) : (
    <Tile />
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
