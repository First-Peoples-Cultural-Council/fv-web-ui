import { makeStyles } from '@material-ui/core/styles'

export const WarningBannerStyles = makeStyles(() => ({
  customPaper: {
    display: 'flex',
    backgroundColor: 'rgb(255, 244, 229)',
    padding: '15px 30px',
    borderRadius: '4px',
    alignItems: 'center',
  },
  icon: {
    fontSize: '1.8em',
    color: '#ff9800',
    opacity: '0.9',
    marginRight: '20px',
  },
}))
