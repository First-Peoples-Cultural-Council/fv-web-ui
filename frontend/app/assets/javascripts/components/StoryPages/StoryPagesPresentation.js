import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FVLabel from 'views/components/FVLabel/index'
import MediaPanels from 'components/MediaPanels'
import Preview from 'views/components/Editor/Preview'
/**
 * @summary StoryPagesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} bookPages an array of the bookEntries reformatted by StoryPagesData for consumption by this layer
 *
 * @returns {node} jsx markup
 */
function StoryPagesPresentation({ bookPages }) {
  const StoryPage = ({ page }) => {
    // Audio
    const audio = page.audio.map((audioDoc) => {
      return <Preview minimal key={audioDoc.uid} expandedValue={audioDoc} type="FVAudio" />
    })

    return (
      <div key={page.key}>
        <div className="row">
          <div className="col-xs-12">
            <MediaPanels.Presentation videos={page.videos} images={page.images} />
          </div>
          <div className="col-xs-12 col-md-9">
            <div className={classNames('col-xs-6', 'fontBCSans')}>
              <div>{page.title}</div>
              {audio}
            </div>
            <div className={classNames('col-xs-6')} style={{ borderLeft: '1px solid #e1e1e1' }}>
              {page.dominantLanguageText}
            </div>
            <div className={classNames('col-xs-12')} style={{ marginTop: '15px' }}>
              <span key={page.uid}>
                <strong>
                  <FVLabel transKey="literal_translation" defaultStr="Literal Translation" transform="first" />
                </strong>{' '}
                : <span>{page.literalTranslation}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {bookPages.map(function createPageElements(page, i) {
        return <StoryPage key={i} page={page} />
      })}
    </div>
  )
}
// PROPTYPES
const { array } = PropTypes
StoryPagesPresentation.propTypes = {
  bookPages: array,
}

export default StoryPagesPresentation
