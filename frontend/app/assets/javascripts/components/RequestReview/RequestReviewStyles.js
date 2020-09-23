import { makeStyles } from '@material-ui/core/styles'

export const RequestReviewStyles = makeStyles({
  button: {
    display: 'inline',
    margin: '0 2px',
  },
  base: {
    marginLeft: 'auto',
    display: 'inline',
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 'large',
  },
  dialogDescription: {
    textAlign: 'left',
  },
  dialogContent: {
    textAlign: 'left',
  },
  dialogTextField: {
    marginBottom: '15px',
    marginTop: '15px',
  },
  helperText: {
    fontSize: 'small',
    opacity: '0.6',
  },
})
