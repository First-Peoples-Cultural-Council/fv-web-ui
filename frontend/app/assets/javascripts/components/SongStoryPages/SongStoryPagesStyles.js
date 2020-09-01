import { makeStyles } from '@material-ui/core/styles'

export const SongStoryPagesStyles = makeStyles({
  page: {
    padding: '30px',
    margin: '30px',
  },
  pageLinks: {
    marginLeft: '15px',
  },
  pageLink: {
    margin: '15px',
    display: 'inline-block',
  },
  pageNumber: {
    float: 'right',
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
    borderLeft: '1px solid Gainsboro',
  },
  dominantTranslation: {
    padding: '10%',
  },
  literalTranslation: {
    fontSize: '0.8em',
    paddingTop: '5%',
  },
})
