import { makeStyles } from '@material-ui/core/styles'

export const StoryPagesStyles = makeStyles({
  page: {
    padding: '30px',
    margin: '30px',
  },
  gridRoot: {
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  media: {
    margin: 4,
  },
  textLanguage: {
    padding: '10%',
  },
  translation: {
    borderLeft: '1px solid #e1e1e1',
  },
  dominantTranslation: {
    padding: '10%',
  },
  literalTranslation: {
    fontSize: '0.8em',
    paddingTop: '5%',
  },
})
