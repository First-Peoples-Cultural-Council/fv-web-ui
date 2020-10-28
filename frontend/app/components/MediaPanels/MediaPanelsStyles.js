import { makeStyles } from '@material-ui/core/styles'

export const MediaPanelsStyles = makeStyles(() => ({
  label: {
    fontSize: '1.6rem',
  },
  tabsIndicator: {
    backgroundColor: 'Gray',
    height: '4px',
  },
  tabRoot: {
    opacity: 1,
    '&:hover': {
      backgroundColor: 'LightGray',
    },
  },
  tabsRoot: {
    color: '#000',
  },
  tabSelected: {
    color: '#000',
    '&:hover': {
      backgroundColor: 'LightGray',
    },
  },
}))
