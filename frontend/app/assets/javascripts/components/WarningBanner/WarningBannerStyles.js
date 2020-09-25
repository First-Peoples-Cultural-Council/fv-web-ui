import { makeStyles } from '@material-ui/core/styles'

export const WarningBannerStyles = makeStyles(() => ({
  customPaper: {
    display: 'flex',
    backgroundColor: 'rgb(255, 244, 229)',
    padding: '15px 30px',
    borderRadius: '4px',
    fontWeight: '300',
    lineHeight: '1.43',
    letterSpacing: '0.01071em',
  },
  icon: {
    color: '#ff9800',
    opacity: '0.9',
    marginRight: '12px',
  },
}))
