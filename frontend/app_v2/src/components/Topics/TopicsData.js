import {
  WIDGET_LIST_WORD,
  WIDGET_LIST_PHRASE,
  WIDGET_LIST_SONG,
  WIDGET_LIST_STORY,
  // WIDGET_LIST_MIXED,
  // WIDGET_LIST_GENERIC,
} from 'common/constants'
/**
 * @summary TopicsData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
export function adaptor(/*{response}*/) {
  return {
    topics: [
      {
        audio: 'nuxeo/nxfile/default/2bef9658-cd69-4705-a00a-f7c642598d0e/file:content/TestWav.wav',
        heading: 'Games',
        image:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/51ac02d0-27c3-44c6-8674-b13699369cd5/picture:views/2/content/Medium_TestPhoto.jpg?changeToken=0-0%2F10-0',
        subheading: 'word.definition',
        type: WIDGET_LIST_WORD,
        url: '/words/games',
      },
      {
        audio: '/nuxeo/nxfile/default/079ac1e8-dbb0-4ef3-b55c-f55a00a473a7/file:content/sample1.mp3',
        heading: 'Long song',
        // image: '/assets/images/bg-word2.jpg',
        subheading: 'word2.definition',
        type: WIDGET_LIST_WORD,
        url: '/words/long-song',
      },
      {
        audio: '/nuxeo/nxfile/default/000aa0a0-aaa0-0aa0-a00a-a00a00a000a0/file:content/BROKEN.mp3',
        heading: 'BROKEN',
        // image: '/assets/images/bg-word2.jpg',
        subheading: 'word2.definition',
        type: WIDGET_LIST_WORD,
        url: '/words/BROKEN',
      },
      {
        heading: 'list.heading',
        image: '/assets/images/bg-list.jpg',
        listCount: 20,
        type: WIDGET_LIST_PHRASE, // words | songs | stories | mixed
        url: '/lists/phrases',
      },
      {
        audio: 'nuxeo/nxfile/default/2bef9658-cd69-4705-a00a-f7c642598d0e/file:content/TestWav2.wav',
        heading: 'song.heading',
        image: '/assets/images/bg-song.jpg',
        subheading: 'song.subheading',
        type: WIDGET_LIST_SONG,
        url: '/songs/song.heading',
      },
      {
        heading: 'story.heading',
        image: '/assets/images/bg-story.jpg',
        subheading: 'story.subheading',
        type: WIDGET_LIST_STORY,
        url: '/stories/story.heading',
      },
      {
        heading: 'song.heading',
        image: '/assets/images/bg-song.jpg',
        subheading: 'song.subheading',
        type: WIDGET_LIST_SONG,
        url: '/songs/song.heading',
      },
      {
        heading: 'story2.heading',
        image: '/assets/images/bg-story2.jpg',
        subheading: 'story2.subheading',
        type: WIDGET_LIST_STORY,
        url: '/stories/story2.heading',
      },
      {
        heading: 'list2.heading',
        image: '/assets/images/bg-list2.jpg',
        listCount: 50,
        type: WIDGET_LIST_PHRASE,
        url: '/lists/phrases2',
      },
    ],
  }
}
function TopicsData() {
  const { topics } = adaptor()
  return {
    topics,
  }
}

export default TopicsData
