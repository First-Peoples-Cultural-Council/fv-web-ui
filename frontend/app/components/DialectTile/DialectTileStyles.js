import { makeStyles } from '@material-ui/core/styles'

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
    '&:hover': {
      color: '#FFFFFF',
    },
  },
  dialogTitle: {
    fontSize: 'large',
    textAlign: 'center',
  },
  dialogDescription: {
    textAlign: 'center',
  },
  dialogContent: {
    textAlign: 'center',
  },
})
