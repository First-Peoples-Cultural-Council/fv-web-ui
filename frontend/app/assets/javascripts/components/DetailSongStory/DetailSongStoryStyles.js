import { makeStyles } from '@material-ui/core/styles'

export const DetailSongStoryStyles = makeStyles({
  base: {
    padding: '15px',
    margin: '15px 0',
  },
  gridRoot: {
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  title: {
    padding: '10px',
    marginBottom: '10px',
  },
  introductionTitle: {
    fontSize: '1.2em',
    marginTop: 0,
  },
  introduction: {
    padding: '10px',
  },
  introductionContent: {
    width: '99%',
    position: 'relative',
    padding: '15px',
    maxHeight: '265px',
    overflow: 'auto',
  },
  media: {
    margin: 4,
    marginTop: '10px',
  },
})
