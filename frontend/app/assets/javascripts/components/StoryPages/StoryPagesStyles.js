import { makeStyles } from '@material-ui/core/styles'

export const StoryPagesStyles = makeStyles({
  root: {
    flexGrow: 1,
    flexWrap: 'wrap',
    // margin: '10%',
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
