import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

export const DialectTileStyles = makeStyles({
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

export const CustomTooltip = withStyles({
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
