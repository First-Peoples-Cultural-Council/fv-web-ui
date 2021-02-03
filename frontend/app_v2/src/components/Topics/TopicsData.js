import PropTypes from 'prop-types'

/**
 * @summary TopicsData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
export function adaptor(/*{response}*/) {
  // eslint-disable-next-line
  // console.log('TopicsData > adaptor', response)
  return {
    topics: [
      {
        audio: 'nuxeo/nxfile/default/2bef9658-cd69-4705-a00a-f7c642598d0e/file:content/TestWav.wav',
        heading: 'Games',
        // image: '/assets/images/bg-word.jpg',
        subheading: 'word.definition',
        type: 'word',
        url: '/words/word.heading',
      },
      {
        audio: '/nuxeo/nxfile/default/079ac1e8-dbb0-4ef3-b55c-f55a00a473a7/file:content/sample1.mp3',
        heading: 'Long song',
        image: '/assets/images/bg-word2.jpg',
        subheading: 'word2.definition',
        type: 'word',
        url: '/words/word2.heading',
      },
      {
        audio: '/nuxeo/nxfile/default/000aa0a0-aaa0-0aa0-a00a-a00a00a000a0/file:content/BROKEN.mp3',
        heading: 'BROKEN',
        image: '/assets/images/bg-word2.jpg',
        subheading: 'word2.definition',
        type: 'word',
        url: '/words/word2.heading',
      },
      {
        heading: 'list.heading',
        image: '/assets/images/bg-list.jpg',
        listCount: 20,
        listType: 'phrases', // words | songs | stories | mixed
        type: 'list',
        url: '/lists/phrases',
      },
      {
        audio: 'nuxeo/nxfile/default/2bef9658-cd69-4705-a00a-f7c642598d0e/file:content/TestWav2.wav',
        heading: 'song.heading',
        image: '/assets/images/bg-song.jpg',
        subheading: 'song.subheading',
        type: 'song',
        url: '/songs/song.heading',
      },
      {
        heading: 'story.heading',
        image: '/assets/images/bg-story.jpg',
        subheading: 'story.subheading',
        type: 'story',
        url: '/stories/story.heading',
      },
      {
        heading: 'song.heading',
        image: '/assets/images/bg-song.jpg',
        subheading: 'song.subheading',
        type: 'song',
        url: '/songs/song.heading',
      },
      {
        heading: 'story2.heading',
        image: '/assets/images/bg-story2.jpg',
        subheading: 'story2.subheading',
        type: 'story',
        url: '/stories/story2.heading',
      },
      {
        heading: 'list2.heading',
        image: '/assets/images/bg-list2.jpg',
        listCount: 50,
        listType: 'phrases', // words | songs | stories | mixed
        type: 'list',
        url: '/lists/phrases2',
      },
    ],
  }
}
function TopicsData({ children }) {
  const { topics } = adaptor()
  return children({
    topics,
  })
}
// PROPTYPES
const { func } = PropTypes
TopicsData.propTypes = {
  children: func,
}

export default TopicsData
