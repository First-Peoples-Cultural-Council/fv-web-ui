import { makeStyles } from '@material-ui/core/styles'

export const StoryCoverStyles = makeStyles({
  base: {
    border: 'solid',
  },
  header: {
    marginBottom: '10px',
  },
  introductionTitle: {
    fontSize: '1.2em',
    marginTop: 0,
  },
  introductionTranslations: {
    padding: '10px',
  },

  introductionContent: {
    width: '99%',
    position: 'relative',
    padding: '15px',
    maxHeight: '265px',
    overflow: 'auto',
  },
})
