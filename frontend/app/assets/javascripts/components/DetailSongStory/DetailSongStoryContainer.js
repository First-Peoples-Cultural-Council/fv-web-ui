import React from 'react'
import DetailSongStoryPresentation
  from 'components/DetailSongStory/DetailSongStoryPresentation'
import SongStoryData from 'components/SongStory/SongStoryData'

/**
 * @summary DetailSongStoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailSongStoryContainer() {
  return (
    <SongStoryData>
      {({
        book,
        openBookAction,
        pageCount,
        //Media
        audio,
        pictures,
        videos,
      }) => {
        return <DetailSongStoryPresentation
          book={book}
          openBookAction={openBookAction}
          pageCount={pageCount}
          // Media
          audio={audio}
          pictures={pictures}
          videos={videos}
        />
      }}
    </SongStoryData>
  )
}

export default DetailSongStoryContainer
